class BudgetsController < ActionController::API
  def get
    user_token = UserToken.find_by(token: params["userToken"])
    user_id = user_token.user_id
    date = params["date"] == "" ? user_token.user.last_viewed : params["date"]

    income = Category.where(user_id: user_id, category_type: "income").where("effective_date = ?", date).to_ary
    expense = Category.where(user_id: user_id, category_type: "expense").where("effective_date = ?", date).to_ary
    saving = Category.where(user_id: user_id, category_type: "saving").where("effective_date = ?", date).to_ary

    # Set a default category when on a new month
    if income.length == 0 && expense.length == 0 && saving.length == 0
      new_date = date.split('/')
      category = Category.new(user_id: user_id, category_type: "income", category: "Edit/Delete this category and start your own!", budgeted: 0.0, effective_date: Date.new(new_date[0].to_i, new_date[1].to_i, 1).strftime('%Y/%m/%d'))
      category.save
      income = Category.where(user_id: user_id, category_type: "income").where("effective_date = ?", last_month).map { |c| dup = c.dup; dup.update(effective_date: date); dup.save; dup }
      expense = Category.where(user_id: user_id, category_type: "expense").where("effective_date = ?", last_month).map { |c| dup = c.dup; dup.update(effective_date: date); dup.save; dup }
      saving = Category.where(user_id: user_id, category_type: "saving").where("effective_date = ?", last_month).map { |c| dup = c.dup; dup.update(effective_date: date); dup.save; dup }
    end

    budget_data = {
        incomeData: income.map { |i| {
            category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge).to_f, type: 'income', id: i.id}
        },
        expenseData: expense.map { |i| {
            category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge), type: 'expense', id: i.id}
        },
        savingData: saving.map { |i|
          # Get Savings Buckets
          bucket = SavingsBucket.where(category_id: i.id, date: date).first
          if bucket.nil?
            {category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge), bucket: {distributed: 0, distributed_total: 0, total: 0, date: date}, type: 'saving', id: i.id}
          else
            {category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge), bucket: {distributed: bucket.distributed, distributed_total: bucket.distributed_total.to_f, date: date}, type: 'saving', id: i.id}
          end
        }
    }
    render json: {budgetData: budget_data, date: date}.to_json
  end

  def copy
    user_token = UserToken.find_by(token: params["userToken"])
    user_id = user_token.user_id
    date = params["date"] == "" ? user_token.user.last_viewed : params["date"]

    # Copy next/last months categories back/forward
    copy_month = date.split('/')

    # Determine month to copy from next/last
    if params["month"] != 'next'
      # This handles when the copy_month is Jan
      if (copy_month[1]) == '1'
        copy_month[1] = '13'
        copy_month[0] = (copy_month[0].to_i - 1).to_s
      end
      # This will find the last copy_month
      month = Date.new(copy_month[0].to_i, copy_month[1].to_i - 1, 1).strftime('%Y/%m/%d')
    else
      # This handles when the copy_month is December
      if (copy_month[1]) == '12'
        copy_month[1] = '0'
        copy_month[0] = (copy_month[0].to_i + 1).to_s
      end
      # This will find the next month
      month = Date.new(copy_month[0].to_i, copy_month[1].to_i + 1, 1).strftime('%Y/%m/%d')
    end

    income = Category.where(user_id: user_id, category_type: "income").where("effective_date = ?", month).map { |c| dup = c.dup; dup.update(effective_date: date); dup.save; dup }
    expense = Category.where(user_id: user_id, category_type: "expense").where("effective_date = ?", month).map { |c| dup = c.dup; dup.update(effective_date: date); dup.save; dup }

    # Deep duplicating savings Categories
    saving = Category.where(user_id: user_id, category_type: "saving").where("effective_date = ?", month).map { |c|
      dup = c.dup
      dup.update(effective_date: date)

      # Find savingsBucket of category and dup it.
      dupBucket = SavingsBucket.find_by(id: c.savings_bucket.first.id).dup
      dupBucket.update(category_id: dup.id, date: date, distributed_total: dupBucket.distributed_total + dupBucket.budgeted, distributed: 0)
      dupBucket.save
      dup.save
      return dup
    }

    budget_data = {
        incomeData: income.map { |i| {category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge), type: 'income', id: i.id} },
        expensesData: expense.map { |i| {category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge), type: 'expense', id: i.id} },
        savingData: saving.map { |i|

          # Get Savings Buckets
          bucket = SavingsBucket.where(category_id: i.id, date: date).first
          if bucket.nil?
            {category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge), bucket: {distributed: 0, distributedTotal: 0, total: 0, date: date}, type: 'saving', id: i.id}
          else
            {category: i.category, budget: i.budgeted, actual: i.transactions.sum(:charge), bucket: {distributed: bucket.distributed, distributedTotal: bucket.distributed_total.to_f, total: bucket.total}, type: 'saving', id: i.id}
          end
        }
    }
    render json: {budgetData: budget_data, date: date}.to_json
  end

end
