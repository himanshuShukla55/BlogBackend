const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

//* importing database
const { connection } = require("./config/db");

//* importing routes
const { router: userRouter } = require("./routes/users.route");
const { router: blogsRouter } = require("./routes/blogs.route");

const app = express();

//* middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//* routes
app.use("/users", userRouter);
app.use("/blogs", blogsRouter);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  try {
    await connection(process.env.DBURL);
    console.log("connected to database");
  } catch (error) {
    console.log("error in connecting to database");
    console.error(error);
  }
  console.log(`listening on port: ${port}`);
});
