const router = require("express").Router() ;
const middlewareJoi = require("../utils/joi");
const schema = require("../schema/userSchema")

const {createuser, authenticateuser} = require("./../controller/userController");

router.post("/createuser",middlewareJoi(schema.adduser),createuser);
router.post("/authenticate",middlewareJoi(schema.loginuser),authenticateuser)

module.exports = router ;