"use strict"
const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
// i dont know what this do i need to review 
const port = 3000;
const movieData = require('./data.json');
const { resolveSoa } = require('dns');
const { get } = require('http');
let newMovieData = [];

app.use(cors());

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
function newApiDate(id,title,release_date,poster_path,overview){
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}



// ################################################################



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
  
  app.get('/trending/:mediaType/:duration',(req, res)=>{
    const searchByMediaType=req.params.mediaType;
    const searchByDuration=req.params.duration;
    const url=`https://api.themoviedb.org/3/trending/${searchByMediaType}/${searchByDuration}?api_key=cb627feaafd79871b46e955b2766f6b1`;
    axios.get(url).then((response) =>{
      res.send(
        response.data.results.map((movie) => {
          return new newApiDate(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
        })
      )
    }).catch((error) =>{
      res.send(error) 
    })
  });


  app.get('/search',(req, res) =>{
   const searchingFor=req.query.movie;
   const encodedMOvieName=encodeURI(searchingFor);
   const pageNumber=parseInt(req.query.page);
   const url=`https://api.themoviedb.org/3/search/company?api_key=cb627feaafd79871b46e955b2766f6b1&query=${encodedMOvieName}&page=${pageNumber}`;
   axios.get(url).then((themovie)=>{
    const searchResults=themovie.data.results.map((movies)=>{
      return movies.name
    })
    res.send(searchResults);
   }).catch((err)=>{res.send(err)});
  })

  app.get('/collections/:collection',(req,res)=>{
    const collection=req.params.collection;
    const url=`https://api.themoviedb.org/3/collection/${collection}?api_key=cb627feaafd79871b46e955b2766f6b1`;
    axios.get(url).then((theCollection)=>{
      res.send(theCollection.data);
    }).catch((err)=>{res.send(err)});
  })

app.get('/movie/:id',(req,res)=>{
  const id=req.params.id;
  const url=`https://api.themoviedb.org/3/movie/${id}?api_key=cb627feaafd79871b46e955b2766f6b1`;
  axios.get(url).then((theMovie)=>{
    res.send(theMovie.data.title);
  }).catch((err)=>{res.send(err)});
// ###### what is append_to_response
})
  

  
// ########### listener
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



