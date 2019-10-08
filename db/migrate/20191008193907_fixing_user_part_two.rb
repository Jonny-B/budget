class FixingUserPartTwo < ActiveRecord::Migration[5.2]
  def change

    drop_table :users

    create_table :users do |t|
      # This id comes from Auth0
      t.datetime :date
      t.timestamp :updated_at
      t.timestamp :created_at
    end
  end
end
