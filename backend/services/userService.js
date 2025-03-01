const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        `Select count(*) from user where email = ?`,
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
  StoretoDb: async (userName, hashPassword, email) => {
    try {
      const InsertQuery = await query(
        `Insert into user (username,password,email) values(?,?,?)`,
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
