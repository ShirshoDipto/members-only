const Code = require("./models/secretPasswords")
require("dotenv").config()
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

async function main() {
  await mongoose.connect(mongoDB);
  console.log("Connection Successful!!")

  const code = new Code({
    admin: "0020", 
    member: "shusmeislam"
  })
  
  // await code.save()
  // console.log("Success in saving the data!!")
}


main().catch(err => console.log(err));