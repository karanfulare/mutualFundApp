const axios = require("axios");
const fs = require("fs");
const { json } = require("stream/consumers");
const db = require("./../utils/dbConfig");
const util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports = {
  getFundHouses: async () => {
    try {
      const options = {
        method: "GET",
        url: "https://latest-mutual-fund-nav.p.rapidapi.com/latest",
        params: {
          Scheme_Type: "Open",
        },
        headers: {
          "x-rapidapi-key":process.env.rapidApiKey,
          "x-rapidapi-host": "latest-mutual-fund-nav.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      
      const fundFamilies = [
        ...new Set(response.data.map((fund) => fund.Mutual_Fund_Family)),
      ];

    //   fs.writeFileSync("fundFamilies", JSON.stringify(fundFamilies));

      for (let i of fundFamilies) {
        const Insertquery = await query(
          `insert into fundFamilies (fundFamilies) values (?)`,
          [i]
        );
      }

      return fundFamilies;
    } catch (err) {
      console.error(err);
      return -1;
    }
  },
  getFundHousesFromDb: async () => {
    try {
      const selectQuery = await query(`select * from fundfamilies`);
      if (selectQuery.length > 0) {
        console.log("from database")
        for(let i of selectQuery){
            arr.push(i.fundFamilies)
        }
        // let arr = [] 
        return arr
      } else {
        return -1;
      }
    } catch (err) {
      console.error(err);
      return -1;
    }
  },
};
