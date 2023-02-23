const User = require("../models/user")
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const Code = require("../models/secretPasswords")
const LocalStrategy = require("passport-local").Strategy

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({email: username}, (err, user) => {
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false, { message: "Email does not exist. " })
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user)
        } else {
          return done(null, false, { message: "Incorrect Password. " })
        }
      })
    })
  })
)

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

exports.logInGet = (req, res, next) => {
  res.render("logInForm", {title: "Log In", user: req.user, validationError: undefined, authError: undefined})
}

exports.logInPost = [
  body("username")
  .trim()
  .isLength({min: 1})
  .withMessage("Email must be specified. ")
  .isEmail()
  .withMessage("Input has to be an email. ")
  .escape(),

  body("password", "Password field cannot be empty. ")
  .trim()
  .isLength({min: 1})
  .escape(),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render("logInForm", {
        title: "Log In",
        user: req.user, 
        validationError: errors.array(),
        authError: undefined
      })
      return
    }

    passport.authenticate("local", function(err, user, info) {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.render("logInForm", {title: "Log In", user: req.user, validationError: undefined, authError: info.message} )
      }
      req.login(user, err => {
        if (err) {
          return next(err)
        }
        res.redirect(`/`)
      })
    })(req, res, next)
  }
]

exports.signUpGet = (req, res, next) => {
  res.render("signUpForm", {title: "Sign Up", user: req.user, errors: undefined, isEmailExist: false})
}

exports.signUpPost = [
  body("firstName", "First Name must be specified. ")
  .trim()
  .isLength({min: 1})
  .escape(),

  body("lastName", "Last Name must be specified. ")
  .trim()
  .isLength({min: 1})
  .escape(),

  body("email")
  .trim()
  .isLength({min: 1})
  .withMessage("Email must be specifeid. ")
  .isEmail()
  .withMessage("Input has to be an email. ")
  .escape(),

  body("password", "password must be apecified and at least 8 characters long. ")
  .trim()
  .isLength({min: 8})
  .escape(),

  body("confirmPassword")
  .custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error("Password doesn't match. ")
    }
    return true
  }),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render("signUpForm", {
        title: "Sign Up", 
        user: req.user,
        errors: errors.array(),
        isEmailExist: false
      })
      return
    }

    async function hashAndSavePassword() {
      if (await User.findOne({email: req.body.email})) {
        res.render("signUpForm", { title: "Sign Up", user: req.user, errors: undefined, isEmailExist: true })
        return
      }
      const hashedPassword = await bcrypt.hash(req.body.confirmPassword, 10)
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
      })
      await user.save()
      req.login(user, err => {
        if (err) {
          return next(err)
        }
        res.redirect("/")
      })
    }

    hashAndSavePassword().catch(err => {
      return next(err)
    })
  }
]

exports.logOut = (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err)
    }
    res.redirect("/")
  })
}

exports.becomeMemberGet = (req, res, next) => {
  if (req.user) {
    res.render("member", { 
      title: "Become a Member", 
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

exports.becomeMemberPost = [
  body("becomeMember", "Field cannot be empty. ")
  .trim()
  .isLength({min: 1})
  .escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req)
  
      if (!errors.isEmpty()) {
        res.render("/member", {
          title: "Become Member",
          user: req.user,
          authError: undefined,
          error: errors.array()
        })
        return
      }

      const code = await Code.findOne({})

      if (code.member === req.body.becomeMember) {
        req.user.isMember = true
        await req.user.save()
        return res.redirect("/member")
      } else {
        res.render("member", {
          title: "Become Member",
          user: req.user,
          authError: undefined,
          error: [{msg: "Invalid Secret Code. "}]
        })
        return
      }
    } catch(err) {
      return next(err)
    }
  }
]

