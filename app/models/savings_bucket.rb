class SavingsBucket < ApplicationRecord
  belongs_to :category, optional: true
end