# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_09_19_004350) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "categories", force: :cascade do |t|
    t.bigint "income_id"
    t.bigint "expense_id"
    t.bigint "saving_id"
    t.decimal "budgeted"
    t.decimal "spent"
    t.datetime "effective_date"
    t.datetime "expiry_date"
    t.datetime "updated_at"
    t.datetime "created_at"
    t.index ["expense_id"], name: "index_categories_on_expense_id"
    t.index ["income_id"], name: "index_categories_on_income_id"
    t.index ["saving_id"], name: "index_categories_on_saving_id"
  end

  create_table "expenses", force: :cascade do |t|
    t.bigint "user_id"
    t.decimal "total"
    t.datetime "date"
    t.datetime "updated_at"
    t.datetime "created_at"
    t.index ["user_id"], name: "index_expenses_on_user_id"
  end

  create_table "incomes", force: :cascade do |t|
    t.bigint "user_id"
    t.decimal "total"
    t.datetime "date"
    t.datetime "updated_at"
    t.datetime "created_at"
    t.index ["user_id"], name: "index_incomes_on_user_id"
  end

  create_table "remember_charge", force: :cascade do |t|
    t.bigint "categories_id"
    t.string "description"
    t.decimal "charge"
    t.index ["categories_id"], name: "index_remember_charge_on_categories_id"
  end

  create_table "savings", force: :cascade do |t|
    t.bigint "user_id"
    t.decimal "total"
    t.datetime "date"
    t.datetime "updated_at"
    t.datetime "created_at"
    t.index ["user_id"], name: "index_savings_on_user_id"
  end

  create_table "savings_bucket", force: :cascade do |t|
    t.bigint "categories_id"
    t.decimal "total"
    t.datetime "date"
    t.index ["categories_id"], name: "index_savings_bucket_on_categories_id"
  end

  create_table "summary", force: :cascade do |t|
    t.bigint "incomes_id"
    t.bigint "expenses_id"
    t.bigint "savings_id"
    t.decimal "transfer_to_savings"
    t.index ["expenses_id"], name: "index_summary_on_expenses_id"
    t.index ["incomes_id"], name: "index_summary_on_incomes_id"
    t.index ["savings_id"], name: "index_summary_on_savings_id"
  end

  create_table "transactions", id: false, force: :cascade do |t|
    t.string "transaction_id", null: false
    t.bigint "user_id"
    t.bigint "category_id"
    t.string "description"
    t.decimal "charge"
    t.datetime "date"
    t.boolean "hidden"
    t.boolean "edited"
    t.datetime "updated_at"
    t.datetime "created_at"
    t.index ["category_id"], name: "index_transactions_on_category_id"
    t.index ["user_id"], name: "index_transactions_on_user_id"
  end

  create_table "user_tokens", force: :cascade do |t|
    t.bigint "user_id"
    t.string "token_type"
    t.string "token"
    t.datetime "updated_at"
    t.datetime "created_at"
    t.index ["user_id"], name: "index_user_tokens_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "date"
    t.datetime "updated_at"
    t.datetime "created_at"
  end

end
