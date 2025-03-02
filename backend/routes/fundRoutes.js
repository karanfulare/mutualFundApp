const router = require("express").Router() ;

const {fetchFundHouses,fetchOpenSchemes,addScheme,getPortfolio} = require("./../controller/fundControler");
const{ verifyToken} = require("../middleware/auth")

router.get("/list-funds",verifyToken,fetchFundHouses);
router.post("/list-open-ended-scheme",verifyToken,fetchOpenSchemes);
router.post("/add-scheme",verifyToken,addScheme);
router.get("/get-portfolio",verifyToken,getPortfolio);

module.exports = router ;