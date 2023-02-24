var express = require('express');
var router = express.Router();
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController")

/* GET home page. */
router.get('/', messageController.messageList);


/* User related routes */
router.get('/sign-up', userController.signUpGet)

router.post("/sign-up", userController.signUpPost)

router.get("/log-in", userController.logInGet)

router.post("/log-in", userController.logInPost)

router.get("/log-out", userController.logOut)

router.get("/member", userController.becomeMemberGet)

router.post("/member", userController.becomeMemberPost)

router.get("/admin", userController.becomeAdminGet)

router.post("/admin", userController.becomeAdminPost)

/** Message realted routes */
router.get("/create-message", messageController.createMessageGet)

router.post("/create-message", messageController.createMessagePost)

router.post("/delete-message", messageController.deleteMessage)

module.exports = router;
