Rails.application.routes.draw do
  post '/user/create', to: 'users#create'

  get '/transactions/get', to: 'transactions#create'
  get '/budgets/get', to: 'budgets#create'
end
