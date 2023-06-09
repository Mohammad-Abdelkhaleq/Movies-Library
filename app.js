"use strict"
const express = require('express');
const app = express();
require("dotenv").config();
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
// i dont know what this do i need to review 
const movieData = require('./data.json');
const { resolveSoa } = require('dns');
const { get } = require('http');
let newMovieData = [];
const port = process.env.PORT
const movieKey = process.env.API_KEY;

app.use(cors());
app.use(express.json());

// #constructors#################################

function reformedMovieData(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}
function errorFormat(status, responseText) {
  this.status = status;
  this.responseText = responseText;
}
function newApiDate(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}



// ###################################################################################################################


// this code fetches the data from a file in the server app (the data.json file)
// and sets an error handlin middle ware 


app.get('/', (req, res) => {
  let themovie = new reformedMovieData(movieData.title, movieData.poster_path, movieData.overview)
  res.send(themovie)
})
app.get('/favorite', (req, res) => {
  res.send('welcone to favourite page');
});
app.use(errorHandler);
function errorHandler(req, res, next) {
  if (res.statusCode === 404) {
    res.send(new errorFormat(404, "page not found"))
  } else if (res.statusCode === 500) {
    res.send(new errorFormat(500, "Sorry, something went wrong"))
  } else {
    next();
  }
}
// ############################################################################################################################
// this code fetches data from a thirs party api and uses axios package to retrieve the data from the custom link i made using the custom link i made using the url object (req.params and req.query parameters)


app.get('/trending/:mediaType/:duration', (req, res) => {
  const searchByMediaType = req.params.mediaType;
  const searchByDuration = req.params.duration;
  const url = `https://api.themoviedb.org/3/trending/${searchByMediaType}/${searchByDuration}?api_key=${movieKey}`;
  axios.get(url).then((response) => {
    res.send(
      response.data.results.map((movie) => {
        return new newApiDate(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
      })
    )
  }).catch((error) => {
    res.send(error)
  })
});
// example: http://localhost:3000/trending/all/day
// example: http://localhost:3000/trending/all/week
// example: http://localhost:3000/trending/person/day



app.get('/search/movie', (req, res) => {
  const searchingFor = req.query.movie;
  const encodedMOvieName = encodeURI(searchingFor);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&query=${encodedMOvieName}`;
  axios.get(url).then((themovie) => {
    const searchResults = themovie.data.results.map((movies) => {
      return movies.title
    })
    res.send(searchResults);
  }).catch((err) => { res.send(err) });
})

// example: http://localhost:3000/search/movie?movie=AKA
// example: http://localhost:3000/search/movie?movie=marvel



app.get('/collections/:collection', (req, res) => {
  const collection = req.params.collection;
  const url = `https://api.themoviedb.org/3/collection/${collection}?api_key=${movieKey}`;
  axios.get(url).then((theCollection) => {
    res.send(theCollection.data);
  }).catch((err) => { res.send(err) });
})



app.get('/movie/:id', (req, res) => {
  const id = req.params.id;
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${movieKey}`
  axios.get(url).then((theMovie) => {
    res.send(theMovie.data);
  }).catch((err) => { res.send(err) });
})

// example: http://localhost:3000/movie/5
// example: http://localhost:3000/movie/6
// example: http://localhost:3000/movie/8

// #########################################################################################################################
//  here i used the get and post and the delete and the update methods to minipulate and change the database 




app.post('/addmovie', (req, res) => {
  const movie = req.body;
  const sql = `INSERT INTO moviestable (title, release_year, director, genre, rating, moviecoverimg) VALUES ('${movie.title}', ${movie.release_year}, '${movie.director}', '${movie.genre}', ${movie.rating}, '${movie.moviecoverimg}') RETURNING *`;
  client.query(sql)
    .then((inserted) => {
      res.send(inserted.rows);
    })
    .catch((err) => {
      res.send(err);
    });
});
// example: localhost:3000/addmovie
// // {
//   "title": "spooderman",
//   "release_year": 1,
//   "director": "zac snider",
//   "genre": "action",
//   "rating": 99,
//   "moviecoverimg": "he came to save you from yourself "

// }

app.post('/addFavMovie',(req,res)=>{
  const movie = req.body;
  const sql = `INSERT INTO favmovies (id,title, poster_path, overview, comment) VALUES (${movie.id},'${movie.title}', '${movie.poster_path}', '${movie.overview}', '${movie.comment}') RETURNING *`;
  client.query(sql).then((inserted)=>{
    res.send("movie added to favorites");
  }).catch((err)=>{
    res.send("Oops, something went wrong. Please try again later.");
  })
})



app.get('/getmovies',(req,res)=>{
  const sql = 'SELECT * from favmovies';
  client.query(sql).then((wwres)=>{
    res.send(wwres.rows);
  })
})

// example : localhost:3000/getmovies

// #3############################################################################################################
// lab 16

app.delete('/DELETE/:id',(req,res)=>{
  const id = req.params.id;
  const sql = `DELETE FROM favmovies WHERE id=${id} returning *`;
  client.query(sql).then((wwres)=>{
    res.send(`you deleted this movie ${wwres.rows[0].title}`);
  }).catch((err)=>{
    res.send(err);
  })
})
// example : localhost:3000/DELETE/5


// app.put('/UPDATE/:id',(req,res)=>{
//   const id = req.params.id;
//   const movie = req.body;
//   const sql = `UPDATE favmovies SET  id=${movie.id}, title='${movie.title}', poster_path='${movie.poster_path}', overview='${movie.overview}', comment='${movie.comment}'  WHERE id=${id} returning *`;
//   client.query(sql).then((wwres)=>{
//     res.send(wwres.rows);
//   }).catch((err)=>{
//     res.send(err);
//   })
// })

app.put('/UPDATE/:id',(req,res)=>{
  const id = req.params.id;
  const movie = req.body;
  console.log(movie);
  const sql = `UPDATE favmovies SET comment='${movie.comment}' WHERE id=${id} RETURNING *`;
  client.query(sql).then((wwres)=>{
    // res.send(wwres.rows);
    res.send(`you updated this movie comment`);
  }).catch((err)=>{
    res.send(err);
  })
})



// example : localhost:3000/UPDATE/5

app.get('/getmovie/:id',(req,res)=>{
  const id = req.params.id;
  const sql = `SELECT * FROM moviestable WHERE id=${id};`;
  client.query(sql).then((wwres)=>{
    res.send(wwres.rows);
  }).catch((err)=>{
    res.send(err);
  })
})



// example : localhost:3000/getmovie/5  


// ########### listener
client.connect().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}).catch(() => { console.log(`error listening`) })




