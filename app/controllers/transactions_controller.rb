class TransactionsController < ActionController::API
  def get
    transactions = [
        {assignCategory: 'Category1', date: '01/01/19', description: 'Kroger', charge: 59.99, hidden: true, id: 1},
        {assignCategory: 'Category2', date: '01/01/19', description: 'Nation Star', charge: 1500.00, hidden: false, id: 2},
        {assignCategory: 'Category1', date: '01/01/19', description: 'Kroger Gas', charge: 32.00, hidden: false, id: 3},
        {assignCategory: 'Category3', date: '01/01/19', description: 'Bath and Body Works', charge: 1000000, hidden: false, id: 4},
        {assignCategory: 'Select One', date: '01/01/19', description: 'Lorem Ipsummmmmm', charge: 20.33, hidden: false, id: 5},
    ]

    render json: transactions.to_json
  end

  def create
    user = params["userToken"]
    transactions = params["transactions"]
    access_token = Transaction.find_by()

  end
end
