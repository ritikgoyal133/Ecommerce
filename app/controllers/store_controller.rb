class StoreController < ApplicationController
  # before_action :authenticate_user!
  def index
    @products = Product.order(:title)
  end
end
