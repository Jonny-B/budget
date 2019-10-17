require 'plaid'

class TransactionsController < ActionController::API
  def get
    user = UserToken.find_by(token: params["userToken"])
    user_id = user.nil? ? nil : user.user_id

    user_token = UserToken.find_by(user_id: user_id, token_type: "plaid_token")
    access_token = user_token.nil? ? nil : user_token.token

    transactions = []
    unless access_token.nil?
      client = Plaid::Client.new(env: :sandbox,
                                 client_id: '5d923beaa466f10012dc1363',
                                 secret: '39395b2e8800dadd85947f7fad7bee',
                                 public_key: 'b6eae93fa88deb27355f14563287d5')


      transaction_response = client.transactions.get(access_token, '2019-01-01', '2019-12-01')
      transactions = transaction_response.transactions

      # the transactions in the response are paginated, so make multiple calls while increasing the offset to retrieve all transactions
      while transactions.length < transaction_response['total_transactions']
        transaction_response = client.transactions.get(access_token, '2016-07-12', '2017-01-09', offset: transactions.length)
        transactions += transaction_response.transactions
      end
      transactions = transform_plaid_transactions(transactions)

      # user = User.find_by(id: user_id)
      transactions.each do |t|
        unless Transaction.find_by(transaction_id: t[:id]) && user_id
          transaction = Transaction.new(user_id: user_id, transaction_id: t[:id], hidden: false, edited: false)
          transaction.save
        end
      end
    end
    render json: transactions.to_json
  end

  def patch
    d = params['updateData']
    transaction = Transaction.find_by(transaction_id: d[:id])
    # TODO when categories are created we will need to wire up the dropdowns to have the category id and then pass that around.
    transaction.update(category_id: nil, date: d[:date], description: d[:description], charge: d[:charge], hidden: d[:hidden], edited: true, updated_at: Date.today)
    transaction.save
  end

  def transform_plaid_transactions(transactions)
    edited_transaction_ids = Transaction.where(edited: true).to_a.map {|e| e.transaction_id}
    transformed = transactions.map do |t|
      # Check to see if this transaction has been edited and stored in our Db. If so look it up and swap t with it.
      if edited_transaction_ids.include?(t.transaction_id)
        t = Transaction.find_by(transaction_id: t.transaction_id)
        {assignCategory: 'Select One', date: t.date, description: t.description, charge: t.charge, hidden: t.hidden, id: t.transaction_id}
      else
        {assignCategory: 'Select One', date: t.date, description: t.name, charge: t.amount, hidden: false, id: t.transaction_id}
      end
    end
  end
end
