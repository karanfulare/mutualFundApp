const router = require("express").Router() ;

const {createuser} = require("./../controller/userController");

router.post("/createuser",createuser)

module.exports = router ;