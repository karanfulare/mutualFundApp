const util = require("util");
const db = require("./../utils/dbConfig");

const query = util.promisify(db.query).bind(db);
const {
  hashPassword,
  checkUserExist,
  storeToDb,
  authenticateUserService,
  generateToken
} = require("./../services/userService");

module.exports = {
  createuser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const isUser = await checkUserExist(email);
      if (isUser === -1) {
        return res
          .status(200)
          .json({
            message: `user already exist with this email ${email}`,
            data: [],
          });
      }
      const hashedPassword = await hashPassword(password);
      const storeUser = await storeToDb(username, hashedPassword, email);
      if (storeUser === 1) {
        return res
          .status(201)
          .json({ message: "User Successfullu created ", data: [] });
      } else {
        return res
          .status(500)
          .json({ message: "some error occured", data: [] });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "some error occured", data: [] });
    }
  },
  authenticateuser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkUserExist = await authenticateUserService(email, password);
      if (checkUserExist === 1) {
        const getToken = await  generateToken(email,password);
        return res
          .status(200)
          .json({ message: "user exists ", data: [{"token":getToken}] });
      } else {
        return res
          .status(200)
          .json({ message: "Invalid Login Credentials", data: [] });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "some error occured", data: [] });
    }
  },
};
