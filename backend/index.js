const express = require("express");
const app = express();
const port = process.env.port || 3000 ;



app.use("/",require("./routes/index"))

app.listen(port,()=>{
    console.log(`App listening on port ${port}`)
})