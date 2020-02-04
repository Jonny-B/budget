class BudgetsController < ActionController::API
  def get
    user_token = UserToken.find_by(token: params["userToken"])
    user_id = user_token.user_id
    date = params["date"] == "" ? user_token.user.last_viewed : params["date"]

    income = Category.where(user_id: user_id, category_type: "income").where("effective_date = ?", date).to_ary
    expense = Category.where(user_id: user_id, category_type: "expense").where("effective_date = ?", date).to_ary
    saving = Category.where(user_id: user_id, category_type: "saving").where("effective_date = ?", date).to_ary

    # If previous month is blank (like when back filling budgets for new users) create a default category.
    if income.length == 0 && expense.length == 0 && saving.length == 0
      new_date = date.split('/')
      category = Category.new(user_id: user_id, category_type: "income", category: "Edit/Delete this category and start your own!", budgeted: 0.0, effective_date: Date.new(new_date[0].to_i, new_date[1].to_i, 1).strftime('%Y/%m/%d'))
      category.save
      income = Category.where(user_id: user_id, category_type: "income").where("effective_date = ?", last_month).map {|c| dup = c.dup; dup.update(effective_date: date); dup.save; dup}
      expense = Category.where(user_id: user_id, category_type: "expense").where("effective_date = ?", last_month).map {|c| dup = c.dup; dup.update(effective_date: date); dup.save; dup}
      saving = Category.where(user_id: user_id, category_type: "saving").where("effective_date = ?", last_month).map {|c| dup = c.dup; dup.update(effective_date: date); dup.save; dup}
    end

    budget_data = {
        incomeData: income.map { |i| {
            category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge).to_f, type: 'income', id: i.id}
        },
        expensesData: expense.map { |i| {
            category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge), type: 'expense', id: i.id}
        },
        savingsData: saving.map {|i|
          categories = Category.where(category: i.category).where("effective_date <= ?", date).order('effective_date ASC')
          bucket = 0
          categories.each do |c|
            c.budgeted = c.budgeted.nil? ? 0 : c.budgeted
            bucket += c.budgeted - c.transactions.sum(:charge).to_f
          end
          {category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge).to_f, bucketTotal: bucket, type: 'saving', id: i.id}
        }
    }
    render json: {budgetData: budget_data, date: date}.to_json
  end

  def copy
    user_token = UserToken.find_by(token: params["userToken"])
    user_id = user_token.user_id
    date = params["date"] == "" ? user_token.user.last_viewed : params["date"]

    # Copy previous months categories forward
    last_month = date.split('/')
    last_month = Date.new(last_month[0].to_i, last_month[1].to_i - 1, 1).strftime('%Y/%m/%d')

    income = Category.where(user_id: user_id, category_type: "income").where("effective_date = ?", last_month).map {|c| dup = c.dup; dup.update(effective_date: date); dup.save; dup}
    expense = Category.where(user_id: user_id, category_type: "expense").where("effective_date = ?", last_month).map {|c| dup = c.dup; dup.update(effective_date: date); dup.save; dup}
    saving = Category.where(user_id: user_id, category_type: "saving").where("effective_date = ?", last_month).map {|c| dup = c.dup; dup.update(effective_date: date); dup.save; dup}

    budget_data = {
        incomeData: income.map {|i| {category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge), type: 'income', id: i.id}},
        expensesData: expense.map {|i| {category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge), type: 'expense', id: i.id}},
        savingsData: saving.map {|i|
          categories = Category.where(category: i.category).where("effective_date <= ?", date).order('effective_date ASC')
          bucket = 0
          categories.each do |c|
            c.budgeted = c.budgeted.nil? ? 0 : c.budgeted
            bucket += c.budgeted - c.transactions.sum(:charge)
          end
          {category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge), bucketTotal: bucket, type: 'saving', id: i.id}
        }
    }
    render json: {budgetData: budget_data, date: date}.to_json
  end

end
