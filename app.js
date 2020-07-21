require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const app = express();
// Load file to connect mongoose to the DB
require("./db/mongoose");
const web = require("./routes/web");
const nunjucks = require("nunjucks");

// Passport config
require("./helpers/passport")(passport);

const PORT = process.env.PORT || 3000;

// Enable All CORS Requests
app.use(cors());

// Defined the engine of template
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

// Express session
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: true,
  })
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Setup express to automatically parse the incoming json data to object
app.use(express.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.successMsg = req.flash("successMsg");
  res.locals.errorMsg = req.flash("errorMsg");
  res.locals.error = req.flash("error");
  next();
});

const publicDirectory = path.join(__dirname, "/src");
app.use(express.static(publicDirectory));
console.log("asdasd", publicDirectory);

// Register router
app.use("", web);

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
