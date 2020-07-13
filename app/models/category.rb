class Category < ApplicationRecord
  belongs_to :user
  has_many :transactions
  has_many :savings_bucket
  has_one :remember_charge
end