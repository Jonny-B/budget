class Category < ApplicationRecord
  belongs_to :income
  belongs_to :expense
  belongs_to :saving
  has_many :transactions
  has_one :savings_bucket
  has_one :remember_charge
end