const mongoose = require("mongoose")

const Schema = mongoose.Schema

const MessageSchema = new Schema({
  title: String,
  text: String,
  date: {type: Date, default: Date.now},
  user: {type: Schema.Types.ObjectId, ref: "User"}
})

MessageSchema.virtual("dateFormatted").get(function() {
  return this.date.toLocaleString()
})

module.exports = mongoose.model("Message", MessageSchema)

