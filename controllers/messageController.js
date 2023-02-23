const Message = require("../models/message")
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const Code = require("../models/secretPasswords")
const LocalStrategy = require("passport-local").Strategy

exports.createMessageGet = (req, res, next) => {
  if (req.user) {
    res.render("createMessage", { 
      title: "Create Message", 
      user: req.user,
      authError: undefined,
      error: undefined
    })
  } else {
    const err = new Error("Sign in to access the content of the url. ")
    err.status = 404;
    return next(err)
  }
}