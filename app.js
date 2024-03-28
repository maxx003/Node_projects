const express = require("express");
const ejs = require("ejs");
const fs = require("fs").promises;
require("dotenv").config();
const userRoute = require("./routes/users.js");
const app = express();

app.use(userRoute);
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
