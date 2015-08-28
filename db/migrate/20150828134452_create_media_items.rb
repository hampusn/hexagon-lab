class CreateMediaItems < ActiveRecord::Migration
  def up
    create_table :media_items do |t|
      t.text :caption_text

      t.float :location_latitude
      t.float :location_longitude

      t.string :url

      t.string :standard_resolution_url
      t.string :thumbnail_url

      t.timestamps
    end
  end

  def down
    drop_table :media_items
  end
end
