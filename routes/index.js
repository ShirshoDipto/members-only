var express = require('express');
var router = express.Router();
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Members Only', user: req.user });
});


/* User related routes */
router.get('/sign-up', userController.signUpGet)

router.post("/sign-up", userController.signUpPost)

router.get("/log-in", userController.logInGet)

router.post("/log-in", userController.logInPost)

router.get("/log-out", userController.logOut)

router.get("/member", userController.becomeMemberGet)

router.post("/member", userController.becomeMemberPost)

/** Message realted routes */
router.get("/create-message", messageController.createMessageGet)

module.exports = router;
