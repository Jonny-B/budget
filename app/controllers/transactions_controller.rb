require 'plaid'

class TransactionsController < ActionController::API
  def get
    user_token = UserToken.find_by(token: params["userToken"])
    user_id = user_token.nil? ? nil : user_token.user_id

    plaid_tokens = UserToken.where(user_id: user_id, token_type: "plaid_token").map {|t| t.token}
    access_tokens = plaid_tokens.length > 0 ? plaid_tokens : nil

    all_accounts_transactions = []
    date = params["date"] == "" ? user_token.user.last_viewed.split('/') : params["date"].split('/')
    # TODO Remove this if/else buxfer stuff when plaid gets their act together and starts working with cap one.
    if params["transactions"].nil?
      x = 0

    else
      begin
        unless access_tokens.nil?
          plaid_env = Rails.application.config.plaid_env
          client_id = Rails.application.config.client_id
          secret = Rails.application.config.secret
          public_key = Rails.application.config.public_key
          client = Plaid::Client.new(env: plaid_env,
                                     client_id: client_id,
                                     secret: secret,
                                     public_key: public_key)

          start_date = Date.new(date[0].to_i, date[1].to_i, 1).strftime('%Y-%m-%d')
          end_date = Date.new(date[0].to_i, date[1].to_i, -1).strftime('%Y-%m-%d')

          access_tokens.each do |access_token|
            transaction_response = client.transactions.get(access_token, start_date, end_date)
            transactions = transaction_response.transactions
            # the transactions in the response are paginated, so make multiple calls while increasing the offset to retrieve all transactions
            while transactions.length < transaction_response['total_transactions']
              transaction_response = client.transactions.get(access_token, start_date, end_date, offset: transactions.length)
              transactions += transaction_response.transactions
            end
            all_accounts_transactions += transactions
          end
          all_accounts_transactions = transform_plaid_transactions(all_accounts_transactions)

          # user = User.find_by(id: user_id)
          all_accounts_transactions.each do |t|
            unless Transaction.find_by(transaction_id: t[:id]) && user_id
              transaction = Transaction.new(transaction_id: t[:id], user_id: user_id, description: t[:description], charge: t[:charge], date: t[:date], hidden: false, edited: false)
              transaction.save
            end
          end
        end
        render json: {transactions: all_accounts_transactions, date: date}.to_json
      rescue
        render json: {message: $!.error_code, status: 500, token: user_token.token}.to_json
      end
    end
  end

  def buxfer
    token = getResponse("login?userid=#{params["userid"]}&password=#{params["password"]}")['token']

    user_token = UserToken.find_by(token: params["userToken"])
    user_id = user_token.nil? ? nil : user_token.user_id
    date = params["date"] == "" ? user_token.user.last_viewed.split('/') : params["date"].split('/')

    current_month = true
    page = 1
    all_accounts_transactions = []
    # Paginate through transaction to get every transaction for the current month.
    while current_month
      response = getResponse("transactions?token=#{token}&page=#{page}")
      response['transactions'].each { |transaction|[0]
        # Transactions from Buxfer have a leading 0 dates from the front end do not. Needed to account for this.
        d = transaction['normalizedDate'].split('-')
        transaction_month = d[1][0] == '0' ? d[1][1] : d[1]
        transaction_year = d[0]
        if transaction_year.to_i < date[0].to_i || transaction_month.to_i < date[1].to_i
          # Stop looping if you are in last year or in last month.
          current_month = false
        elsif transaction_month != date[1]
          # Next if you are in the wrong month
          next
        else
          # Saves only the wanted month
          all_accounts_transactions.push(transaction)
        end
      }
      page += 1
    end


    all_accounts_transactions = transform_buxfer_transactions(all_accounts_transactions)

    # user = User.find_by(id: user_id)
    all_accounts_transactions.each do |t|
      unless Transaction.find_by(transaction_id: t[:id]) && user_id
        transaction = Transaction.new(transaction_id: t[:id], user_id: user_id, description: t[:description], charge: t[:charge], date: t[:date], hidden: false, edited: false)
        transaction.save
      end
    end

    render json: {transactions: all_accounts_transactions, date: date}.to_json
  end

  def patch
    d = params['updateData']
    transaction = Transaction.find_by(transaction_id: d[:id])
    category = Category.find_by(category: d[:assignCategory], effective_date: params['date'])
    category_id = category.nil? ? nil : category.id
    # TODO when categories are created we will need to wire up the dropdowns to have the category id and then pass that around.

    transaction.update(category_id: category_id, date: d[:date], description: d[:description], charge: d[:charge], hidden: d[:hidden], edited: true, updated_at: Date.today)
    transaction.save
  end

  def getResponse(url)

    http = Net::HTTP.new("www.buxfer.com", 443)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    data = http.get("/api/#{url}", nil)

    result = JSON.parse(data.body)
    response = result['response']
    if response.nil?
      puts "Error: no response from Buxfer. Check request url."
      exit 1;
    elsif response['status'] != "OK"
      puts "Error: #{response['status'].gsub(/ERROR: /, '')}"
      exit 1;
    end

    return response
  end

  def transform_plaid_transactions(transactions)
    edited_transaction_ids = Transaction.where(edited: true).to_a.map {|e| e.transaction_id}
    transactions.map do |t|
      # Check to see if this transaction has been edited and stored in our Db. If so look it up and swap t with it.
      if edited_transaction_ids.include?(t.transaction_id)
        t = Transaction.find_by(transaction_id: t.transaction_id)
        c = Category.find_by(id: t.category_id)
        assignCategory = c.nil? ? "Select One" : c.category
        {assignCategory: assignCategory, date: t.date, description: t.description, charge: t.charge, hidden: t.hidden, id: t.transaction_id}
      else
        {assignCategory: 'Select One', date: t.date, description: t.name, charge: t.amount, hidden: false, id: t.transaction_id}
      end
    end
  end

  def transform_buxfer_transactions(transactions)
    edited_transaction_ids = Transaction.where(edited: true).to_a.map {|e| e.transaction_id}
    transactions.map do |t|
      # Check to see if this transaction has been edited and stored in our Db. If so look it up and swap t with it.
      if edited_transaction_ids.include?(t["id"].to_s)
        t = Transaction.find_by(transaction_id: t["id"].to_s)
        c = Category.find_by(id: t.category_id)
        assignCategory = c.nil? ? "Select One" : c.category
        {assignCategory: assignCategory, date: t.date, description: t.description, charge: t.charge, hidden: t.hidden, id: t.transaction_id}
      else
        {assignCategory: 'Select One', date: t["normalizedDate"], description: t["description"], charge: t["amount"], hidden: false, id: t["id"]}
      end
    end
  end
end
