const util = require("util");
const db = require("./../utils/dbConfig");

const { getFundHouses,getFundHousesFromDb,getOpenSchemeForFamily} = require("../services/fundService");

const query = util.promisify(db.query).bind(db);

module.exports = {
  fetchFundHouses: async (req, res) => {
    try {
        let data = await getFundHousesFromDb();

        if(data === -1){
            data = await getFundHouses();
            // fetch fund houses and store them in database so that we don't call the api again and again
        }
      return res.status(200).json({
        message: "working validated",
        data: [{ fundHouses: data }],
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "some error occured", data: [] });
    }
  },
  fetchOpenSchemes:async(req,res)=>{
    try {
        const {family} = req.body ;
        let data = await getOpenSchemeForFamily(family);
        if(data != -1){
            return res.status(200).json({ message:"these are the open scheme",data:[data]})
        }else{
            return res.status(200).json({ message:"No data found"})
        }
    } catch (error) {
        console.error(err);
        return res.status(500).json({ message: "some error occured", data: [] });
    }
  }
};
