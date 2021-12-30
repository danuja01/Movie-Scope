const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
var axios = require("axios").default;

const app = express();

let movieImagesLink = [];
let searchTitle = "";
let movieId = [];
let clickedID = "";
let actorName = [];
let actorcharacter = [];
let actorImg = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  searchTitle = req.body.search;
  searchTitle = searchTitle.charAt(0).toUpperCase() + searchTitle.slice(1);
  res.redirect("/result");
});

app.get("/result", (req, res) => {
  const url =
    "https://imdb-api.com/en/API/SearchMovie/k_x5ev0pv7/" + searchTitle;

  axios
    .get(url)
    .then(function (response) {
      movieImagesLink = [];
      movieId = [];
      for (let i = 0; i < response.data.results.length; i++) {
        movieImagesLink.push(response.data.results[i].image);
        movieId.push(response.data.results[i].id);
      }

      res.render("result", {
        movieImages: movieImagesLink,
        title: searchTitle,
        movieId: movieId,
      });
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.post("/result", (req, res) => {
  clickedID = req.body.submit;
  res.redirect("/details");
});

app.get("/details", (req, res) => {
  const url1 =
    "https://imdb-api.com/en/API/Title/k_x5ev0pv7/" +
    clickedID +
    "/Trailer,Ratings,Wikipedia";

  axios
    .get(url1)
    .then(function (response) {
      let image = response.data.image;
      let name = response.data.title;
      let desc = response.data.plot;
      let genre = response.data.genres;
      let lan = response.data.languages;
      let director = response.data.directors;
      let year = response.data.year;
      let imdb = response.data.imDbRating;
      let rotten = response.data.ratings.rottenTomatoes;
      let plot = response.data.wikipedia.plotFull.plainText;
      actorName = [];
      actorcharacter = [];
      actorImg = [];

      for (var i = 0; i < response.data.actorList.length; i++) {
        actorName.push(response.data.actorList[i].name);
        actorcharacter.push(response.data.actorList[i].asCharacter);
        actorImg.push(response.data.actorList[i].image);
      }

      res.render("details", {
        image: image,
        name: name,
        desc: desc,
        genre: genre,
        director: director,
        lan: lan,
        year: year,
        imdb: imdb,
        rotten: rotten,
        plot: plot,
        castname: actorName,
        castimg: actorImg,
        castcar: actorcharacter,
      });
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port 3000`);
});
