const util = require("util");
const db = require("./../utils/dbConfig");

const query = util.promisify(db.query).bind(db);

module.exports = {
fetchFund: async(req,res)=>{
    try {
        return res.status(200).json({message:"working validated"})
    } catch (err) {
        console.error(err)
    }
}
}