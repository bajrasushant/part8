const mongoose = require("mongoose");
const uniqueValidator =  require("mongoose-unique-validator")

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
  },
  favouriteGenre: {
    type: String,
  },
});

schema.plugin(uniqueValidator)

module.exports = mongoose.model("User", schema);