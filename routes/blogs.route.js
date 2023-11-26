const router = require("express").Router();

//* importing middlewares
const { authentication } = require("../middlewares/auth");

//*using middlewares
router.use(authentication);

router.get("/", (req, res) => {
  res.send(req.userID);
});

module.exports = { router };
