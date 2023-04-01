const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  cartItems: [
    {
      itemId: mongoose.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  orderDate: Date,
  status: String,
});

exports.Order = mongoose.model("order", orderSchema);
