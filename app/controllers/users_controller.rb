class UsersController < ApplicationController
  def create
    access_token = UserToken.find_by(auth_token: params["userToken"])
    if !access_token
      user = User.new(date: Date.new)
      user.save

      ua_token = UserToken.new(user_id: user.id, auth_token: params["userToken"])
      ua_token.save

    else
      render json: "user already exists"
    end
  end

  def get
    user = UserToken.find_by(user_id: 1).user

    render json: user.to_json
  end
end
