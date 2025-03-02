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
          "x-rapidapi-key": process.env.rapidApiKey,
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
        console.log("from database");
        let arr = [];
        for (let i of selectQuery) {
          arr.push(i.fundFamilies);
        }
        return arr;
      } else {
        return -1;
      }
    } catch (err) {
      console.error(err);
      return -1;
    }
  },
  getOpenSchemeForFamily: async (family) => {
    try {
      const options = {
        method: "GET",
        url: "https://latest-mutual-fund-nav.p.rapidapi.com/latest",
        params: {
          Mutual_Fund_Family: family,
          Scheme_Type: "Open",
        },
        headers: {
          "x-rapidapi-key": process.env.rapidApiKey,
          "x-rapidapi-host": "latest-mutual-fund-nav.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      if (response.data.length > 0) {
        return response.data;
      } else {
        return -1;
      }
    } catch (err) {
      console.error(err);
      return -1;
    }
  },
  addscheme: async (scheme, units, email) => {
    try {
      const findId = await query(`select id from user where userEmail = ?`, [
        email,
      ]);
      if (findId.length > 0) {
        const InsertQuery = await query(
          `insert into userFunds (userId,schemeCode,units) values(?,?,?)`,
          [findId[0].id, scheme, units]
        );
        if (InsertQuery.insertId > 0) {
          return 1;
        }
      }
      return -1;
    } catch (err) {
      console.error(err);
      return -1;
    }
  },
  getCurrentValueofPortfolio: async (email) => {
    try {
      const findId = await query(`select id from user where userEmail = ?`, [
        email,
      ]);
      if (findId.length > 0) {
        const selectQuery = await query(
          `select * from userFunds where userId = ?`,
          [findId[0].id]
        );

        const schemeString = getschemeCode(selectQuery);
        const currentNAV = await fetchCurrentValue(schemeString);
        const PortfolioValue = await calculateCurrentPortfolioValue(
          selectQuery,
          currentNAV
        );
        return PortfolioValue;
      }
    } catch (err) {
      console.error(err);
      return -1;
    }
  },
};

async function fetchCurrentValue(schemes) {
  try {
    const options = {
      method: "GET",
      url: "https://latest-mutual-fund-nav.p.rapidapi.com/latest",
      params: {
        Scheme_Type: "Open",
        Scheme_Code: `${schemes}`,
      },
      headers: {
        "x-rapidapi-key": process.env.rapidApiKey,
        "x-rapidapi-host": "latest-mutual-fund-nav.p.rapidapi.com",
      },
    };

    //  let obj = [
    //     {
    //         "Scheme_Code": 120437,
    //         "ISIN_Div_Payout_ISIN_Growth": "-",
    //         "ISIN_Div_Reinvestment": "INF846K01CU0",
    //         "Scheme_Name": "Axis Banking & PSU Debt Fund - Direct Plan - Daily IDCW",
    //         "Net_Asset_Value": 1038.5219,
    //         "Date": "28-Feb-2025",
    //         "Scheme_Type": "Open Ended Schemes",
    //         "Scheme_Category": "Debt Scheme - Banking and PSU Fund",
    //         "Mutual_Fund_Family": "Axis Mutual Fund"
    //     },
    //     {
    //         "Scheme_Code": 120438,
    //         "ISIN_Div_Payout_ISIN_Growth": "INF846K01CR6",
    //         "ISIN_Div_Reinvestment": "-",
    //         "Scheme_Name": "Axis Banking & PSU Debt Fund - Direct Plan - Growth Option",
    //         "Net_Asset_Value": 2624.3258,
    //         "Date": "28-Feb-2025",
    //         "Scheme_Type": "Open Ended Schemes",
    //         "Scheme_Category": "Debt Scheme - Banking and PSU Fund",
    //         "Mutual_Fund_Family": "Axis Mutual Fund"
    //     }]

    const response = await axios.request(options);


    if (response.data.length > 0) {
      return response.data;
    } else {
      return -1;
    }
  } catch (err) {
    console.error(err);
    return -1;
  }
}

async function calculateCurrentPortfolioValue(userschemes, apidata) {
  try {
    let totalPortfolioValue = 0;
    let investment = [];

    // console.log(apidata)

    for (let i of userschemes) {
      const schemedata = apidata.filter(
        (el) => el.Scheme_Code === i.schemeCode
      );


      if (schemedata) {
        var units = i.units;
        var scheme = i.schemeCode;
        var nav = schemedata[0].Net_Asset_Value;
        var individualInvestmentValue = units * nav;
      }
      totalPortfolioValue = totalPortfolioValue + individualInvestmentValue;

      investment.push({
        schemeCode: scheme,
        schemName: schemedata[0].Scheme_Name,
        units: units,
        currentNAV: nav,
        totalValue: individualInvestmentValue,
      });
    }

    let obj = { totalPortfolioValue, investment };

    return obj;
  } catch (err) {
    console.error(err);
    return -1;
  }
}

function getschemeCode(userschemes) {
  let arr = [];
  for (let i of userschemes) {
    arr.push(i.schemeCode);
  }
  let string = arr.join(",");
  console.log(string);
  return string;
}
