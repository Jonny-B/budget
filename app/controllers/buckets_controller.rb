require 'active_support'

class BucketsController < ApplicationController
  def patch
    categoryId = params["categoryId"]
    updatedDistValue = params["updatedDistValue"].to_f
    date = params["date"]

    category = Category.where(id: categoryId)
    bucket = category.first.savings_bucket.first
    actual = category.first.transactions.sum(:charge).to_f
    total = bucket.budgeted - actual

    # If the distributed value has not change don't do update the savings bucket
    if bucket.distributed.to_f != updatedDistValue
      bucket.update(distributed: updatedDistValue, distributed_total: total - updatedDistValue, total: total)
    else
      bucket.update(distributed: bucket.distributed, distributed_total: total - bucket.distributed, total: total)
    end
  end
end
