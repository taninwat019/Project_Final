const mongoose = require("mongoose");

exports.connect = () => {
  mongoose
    .connect("mongodb+srv://upahman:upahandfamie555@projectdev.oo0rzkc.mongodb.net/todolistDB?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database is connected"))
    .catch((e) => console.log(e));
};
