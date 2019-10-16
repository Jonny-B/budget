class CreateBudgetItems < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      # This id comes from Auth0
      t.datetime :date
      t.timestamp :updated_at
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

    create_table :incomes do |t|
      t.belongs_to :user
      t.decimal :total
      t.datetime :date
      t.timestamp :updated_at
      t.timestamp :created_at
    end

    create_table :expenses do |t|
      t.belongs_to :user
      t.decimal :total
      t.datetime :date
      t.timestamp :updated_at
      t.timestamp :created_at
    end

    create_table :savings do |t|
      t.belongs_to :user
      t.decimal :total
      t.datetime :date
      t.timestamp :updated_at
      t.timestamp :created_at
    end

    create_table :categories do |t|
      t.belongs_to :income
      t.belongs_to :expense
      t.belongs_to :saving
      t.decimal :budgeted
      t.decimal :spent
      t.datetime :effective_date
      t.datetime :expiry_date
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
      t.timestamp :updated_at
      t.timestamp :created_at
    end

    create_table :summary do |t|
      t.belongs_to :incomes
      t.belongs_to :expenses
      t.belongs_to :savings
      t.decimal :transfer_to_savings
    end

    create_table :savings_bucket do |t|
      t.belongs_to :categories
      t.decimal :total
      t.datetime :date
    end

    create_table :remember_charge do |t|
      t.belongs_to :categories
      t.string :description
      t.decimal :charge
    end
  end
end
