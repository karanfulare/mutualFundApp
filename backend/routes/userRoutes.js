const router = require("express").Router() ;

const {createuser, authenticateuser} = require("./../controller/userController");

router.post("/createuser",createuser);
router.post("/authenticate",authenticateuser)

module.exports = router ;