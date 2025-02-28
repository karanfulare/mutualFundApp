const util = require("util")
const db = require("./../utils/dbConfig");

const query = util.promisify(db.query).bind(db);

module.exports = {
createuser: async(req,res)=>{
    try {
        console.log("working.........")
        return res.status(200).json({message:"working"})
    } catch (err) {
        console.error(err)
    }
}
}