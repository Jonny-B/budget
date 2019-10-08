Rails.application.routes.draw do
  get '/transactions', to: 'transactions#get'
  get '/budgets', to: 'budgets#get'

  post '/users/create', to: 'users#create'
  post '/transations/create', to: 'transactions#create'
  post '/budgets/create', to: 'budgets#create'
end
