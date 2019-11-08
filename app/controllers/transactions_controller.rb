require 'plaid'

class TransactionsController < ActionController::API
  def get
    user_token = UserToken.find_by(token: params["userToken"])
    user_id = user_token.nil? ? nil : user_token.user_id

    plaid_tokens = UserToken.where(user_id: user_id, token_type: "plaid_token").map {|t| t.token}
    access_tokens = plaid_tokens.length > 0 ? plaid_tokens : nil

    all_accounts_transactions = []
    date = params["date"] == "" ? user_token.user.last_viewed.split('/') : params["date"].split('/')
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

  def patch
    d = params['updateData']
    transaction = Transaction.find_by(transaction_id: d[:id])
    category = Category.find_by(category: d[:assignCategory], effective_date: params['date'])
    category_id = category.nil? ? nil : category.id
    # TODO when categories are created we will need to wire up the dropdowns to have the category id and then pass that around.

    transaction.update(category_id: category_id, date: d[:date], description: d[:description], charge: d[:charge], hidden: d[:hidden], edited: true, updated_at: Date.today)
    transaction.save
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
end
