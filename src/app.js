const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const activity = require("./routes/activity");
const user = require("./routes/user");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(require("./routes/activity"));
app.use(require("./routes/user"));

app.use("/", user);

app.use("/", activity);

app.get("*", function (req, res) {
  res.json({
    message: { message: "No Route Found" },
    error: { message: "No Route Found" },
  });
});

module.exports = app;
