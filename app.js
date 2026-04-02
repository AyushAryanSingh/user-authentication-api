const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(express.json());


const SECRET = process.env.SECRET;


//bcrypt.hash("password123", 10).then(console.log);
const user={
  username:"teddy",
  password: "$2b$10$awcPW/JdEcT3s2pa.fx0jug/iF5SY7BZvJMwPYd/8EyVls8fvI7ii" // hashed version of "password123"
}

app.post("/login", async (req, res) => {
  const {username,password} = req.body;
  if(username!==user.username){
    return res.send("User not found"); 
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch){
    return res.send("Wrong Password")
  }

  const token = jwt.sign({username}, SECRET);

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
