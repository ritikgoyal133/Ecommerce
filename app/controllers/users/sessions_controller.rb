# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  before_action :sign_in_params, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  def create
    super
    user = User.find_by(email: params[:sign_in_params])
    if user.try(:authenticate, params[:password])
    session[:user_id] = user.id
    redirect_to store_index_url
    else
    # redirect_to login_url, alert: "Invalid user/password combination"
  end

  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end
  def destroy
    super
    session[:user_id] = nil
    # redirect_to cart_path, notice: "Logged out"
  end

  protected

  # If you have extra params to permit, append them to the sanitizer.
  def sign_in_params
    devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  end
end
