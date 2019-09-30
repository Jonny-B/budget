class CreateBudgetItems < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :access_token
      t.string :item_id
      t.datetime :date
      t.timestamp :updated_at
      t.timestamp :created_at
    end

    create_table :incomes do |t|
      t.decimal :total
      t.datetime :date
      t.timestamp :updated_at
      t.timestamp :created_at
    end

    create_table :expenses do |t|
      t.decimal :total
      t.datetime :date
      t.timestamp :updated_at
      t.timestamp :created_at
    end

    create_table :savings do |t|
      t.decimal :total
      t.datetime :date
      t.timestamp :updated_at
      t.timestamp :created_at
    end

    create_table :categories do |t|
      t.belongs_to :incomes
      t.belongs_to :expenses
      t.belongs_to :savings
      t.decimal :budgeted
      t.decimal :spent
      t.datetime :effective_date
      t.datetime :expiry_date
      t.timestamp :updated_at
      t.timestamp :created_at
    end

    create_table :transactions do |t|
      t.belongs_to :categories
      t.string :description
      t.decimal :charge
      t.boolean :hidden
      t.datetime :date
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
