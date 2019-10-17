class BudgetsController < ActionController::API
  def get
    user_id = UserToken.find_by(token: params["userToken"]).user_id

    budgetData = {
        incomeData: [{category: 'Category1', budget: 0.00, actual: 0.00, type: 'income', id: 0}],
        expensesData: [{category: 'Category4', budget: 0.00, actual: 0.00, type: 'expenses', id: 0}],
        savingsData: [{category: 'Category10', budget: 0.00, actual: 0.00, type: 'savings', bucketTotal: 0.00, id: 0}]
    }
    render json: budgetData.to_json
  end
end
