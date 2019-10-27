require 'active_support'

class CategoriesController < ApplicationController
  def get
    user_token = UserToken.find_by(token: params["userToken"])
    user_id = user_token.user_id
    date = params["date"] == "" ? user_token.user.last_viewed: params["date"]
    category = Category.where(user_id: user_id).where("effective_date = ?", date)

    render json: "No Categories found for this user" if category.nil?

    render json: category.to_json
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

      render json: "New Income Category Created."
    when "expense"
      expense = Category.find_by(user_id: userToken.user_id, category: category, category_type: "expense", effective_date: date)

      render json: "Expense category #{category} already exists.".to_json if expense

      category = Category.new(user_id: userToken.user_id, category_type: "expense", category: category, budgeted: params["budgeted"], effective_date: date)
      category.save
      render json: "New Expense Category Created."
    when "saving"
      #TODO savings bucket will need to be created new every month. Figure that out later.
      saving = Category.find_by(user_id: userToken.user_id, category: category, category_type: "saving", effective_date: date)

      render json: "Savings category #{category} already exists.".to_json if saving

      category = Category.new(user_id: userToken.user_id, category_type: "saving", category: category, budgeted: params["budgeted"], effective_date: date)
      category.save!

      render json: "New Savings Category Created."
    else
      render json: "Invalid Budget Type. Must be 'income', 'saving', 'expense'"
    end
  end
end
