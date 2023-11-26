const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//* importing model
const { UserModel } = require("../models/users.model");

//? handling signup post request.
router.post("/signup", (req, res) => {
  const newUser = req.body;
  bcrypt.hash(req.body.password, 4, async (err, hash) => {
    //* if hashing failed
    if (err) {
      console.log("error while hashing the password");
      console.error(err);
      return res.status(400).send("Bad request");
    }
    try {
      //* creating a user document
      await UserModel.create({
        ...newUser,
        email: newUser.email.toLowerCase(),
        password: hash,
      });
      res.status(201).send("successfully signed up!");
    } catch (error) {
      //* if creating a user document fails
      console.log("error while signing up a new user");
      console.error(error);
      res.status(400).send("Bad request!");
    }
  });
});

//? handling login post request
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //* getting user
    const user = await UserModel.findOne({ email });
    //* if user not found
    if (!user)
      return res.status(404).send("User doesnot exist! Please sign up first!");
    bcrypt.compare(password, user.password, (err, result) => {
      //* error in matching passwords
      if (err) throw err;
      //* if passwords don't match
      if (!result) return res.status(400).send("Invalid credentials!");
      //* creating tokens
      const token = jwt.sign({ userID: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: 60 * 60,
      });
      const refreshToken = jwt.sign(
        { userID: user._id },
        process.env.REFRESH_SECRET,
        {
          expiresIn: 60 * 60 * 2,
        }
      );
      //* setting cookie with tokens
      res
        .status(200)
        .clearCookie("token")
        .clearCookie("refresh-token")
        .cookie("token", token)
        .cookie("refresh_token", refreshToken)
        .send("successfully logged in!");
    });
  } catch (error) {
    console.log("error in logging in a user");
    console.error(error);
    res.status(400).send("Bad request!");
  }
});

//? handling request to refresh token;
router.get("/refresh", (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) return res.status(400).send("Please login again!");
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(400).send("Please login again!");
    const token = jwt.sign(
      { userID: decoded.userID },
      process.env.TOKEN_SECRET,
      {
        expiresIn: 60 * 60,
      }
    );
    res
      .status(200)
      .clearCookie("token")
      .cookie("token", token)
      .send("refreshed!");
  });
});

//? handling logout request
router.get("/logout", (req, res) => {
  res
    .status(200)
    .clearCookie("token")
    .clearCookie("refresh_token")
    .send("successfully logged out!");
});
module.exports = { router };
