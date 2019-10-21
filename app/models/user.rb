class User < ApplicationRecord
  has_many :categories
  has_many :transactions
  has_many :user_tokens
end