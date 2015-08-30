class CreateMediaItems < ActiveRecord::Migration
  def up
    create_table :media_items do |t|
      t.string :item_id

      t.text :caption_text

      t.float :location_latitude
      t.float :location_longitude

      t.string :url

      t.string :standard_resolution_url
      t.string :thumbnail_url

      t.timestamp :created_time

      t.timestamps null: false
    end

    add_index :media_items, :item_id, :unique => true
  end

  def down
    drop_table :media_items
  end
end
