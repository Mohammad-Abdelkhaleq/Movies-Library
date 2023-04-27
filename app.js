"use strict"
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
// i dont know what this do i need to review 
const port = 3000;
const movieData = require('./data.json');
const { resolveSoa } = require('dns');
let newMovieData = [];
function reformedMovieData(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}
function errorFormat(status, responseText) {
    this.status = status;
    this.responseText = responseText;
}

app.use(errorHandler);

app.get('/', (req, res) => {
    let themovie = new reformedMovieData(movieData.title, movieData.poster_path, movieData.overview)
    res.send(themovie)
})
app.get('/favorite', (req, res) => {
    res.send('welcone to favourite page');
});
function errorHandler(req, res, next) {
    if (res.statusCode === 404) {
      res.send(new errorFormat(404, "page not found"))
    } else if (res.statusCode === 500) {
      res.send(new errorFormat(500, "Sorry, something went wrong"))
    } else {
      next();
    }
  }
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})