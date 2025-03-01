const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

module.exports = {
    hashPassword :async  (password)=>{
        try {
            const saltround = 10;
            const genratedsalt = await bcrypt.genSalt(saltround)
            const hashPassword = await bcrypt.hash(password,genratedsalt);

            return hashPassword ;
            
        } catch (err) {
            console.log(err);
            return err ;
        }
    }
}