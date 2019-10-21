class CategoriesController < ApplicationController
  def get
    user_id = UserToken.find_by(token: params["userToken"]).user_id
    category = Category.where(user_id: user_id)

    render json: "No Categories found for this user" if category.nil?

    render json: category.to_json
  end
end
