const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter");
const messagesRouter = require('./router/messagesRouter')
const passport = require("passport")
const Message = require('./models/messages.model')
const session = require('express-session')
const compression = require("compression")
const helmet = require("helmet")
const app = express();
require("dotenv").config()

const mongoDb = process.env.MONGODB_URI
async function main() {
  await mongoose.connect(mongoDb);
}

main().catch((err) => console.log(err));

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(compression())
app.use(helmet())
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.set("views" + __dirname + "/views");
app.set("view engine", "ejs");
app.use("/user", userRouter);
app.use("/messages", messagesRouter);

app.get("/", async(req, res) => {
  const messages = await Message.find({}).populate('author').exec()
  if (req.user) {
    res.render("index.ejs" , {user : req.user , messages:messages});
  } else {
    res.render("index.ejs" , {user : undefined , messages:messages});
  }
});


app.listen(3000, () => console.log("Listening on port 3000"));
