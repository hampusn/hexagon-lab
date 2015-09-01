module Hampusn
  module HexagonLab
    module Models

      class MediaItem < ActiveRecord::Base
        validates :item_id, uniqueness: true
      end

    end
  end
end