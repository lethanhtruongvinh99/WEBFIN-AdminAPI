var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const socket = require("socket.io");
const jwt = require("jsonwebtoken");

const indexRouter = require("./src/routes/index");
const authRouter = require("./src/routes/accountRoute");
const passport = require("passport");
dotenv.config();

var app = express();

const db = mongoose.connection;

require("./src/passport");

//connect to db
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Connected to databasae!`));
db.on("error", (err) => {
  console.log(`Error when connecting database ${err.message}`);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//app.use("/", indexRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
//config socket io
const server = http.createServer(app);
const io = socket(server, {
  cors: true,
  origins: [process.env.CLIENT],
});

io.on("connection", (socket) => {
  console.log(`Connected!`);
  socket.on("login", ( {token} ) => {
    try{
      const decoded = jwt.verify(token, process.env.SECRET);
      // console.log(ENDPOINT);
      console.log(decoded);
      console.log(typeof decoded);
    }
    catch (e)
    {
      console.log(e);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnet");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`....................................`);
  console.log(`Server is listening on port: ${process.env.PORT}`);
  console.log(`.                                  .`);
  console.log(`....................................`);
});

module.exports = app;
