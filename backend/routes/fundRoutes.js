const router = require("express").Router() ;

const {fetchFund} = require("./../controller/fundControler");
const{ verifyToken} = require("../middleware/auth")

router.get("/list-funds",verifyToken,fetchFund)

module.exports = router ;