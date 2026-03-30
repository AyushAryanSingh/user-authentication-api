const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
require("dotenv").config();

const SECRET = process.env.SECRET;

app.post("/login", (req, res) => {
  const username = req.body.username;

  const token = jwt.sign({ username }, SECRET);

  res.json({ token });
});

// Middleware

function auth(req, res, next) {
  console.log(req.headers);
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, SECRET);// JWT library will check if this token is valid, was it signed with the SECRET,
    //or if it is expired, if all the conditions check, it extracts the payload. 
    req.user = decoded;// req as we know is a request object, it can get passed around, it already contains headers, body, params, query etc.
    //we can add anything to it. Like req.myuser, req.mydata.
    // middleware writes info inside this file, and route reads from it. Why? Why not just use decoded directly?
    // Middlewares and routes are different functions, they don't share variables directly. We use req as a shared container.
    next();
    
  } catch(error) {
    res.send(error.message);
  }
}

//protected route
app.get("/dashboard", auth, (req, res) => {
  res.send(`Welcome ${req.user.username}`);
});

app.listen(3000, () => {
  console.log("Server Running");
});
