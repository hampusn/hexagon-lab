# Media Controller

require 'date'
require 'sinatra/json'

include Hampusn::HexagonLab::Models

module Hampusn
  module HexagonLab
    module Controllers
      class MediaController < Sinatra::Base
        
        get '/media/latest' do
          media_items = MediaItem.all.limit(20).order('created_time desc')

          json :status => "success", :items => media_items
        end

        get '/media/update' do
          begin
            client = Instagram.client(:access_token => session[:access_token])  
          rescue StandardError
            session.delete(:access_token)
          end



          tags = client.tag_search('coffee')
          tag_name = tags[0].name

          media_items = client.tag_recent_media(tag_name)
          # next_max_id = @images.pagination.next_max_id

          media_items.each do |item|

            mi = MediaItem.new

            mi.item_id = item.id
            mi.caption_text = item.caption.text
            mi.location_latitude = 0
            mi.location_longitude = 0
            mi.url = item.link
            mi.standard_resolution_url = item.images.standard_resolution.url
            mi.thumbnail_url = item.images.thumbnail.url
            mi.created_time = DateTime.strptime(item.created_time.to_s, '%s')

            mi.save

          end



          json :status => "success"

        end

      end
    end
  end
end