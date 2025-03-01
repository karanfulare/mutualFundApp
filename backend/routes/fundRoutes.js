const router = require("express").Router() ;

const {fetchFundHouses} = require("./../controller/fundControler");
const{ verifyToken} = require("../middleware/auth")

router.get("/list-funds",verifyToken,fetchFundHouses)

module.exports = router ;