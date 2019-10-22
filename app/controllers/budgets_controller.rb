class BudgetsController < ActionController::API
  def get

    user_id = UserToken.find_by(token: params["userToken"]).user_id
    income = Category.where(user_id: user_id, category_type: "income").to_ary
    expense = Category.where(user_id: user_id, category_type: "expense").to_ary
    saving = Category.where(user_id: user_id, category_type: "saving").to_ary


    budget_data = {
        incomeData: income.map{|i| {category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge), type: 'income', id: 0}},
        expensesData: expense.map{|i| {category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge), type: 'expense', id: 0}},
        savingsData: saving.map{|i| {category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge), type: 'saving', id: 0}}
    }
    render json: budget_data.to_json
  end

  def create
    userToken = UserToken.find_by(token: params["userToken"])
    category = params["category"].gsub("'", "''")

    case params["type"]
    when "income"
      income = Category.find_by(user_id: userToken.user_id, category: category, category_type: "income")

      render json: "Income category #{category} already exists.".to_json if income

      category = Category.new(user_id: userToken.user_id, category_type: "income", category: category, budgeted: params["budgeted"], effective_date: Date.today)
      category.save!

      render json: "New Income Category Created."
    when "expense"
      expense = Category.find_by(user_id: userToken.user_id, category: category, category_type: "expense")

      render json: "Expense category #{category} already exists.".to_json if expense

      category = Category.new(user_id: userToken.user_id, category_type: "expense", category: category, budgeted: params["budgeted"], effective_date: Date.today)
      category.save
      render json: "New Expense Category Created."
    when "saving"
      #TODO savings bucket will need to be created new every month. Figure that out later.
      saving = Category.find_by(user_id: userToken.user_id, category: category, category_type: "saving")

      render json: "Savings category #{category} already exists.".to_json if saving

      category = Category.new(user_id: userToken.user_id, category_type: "saving", category: category, budgeted: params["budgeted"], effective_date: Date.today)
      category.save!

      render json: "New Savings Category Created."
    else
      render json: "Invalid Budget Type. Must be 'income', 'saving', 'expense'"
    end
  end

  def destroy

  end
end
