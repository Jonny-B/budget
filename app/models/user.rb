class User < ApplicationRecord
  has_many :incomes
  has_many :expenses
  has_many :savings
  has_many :transactions
  has_many :user_tokens
end