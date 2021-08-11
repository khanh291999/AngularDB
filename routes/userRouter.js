const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/userModel");

router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName, address, phoneNumber } =
      req.body;

    // validate

    if (!email || !password || !passwordCheck || !address || !phoneNumber)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
      address,
      phoneNumber,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30s',
    });
    const refreshToken = jwt.sign(email, process.env.REFRESH_TOKEN_SECRET);

    res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        refreshToken : user.refreshToken
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/adduser", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName, address, phoneNumber } =
      req.body;
    console.log("req.body", req.body);

    //validate
    if (
      !email ||
      !password ||
      !passwordCheck ||
      !displayName ||
      !address ||
      !phoneNumber
    )
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });
    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });
    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
      address,
      phoneNumber,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/updateuser/:id", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName, address, phoneNumber } =
      req.body;
    console.log("req.body", req.body);

    //validate
    if (
      !email ||
      !password ||
      !passwordCheck ||
      !displayName ||
      !address ||
      !phoneNumber
    )
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });
    const existingUser = await User.findOne({ email: email });

    const existingUser1 = await User.findOne(
      { id: req.params.id },
      { email: email }
    );
    if (existingUser1 == existingUser) {
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });
    }
    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const updateUser = await User.updateOne(
      { id: req.params.id },
      {
        $set: {
          email: email,
          password: passwordHash,
          displayName: displayName,
          address: address,
          phoneNumber: phoneNumber,
        },
      }
      // email,
      // password: passwordHash,
      // displayName,
      // type,
    );
    res.json(updateUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
  });
});

module.exports = router;
