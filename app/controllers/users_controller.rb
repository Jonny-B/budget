class UsersController < ApplicationController
  def create
    access_token = UserToken.find_by(token: params["userToken"])
    if !access_token
      user = User.new
      user.save

      token = UserToken.new(user_id: user.id, token: params["userToken"], token_type: "auth_token")

      token.save
    else
      puts "user already exists"
      render json: "user already exists"
    end
  end

  def get
    user = UserToken.find_by(user_id: 1).user

    render json: user.to_json
  end

  def set_plaid_token
    client = Plaid::Client.new(env: :sandbox,
                               client_id: '5d923beaa466f10012dc1363',
                               secret: '39395b2e8800dadd85947f7fad7bee',
                               public_key: 'b6eae93fa88deb27355f14563287d5')

    exchange_token_response = client.item.public_token.exchange(params["plaidToken"])
    access_token = exchange_token_response.access_token

    #TODO users can add same bank twice.
    user = UserToken.find_by(token: params["userToken"]).user
    token = UserToken.new(user_id: user.id, token: access_token, token_type: "plaid_token")
    token.save
  end
end
