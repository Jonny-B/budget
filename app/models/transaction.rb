class Transaction < ApplicationRecord
  belongs_to :user
  self.primary_key = 'transaction_id'
end