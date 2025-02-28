const router = require("express").Router ;

router.use("/api/user",require("./userRoutes"));
router.use("/api/fund",require("./fundRoutes"))



module.exports = router ;