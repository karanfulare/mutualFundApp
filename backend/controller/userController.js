const util = requir("utils");
const db = require("./../utils/dbConfig");

const query = util.promisify(db.query).bind(db);

module.exports = {
createuser: async(req,res)=>{
    try {
        return res.status(200)
    } catch (err) {
        console.error(err)
    }
}
}