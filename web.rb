require "sinatra"
require "instagram"

enable :sessions

INSTAGRAM_CALLBACK_URL = ENV['INSTAGRAM_CALLBACK_URL']
INSTAGRAM_CLIENT_ID = ENV['INSTAGRAM_CLIENT_ID']
INSTAGRAM_CLIENT_SECRET = ENV['INSTAGRAM_CLIENT_SECRET']

Instagram.configure do |config|
  config.client_id = INSTAGRAM_CLIENT_ID
  config.client_secret = INSTAGRAM_CLIENT_SECRET
  # For secured endpoints only
  #config.client_ips = '<Comma separated list of IPs>'
end

get "/" do
  if session[:access_token].nil? || ! session[:access_token]
    redirect '/login'
  end

  begin
    client = Instagram.client(:access_token => session[:access_token])  
    @user = client.user
  rescue StandardError
    session.delete(:access_token)
    redirect '/'
  end

  tags = client.tag_search('coffee')
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
  @title = "Login - Hexagon Lab"
  haml :login
end

get "/oauth/connect" do
  redirect Instagram.authorize_url(:redirect_uri => INSTAGRAM_CALLBACK_URL)
end

get "/oauth/callback" do
  response = Instagram.get_access_token(params[:code], :redirect_uri => INSTAGRAM_CALLBACK_URL)
  session[:access_token] = response.access_token
  redirect "/"
end

get "/limits" do
  client = Instagram.client(:access_token => session[:access_token])
  html = "<h1/>View API Rate Limit and calls remaining</h1>"
  response = client.utils_raw_response
  html << "Rate Limit = #{response.headers[:x_ratelimit_limit]}.  <br/>Calls Remaining = #{response.headers[:x_ratelimit_remaining]}"

  html
end
