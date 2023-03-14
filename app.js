const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://Sumit-Admin:t4PpoWDDqiZQQPd4@cluster0.ubbrnwl.mongodb.net/todolistDB"
);

const itemSchema = new mongoose.Schema({
  name: String,
});

const listSchema = {
  name: String,
  items: [itemSchema],
};

const Item = mongoose.model("Item", itemSchema);

let itemFromDb = [];

app.get("/", function (req, res) {
  const day = date.getDate();

  Item.find().then(function (data) {
    itemFromDb = data;
    res.render("list", { listTitle: day, userItemsEJS: itemFromDb });
  });

  // res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const newItem = req.body.newItem;

  console.log(req.body);
  const item = new Item({
    name: newItem,
  });
  item.save().then(function (data) {
    console.log(`Added this data -> ${data}`);
    res.redirect("/");
  });
});

app.post("/delete", function (req, res) {
  let index = req.body.checkbox;
  console.log(itemFromDb[index].name);
  Item.findOneAndDelete({ name: itemFromDb[index].name }).then(function (list) {
    console.log(`Deleted item -> ${list}`);
    // res.redirect("/");
    setTimeout(function () {
      res.redirect("/");
    }, 100);
  });
});

app.get("/:customListName", function (req, res) {
  res.redirect("/");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(port, function (req, res) {
  console.log(`Server is running on port : ${port}`);
});
