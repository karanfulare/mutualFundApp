const {createPool} = require("mysql2");

const pool = createPool({
    port :3306,
    host:process.env.dbhost,
    user:process.env.dbuser ,
    password:process.env.dbpassword,
    database:process.env.dbdatabase
})

module.exports = pool ;