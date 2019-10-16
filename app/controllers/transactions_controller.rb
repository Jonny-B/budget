require 'plaid'

class TransactionsController < ActionController::API
  def get

    access_token = UserToken.find_by(user_id: UserToken.find_by(token: params["userToken"]).user_id, token_type: "plaid_token").token

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

    render json: transform_plaid_transactions(transactions).to_json
  end

  def transform_plaid_transactions(transactions)
    transactions.map do |t|
      # transactions = [
      #     {assignCategory: 'Category1', date: '01/01/19', description: 'Kroger', charge: 59.99, hidden: true, id: 1},
      #     {assignCategory: 'Category2', date: '01/01/19', description: 'Nation Star', charge: 1500.00, hidden: false, id: 2},
      #     {assignCategory: 'Category1', date: '01/01/19', description: 'Kroger Gas', charge: 32.00, hidden: false, id: 3},
      #     {assignCategory: 'Category3', date: '01/01/19', description: 'Bath and Body Works', charge: 1000000, hidden: false, id: 4},
      #     {assignCategory: 'Select One', date: '01/01/19', description: 'Lorem Ipsummmmmm', charge: 20.33, hidden: false, id: 5},
      # ]
      #
      { assignCategory: 'Select One', date: t.date, description: t.name, charge: t.amount, hidden: false, id: t.transaction_id }
    end
  end
end
