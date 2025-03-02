const router = require("express").Router() ;
const middlewareJoi = require("../utils/joi");
const schema = require("../schema/fundSchema")

const {fetchFundHouses,fetchOpenSchemes,addScheme,getPortfolio} = require("./../controller/fundControler");
const{ verifyToken} = require("../middleware/auth")

router.get("/list-funds",verifyToken,fetchFundHouses);
router.post("/list-open-ended-scheme",verifyToken,middlewareJoi(schema.fundfam),fetchOpenSchemes);
router.post("/add-scheme",verifyToken,middlewareJoi(schema.addToPortfolio),addScheme);
router.get("/get-portfolio",verifyToken,getPortfolio);

module.exports = router ;