require 'rails_helper'

RSpec.describe Product, type: :model do
  context 'Product column must not be empty' do  
    it 'must have title description price image_url' do   
      product = Product.new(title: "Ritik",
        price: 2
        )
    end
  end
end
