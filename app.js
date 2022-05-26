const express = require("express");
const morgan = require("morgan");
const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config();

const urls = mongoose.Schema({
  urlSlug: String,
  url: {
    type: String,
    required: true,
  },
  shorUrl: {
    type: String,
    required: true,
  },
});
const UrlModel = mongoose.model("Urls", urls);

(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(conn.connection.host);
  } catch (error) {
    console.log(error);
  }
})();

app.set("view engine", "ejs");

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/url", async (req, res) => {
  const { url } = req.body;
  let urlSlug = nanoid(5);
  if (!url) {
    res.send("please enter a url");
    return;
  }
  const slugExist = UrlModel.findOne({ urlSlug });
  if (slugExist) {
    urlSlug = nanoid(5);
  }
  const tinyUrl = await UrlModel.create({
    urlSlug,
    url,
    shorUrl: req.protocol + "://" + req.get("host") + "/" + urlSlug,
  });
  if (tinyUrl) {
    res.json(tinyUrl.shorUrl);
  }
});

app.get("/:id", async (req, res) => {
  const slug = req.params.id;
  const urlExists = await UrlModel.findOne({ urlSlug: slug });
  if (urlExists) {
    res.redirect(urlExists.url);
  } else {
    res.send("not found");
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("listning...");
});
