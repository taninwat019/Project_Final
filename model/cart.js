const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    items: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }],
      total: { type: Number, required: true }
});

exports.Cart = mongoose.model("cart",cartSchema);
