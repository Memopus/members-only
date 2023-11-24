const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter");
const app = express();

const mongoDb =
  "mongodb+srv://memopus:yan20079@cluster0.puwgpzy.mongodb.net/membersOnly?retryWrites=true&w=majority";

async function main() {
  await mongoose.connect(mongoDb);
}

main().catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("views" + __dirname + "/views");
app.set("view engine", "ejs");
app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(3000, () => console.log("Listening on port 3000"));
