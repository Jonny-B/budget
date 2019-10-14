class UsersController < ApplicationController
  def create
    access_token = UserToken.find_by(token: params["userToken"])
    if !access_token
      user = User.new(date: Date.new)
      user.save

      ua_token = UserToken.new(user_id: user.id, token: params["userToken"])
      ua_token.save

    else
      render json: "user already exists"
    end
  end

  def get
    user = User.find_by(user_access_token: params["userToken"])

    render json: user.to_json
  end
end
