Rails.application.routes.draw do
  resources :orders
  resources :line_items
  resources :carts 
  # get 'store/index'
  resources :products
  # devise_for :users, :sign_out_via => [ :post, :delete ]
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    passwords: 'users/passwords',
    registrations: 'users/registrations',
    confirmations: 'users/confirmations'
  }

  root 'store#index', as: 'store_index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
