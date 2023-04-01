const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
      userId:  mongoose.Types.ObjectId,
      total: { type: Number, required: true }
});

exports.cartUser = mongoose.model("cart",cartSchema);


