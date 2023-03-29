const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_id : String,
    email: String,
    password: String,
    username : String
});

exports.User = mongoose.model("user",userSchema);