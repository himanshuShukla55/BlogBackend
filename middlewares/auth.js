const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const token = req.cookies.token;
  //* if request does not contain token
  if (!token) return res.status(401).send("Unauthorized! Please login first!");

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(400).send(err.message);
    req.userID = decoded.userID;
    next();
  });
};

module.exports = { authentication };
