class SelectedDateController < ActionController::API

  def get
    user_token = UserToken.find_by(token: params["userToken"])
    render json: user_token.user.last_viewed.to_json
  end
end
