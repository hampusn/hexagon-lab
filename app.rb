require 'sinatra/base'
require 'instagram'
require 'sinatra/activerecord'
require 'dotenv'

# Automagically load local .env-file with development variables.
# Production variables are handled in Heroku's interface.
Dotenv.load

INSTAGRAM_CALLBACK_URL = ENV['INSTAGRAM_CALLBACK_URL']
INSTAGRAM_CLIENT_ID = ENV['INSTAGRAM_CLIENT_ID']
INSTAGRAM_CLIENT_SECRET = ENV['INSTAGRAM_CLIENT_SECRET']

Instagram.configure do |config|
  config.client_id = INSTAGRAM_CLIENT_ID
  config.client_secret = INSTAGRAM_CLIENT_SECRET
end

module Hampusn
  module HexagonLab
    class App < Sinatra::Base
      enable :sessions

      require './models/mediaitem'

      def require_logged_in
        redirect('/login') unless is_authenticated?
      end

      def is_authenticated?
        return !!session[:access_token]
      end

      get "/" do
        require_logged_in

        begin
          client = Instagram.client(:access_token => session[:access_token])  
          @user = client.user
        rescue StandardError
          session.delete(:access_token)
          redirect '/'
        end

        search_tag = params[:tag] || 'coffee'

        tags = client.tag_search(search_tag)
        tag_name = tags[0].name

        @images = client.tag_recent_media(tag_name)
        next_max_id = @images.pagination.next_max_id

        $i = 0
        $num = 3

        while $i < $num  do
          next_images = client.tag_recent_media(tag_name, :max_id => next_max_id)
          next_max_id = next_images.pagination.next_max_id

          @images += next_images

          $i += 1
        end

        @title = "Hexagon Lab"
        haml :index
      end

      get "/login" do
        redirect('/') unless !is_authenticated?

        @title = "Login - Hexagon Lab"
        haml :login
      end

      get "/logout" do
        session.delete(:access_token)
        redirect '/'
      end

      get "/oauth/connect" do
        redirect Instagram.authorize_url(:redirect_uri => INSTAGRAM_CALLBACK_URL)
      end

      get "/oauth/callback" do
        response = Instagram.get_access_token(params[:code], :redirect_uri => INSTAGRAM_CALLBACK_URL)
        session[:access_token] = response.access_token
        redirect "/"
      end

      # For development only. Will be removed when we got the DB caching in place
      get "/limits" do
        require_logged_in

        client = Instagram.client(:access_token => session[:access_token])
        html = "<h1/>View API Rate Limit and calls remaining</h1>"
        response = client.utils_raw_response
        html << "Rate Limit = #{response.headers[:x_ratelimit_limit]}.  <br/>Calls Remaining = #{response.headers[:x_ratelimit_remaining]}"

        html
      end


      # Boot it up!
      run! if __FILE__ == $0
    end
  end
end
