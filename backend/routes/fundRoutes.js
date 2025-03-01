const router = require("express").Router() ;

const {fetchFundHouses,fetchOpenSchemes} = require("./../controller/fundControler");
const{ verifyToken} = require("../middleware/auth")

router.get("/list-funds",verifyToken,fetchFundHouses);
router.post("/list-open-ended-scheme",verifyToken,fetchOpenSchemes);

module.exports = router ;