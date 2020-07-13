class CreateBudgetItems < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :last_viewed
      t.timestamp :created_at
    end

    create_table :user_tokens do |t|
      t.belongs_to :user
      # This comes from plaid when a user signs in
      t.string :token_type
      t.string :token
      t.timestamp :updated_at
      t.timestamp :created_at
    end

    create_table :categories do |t|
      t.belongs_to :user
      t.decimal :budgeted
      t.string :category
      t.string :category_type
      t.datetime :effective_date
      t.timestamp :updated_at
      t.timestamp :created_at
    end

    create_table :transactions, id: false do |t|
      t.string :transaction_id, null: false
      t.belongs_to :user
      t.belongs_to :category
      t.string :description
      t.decimal :charge
      t.datetime :date
      t.boolean :hidden
      t.boolean :edited
      t.timestamp :updated_at
      t.timestamp :created_at
    end

    create_table :summaries do |t|
      t.belongs_to :user
      t.decimal :transfer_to_savings
    end

    create_table :savings_buckets do |t|
      t.belongs_to :category
      t.decimal :distributed
      t.decimal :distributed_total
      t.decimal :budgeted
      t.decimal :total
      t.datetime :date
    end

    create_table :remember_charges do |t|
      t.belongs_to :categories
      t.string :description
      t.decimal :charge
    end
  end
end
