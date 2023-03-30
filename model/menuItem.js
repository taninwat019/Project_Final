const mongoose = require("mongoose");

const menuItemsSchema = new mongoose.Schema({
        cartID: {type: mongoose.Types.ObjectId},
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String }
});



exports.MenuItem = mongoose.model("menuIt",menuItemsSchema);

