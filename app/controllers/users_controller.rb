class UsersController < ApplicationController
  def create
    unless User.find_by(user_access_token: params["userToken"])
      user_access_token = UserAccessToken.new(token: params["userToken"])
      user_access_token.save
      user = User.new(user_access_token: user_access_token.id)
      user.save
      render json: "user created"
    else
      render json: "user already exists"
    end
  end
end
