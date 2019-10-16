class UsersController < ApplicationController
  def create
    access_token = UserToken.find_by(token: params["userToken"])
    if !access_token
      user = User.new(date: Date.new)
      user.save

      token = UserToken.new(user_id: user.id, token: params["userToken"], token_type: "auth_token")
      token.save

    else
      render json: "user already exists"
    end
  end

  def get
    user = UserToken.find_by(user_id: 1).user

    render json: user.to_json
  end

  def set_plaid_token
    #TODO users can add same bank twice.
    user = UserToken.find_by(token: params["userToken"]).user
    token = UserToken.new(user_id: user.id, token: params["plaidToken"], token_type: "plaid_token")
    token.save
  end
end
