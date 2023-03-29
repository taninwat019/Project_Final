const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    type: String
});

exports.Menu = mongoose.model("menu",menuSchema);