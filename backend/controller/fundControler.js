const util = require("util");
const db = require("./../utils/dbConfig");

const { getFundHouses,getFundHousesFromDb } = require("../services/fundService");

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
    }
  }
};
