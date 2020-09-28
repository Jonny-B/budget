require 'active_support'

class CategoriesController < ApplicationController
  def get
    user_token = UserToken.find_by(token: params["userToken"])
    user_id = user_token.user_id
    date = params["date"] == "" ? user_token.user.last_viewed : params["date"]
    categories = Category.where(user_id: user_id, effective_date: date)

    render json: "No Categories found for this user" if categories.nil?

    render json: categories.to_json
  end

  def create
    userToken = UserToken.find_by(token: params["userToken"])
    category = params["category"].gsub("'", "''")

    date = params["date"].split('/')
    date = Date.new(date[0].to_i, date[1].to_i, 1).strftime('%Y/%m/%d')
    case params["type"]
    when "income"
      income = Category.find_by(user_id: userToken.user_id, category: category, category_type: "income", effective_date: date)

      render json: "Income category #{category} already exists.".to_json if income

      category = Category.new(user_id: userToken.user_id, category_type: "income", category: category, budgeted: params["budgeted"], effective_date: date)
      category.save!

      render json: {id: category.id}
    when "expense"
      expense = Category.find_by(user_id: userToken.user_id, category: category, category_type: "expense", effective_date: date)

      render json: "Expense category #{category} already exists.".to_json if expense

      category = Category.new(user_id: userToken.user_id, category_type: "expense", category: category, budgeted: params["budgeted"], effective_date: date)
      category.save
      render json: {id: category.id}
    when "saving"
      saving = Category.find_by(user_id: userToken.user_id, category: category, category_type: "saving", effective_date: date)

      render json: "Savings category #{category} already exists.".to_json if saving

      category = Category.new(user_id: userToken.user_id, category_type: "saving", category: category, budgeted: params["budgeted"].to_f, effective_date: date)
      category.save!
      bucket = SavingsBucket.new(category_id: category.id, distributed: 0, distributed_total: params['budgeted'].to_f - 0, total: 0, budgeted: params["budgeted"].to_f, date: date)
      bucket.save!

      render json: {id: category.id}
    else
      render json: "Invalid Budget Type. Must be 'income', 'saving', 'expense'"
    end
  end

  def patch
    category = Category.find_by(id: params["id"])
    category.update(category: params["category"], budgeted: params["budgeted"].to_f)
    category.save
    total = params["budgeted"].to_f - category.transactions.sum(:charge).to_f

    if category.category_type == 'saving'
      bucket = SavingsBucket.find_by(category_id: category.id, date: params["date"])
      distributed_total = params['budgeted'].to_f - bucket.distributed
      bucket.update(category_id: category.id, budgeted: params['budgeted'], distributed: bucket.distributed, distributed_total: distributed_total, total: total)
      bucket.save!
    end
  end

  def delete
    category = Category.find_by(id: params["id"].to_i)
    category.delete

    bucket = SavingsBucket.delete(category_id: category.savings_bucket.first.id)
    bucket.save!
  end
end
