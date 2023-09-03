require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/conn");
const router = require("./Routes/router");
const PORT = 4002;

// Middleware
app.use(express.json());
app.use(cors());
app.use(router)

// Use the router middleware
 // Make sure the correct path is used here

app.get("/", (req, res) => {
    res.status(200).json("server start");
});

app.listen(PORT, () => {
    console.log(`Server start at port No.:${PORT}`);
});
