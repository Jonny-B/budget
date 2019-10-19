class BudgetsController < ActionController::API
  def get
    user_id = UserToken.find_by(token: params["userToken"]).user_id
    income = Income.find_by(user_id: user_id)
    expense = Expense.find_by(user_id: user_id)
    saving = Saving.find_by(user_id: user_id)


    budget_data = {
        incomeData: [{category: 'Category1', budget: 0.00, actual: 0.00, type: 'income', id: 0}],
        expensesData: [{category: 'Category4', budget: 0.00, actual: 0.00, type: 'expenses', id: 0}],
        savingsData: [{category: 'Category10', budget: 0.00, actual: 0.00, type: 'savings', bucketTotal: 0.00, id: 0}]
    }
    render json: budget_data.to_json
  end

  def create
    user = UserToken.find_by(token: params["userToken"])

    case parmas["type"]
    when "income"
      income = Income.find_by_user_id(user.id)
      if income.nil?
        income = new Income(user_id) if income.nil?
        income.save
      end
      category = new Category(income_id: income.id, budgeted: params["budgeted"], effective_date: Date.today)
      category.save
      render json: "New Income Category Created."
    when "expenses"
      expense = Expense.find_by_user_id(user.id)
      if expense.nil?
        expense = new Expense(user_id) if expense.nil?
        expense.save
      end
      category = new Category(expense_id: expense.id, budgeted: params["budgeted"], effective_date: Date.today)
      category.save
      render json: "New Expense Category Created."
    when "savings"
      #TODO savings bucket will need to be created new every month. Figure that out later.
      saving = Saving.find_by_user_id(user.id)
      if saving.nil?
        saving = new Income(user_id) if saving.nil?
        income.save
      end
      category = new Category(income_id: saving.id, budgeted: params["budgeted"], effective_date: Date.today)
      category.save
      render json: "New Savings Category Created."
    else
      render json: "Invalid Budget Type. Must be 'income', 'savings', 'expenses'"
    end
  end

  def destroy

  end
end
