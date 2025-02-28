const router = require("express").Router ;

const {createuser} = require("./../controller/userController");

router.get("/createuser",createuser)

module.exports = router ;