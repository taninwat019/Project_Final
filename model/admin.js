const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    admin_id : String,
    email: String,
    password: String,
    username : String
});

exports.Admin = mongoose.model("admin",adminSchema);