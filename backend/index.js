const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.port || 3000 ;

app.use(express.json())

app.use("/",require("./routes/index"))

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
}

module.exports = app;