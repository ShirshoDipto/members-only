const Message = require("../models/message")
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const Code = require("../models/secretPasswords")
const LocalStrategy = require("passport-local").Strategy

exports.messageList = async (req, res, next) => {
  try {
    const messages = await Message.find({})
    .sort({date: -1})
    .populate("user", "firstName lastName")
    res.render("index", {
      title: "Homepage",
      user: req.user,
      messages: messages
    })
  } catch(err) {
    return next(err)
  }
}

exports.createMessageGet = (req, res, next) => {
  if (req.user) {
    res.render("createMessage", { 
      title: "Create Message", 
      user: req.user,
      authError: undefined,
      validationError: undefined
    })
  } else {
    const err = new Error("Sign in to access the content of the url. ")
    err.status = 404;
    return next(err)
  }
}

exports.createMessagePost = [
  body("messageTitle", "Title must be specified. ")
  .trim()
  .isLength({min: 1})
  .escape(),

  body("messageText", "Cannot leave message box empty. ")
  .trim()
  .isLength({min: 1})
  .escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.render("createMessage", {
          title: "Create Message",
          user: req.user,
          validationError: errors.array(),
          authError: undefined
        })
        return
      }
      const message = new Message({
        title: req.body.messageTitle,
        text: req.body.messageText,
        user: req.user._id
      })

      await message.save()
      res.redirect("/")
    } catch(err) {
      return next(err)
    }

  }
]

exports.deleteMessage = async (req, res, next) => {
  try {
    await Message.findByIdAndRemove(req.body.messageid)
    res.redirect("/")
  } catch(err) {
    return next(err)
  }
}