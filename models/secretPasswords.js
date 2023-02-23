const mongoose = require("mongoose")

const Schema = mongoose.Schema

const CodeSchema = ({
  admin: String,
  member: String
})

module.exports = mongoose.model("Code", CodeSchema)