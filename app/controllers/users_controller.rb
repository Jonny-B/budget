require 'active_support'

class UsersController < ApplicationController
  def create
    access_token = UserToken.find_by(token: params["userToken"])
    if !access_token
      user = User.new(last_viewed: Date.today.beginning_of_month.strftime('%Y/%m/%d'))
      user.save
      token = UserToken.new(user_id: user.id, token: params["userToken"], token_type: "auth_token")
      token.save
      category = Category.new(user_id: user.id, category_type: "income", category: "Edit/Delete this category and start your own!", budgeted: 0.0, effective_date: Date.today.beginning_of_month)
      category.save
    else
      puts "user already exists"
      render json: "user already exists"
    end
  end

  def get
    user_id = UserToken.find_by(token: params["userToken"]).user_id

    user = UserToken.find_by(user_id: user_id).user

    render json: user.to_json
  end

  def set_plaid_token
    plaid_env = Rails.application.config.plaid_env
    client_id = Rails.application.config.client_id
    secret = Rails.application.config.secret
    public_key = Rails.application.config.public_key
    client = Plaid::Client.new(env: plaid_env,
                               client_id: client_id,
                               secret: secret,
                               public_key: public_key)

    exchange_token_response = client.item.public_token.exchange(params["plaidToken"])
    access_token = exchange_token_response.access_token

    #TODO users can add same bank twice.
    user = UserToken.find_by(token: params["userToken"]).user
    token = UserToken.new(user_id: user.id, token: access_token, token_type: "plaid_token")
    token.save
  end

  def get_public_token
    user_token = UserToken.find_by(token: params["userToken"])
    user_id = user_token.nil? ? nil : user_token.user_id

    user_token = UserToken.find_by(user_id: user_id, token_type: "plaid_token")
    access_token = user_token.nil? ? nil : user_token.token

    plaid_env = Rails.application.config.plaid_env
    client_id = Rails.application.config.client_id
    secret = Rails.application.config.secret
    public_key = Rails.application.config.public_key
    client = Plaid::Client.new(env: plaid_env,
                               client_id: client_id,
                               secret: secret,
                               public_key: public_key)

    exchange_token_response = client.item.public_token.create(access_token)
    render json: exchange_token_response.public_token.to_json
  end

  def update_date
    user_token = UserToken.find_by(token: params["userToken"])
    user_token.user.update(last_viewed: params["date"])
    user_token.user.save
  end
end
