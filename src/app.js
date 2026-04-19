const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const userRoutes = require("./routes/user.routes")
console.log(userRoutes);
const app = express();
app.use(express.json());

const SECRET = process.env.SECRET;

app.use("/api",userRoutes);


module.exports = app;
