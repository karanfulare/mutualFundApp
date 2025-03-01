const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./../utils/dbConfig");
const util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports = {
  hashPassword: async (password) => {
    try {
      const saltround = 10;
      const genratedsalt = await bcrypt.genSalt(saltround);
      const hashPassword = await bcrypt.hash(password, genratedsalt);

      return hashPassword;
    } catch (err) {
      console.log(err);
      return -1;
    }
  },
  checkUserExist: async (email) => {
    try {
      const selectQuery = await query(
        `Select count(*) as "count" from user where userEmail = ?`,
        [email]
      );
      if (selectQuery[0].count > 0) {
        return -1;
      } else return 1;
    } catch (err) {
      console.error(err);
      return -1;
    }
  },
  authenticateUserService: async (email, password) => {
    try {
      const selectQuery = await query(
        `select * from user where userEmail = ? `,
        [email]
      );

      if (selectQuery[0].id) {
        const unhashed = await bcrypt.compare(
          password,
          selectQuery[0].userPassword
        );
        if (unhashed) {
          return 1;
        } else return 0;
      } else {
        return -1;
      }
    } catch (err) {
      console.error(err);
      return -1;
    }
  },
  generateToken:async(email)=>{
    try {
        let SECRET_KEY = process.env.secret ;
        const token = jwt.sign({ email}, SECRET_KEY, { expiresIn: "1h" });
        return token ;
        
    } catch (err) {
        console.error(err);
        return -1;
    }
  },
  storeToDb: async (userName, hashPassword, email) => {
    try {
      const InsertQuery = await query(
        `Insert into user (userName,userPassword,userEmail) values(?,?,?)`,
        [userName, hashPassword, email]
      );
      if (InsertQuery.insertId > 0) {
        return 1;
      } else return -1;
    } catch (err) {
      console.error(err);
      return -1;
    }
  },
};
