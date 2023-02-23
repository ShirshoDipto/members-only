const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  isMember: {type: Boolean, default: false},
  isAdmin: {type: Boolean, default: false}
})

module.exports = mongoose.model("User", UserSchema)
