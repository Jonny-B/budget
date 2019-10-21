class Category < ApplicationRecord
  belongs_to :user
  has_many :transactions
  has_one :savings_bucket
  has_one :remember_charge
end