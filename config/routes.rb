Rails.application.routes.draw do
  get '/transactions', to: 'transactions#get'
  get '/budgets', to: 'budgets#get'
  get '/users', to: 'users#get'

  post '/users/create', to: 'users#create'
  post '/users/set_plaid_token', to: 'users#set_plaid_token'
  post '/transactions/create', to: 'transactions#create'
  post '/budgets/create', to: 'budgets#create'
end
