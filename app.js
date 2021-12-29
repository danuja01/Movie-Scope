const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
var axios = require("axios").default;

const app = express();

let movieImagesLink = [];
let searchTitle = "";

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  searchTitle = req.body.search;
  searchTitle = searchTitle.charAt(0).toUpperCase() + searchTitle.slice(1);
  const url =
    "https://imdb-api.com/en/API/SearchMovie/k_5m8lsk5x/" + searchTitle;

  axios
    .request(url)
    .then(function (response) {
      movieImagesLink = [];
      for (let i = 0; i < response.data.results.length; i++) {
        movieImagesLink.push(response.data.results[i].image);
      }

      res.render("result", {
        movieImages: movieImagesLink,
        title: searchTitle,
      });
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.get("/details", (req, res) => {
  res.render("details");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port 3000`);
});
