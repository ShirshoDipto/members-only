const Code = require("./models/secretPasswords")
const Message = require("./models/message")
require("dotenv").config()
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

async function main() {
  await mongoose.connect(mongoDB);
  console.log("Connection Successful!!")
  
  // for (let x=1; x<101; x++) {
  //   const message = new Message({
  //     title: `test message ${x}`,
  //     text: `this is a test message ${x}. this is a test message ${x}. this is a test message ${x}. this is a test message ${x}. this is a test message ${x}. this is a test message ${x}. `,
  //     user: "63f2e6c2efd099704f0cf98d"
  //   })

  //   await message.save()
  //   console.log(`saved text message ${x}`)
  // }

  // const messages = await Message.find({})
  // let count = 1
  // await messages[0].deleteOne({})
  // messages.forEach(async message => {
  //   await message.deleteOne({})
  //   console.log(`deleted ${count}`)
  //   count++
  // })

  // await Message.deleteMany({})

  // console.log("All deleted")
}


main().catch(err => console.log(err));