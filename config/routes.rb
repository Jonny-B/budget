Rails.application.routes.draw do
  get '/transactions', to: 'transactions#get'
  get '/budgets', to: 'budgets#get'
  get '/users', to: 'users#get'
  get '/users/get_public_token', to: 'users#get_public_token'
  get '/categories', to: 'categories#get'

  post '/users/create', to: 'users#create'
  post '/users/set_plaid_token', to: 'users#set_plaid_token'
  post '/transactions/create', to: 'transactions#create'
  post '/budgets/create', to: 'categories#create'

  patch 'transactions/patch', to: 'transactions#patch'
  patch '/categories/patch', to: 'categories#patch'

  delete '/categories/delete', to: 'categories#delete'
end
