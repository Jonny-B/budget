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
    t.bigint "user_id"
    t.decimal "budgeted"
    t.string "category"
    t.string "category_type"
    t.datetime "effective_date"
    t.datetime "updated_at"
    t.datetime "created_at"
    t.index ["user_id"], name: "index_categories_on_user_id"
  end

  create_table "remember_charges", force: :cascade do |t|
    t.bigint "categories_id"
    t.string "description"
    t.decimal "charge"
    t.index ["categories_id"], name: "index_remember_charges_on_categories_id"
  end

  create_table "savings_buckets", force: :cascade do |t|
    t.bigint "category_id"
    t.decimal "distributed"
    t.decimal "distributed_total"
    t.decimal "budgeted"
    t.decimal "total"
    t.datetime "date"
    t.index ["category_id"], name: "index_savings_buckets_on_category_id"
  end

  create_table "summaries", force: :cascade do |t|
    t.bigint "user_id"
    t.decimal "transfer_to_savings"
    t.index ["user_id"], name: "index_summaries_on_user_id"
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
    t.string "last_viewed"
    t.datetime "created_at"
  end

end
