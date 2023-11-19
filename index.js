const express = require("express");
const cors = require("cors");
require("dotenv").config()

const logRouter = require("./routes/log");


const PORT =  3000;

const app = express()

app.use(cors())

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}))

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Welcome to Query Ingestor"
    })
})

app.use("/api/log", logRouter);



app.listen(PORT, () => console.log(`Server is listening on port:${PORT}`));











