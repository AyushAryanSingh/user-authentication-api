const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET;
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.send("No token ");
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.send("Invalid Token");
  }
}

module.exports = auth;
