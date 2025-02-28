const util = require("util")
const db = require("./../utils/dbConfig");

const query = util.promisify(db.query).bind(db);

module.exports = {
createuser: async(req,res)=>{
    try {
        console.log("working.........")
        const result = await query(`select * from user`)
        return res.status(200).json({message:"working",result})
    } catch (err) {
        console.error(err)
    }
}
}