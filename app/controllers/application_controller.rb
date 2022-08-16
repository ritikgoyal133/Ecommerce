class ApplicationController < ActionController::Base
    before_action :authenticate_user!


 protected

 def authorize
  unless User.find_by(id: session[:user_id])
  redirect_to 'new_user_session',allow_other_host: true ,notice: "Please log in"
  end
 end
end
