const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../models/user.model");
const SECRET = process.env.SECRET;
const auth = require("../middleware/auth");

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.send("All fields required");
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword,
  });

  await user.save();

  res.send("User Created");
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.send("User not found");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.send("Wrong Password");
    }

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET);

    res.json({ token });
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/dashboard",auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({
    message: "Welcome",
    user,
  });
});

module.exports = router;