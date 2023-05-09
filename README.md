
# Project Name -  Movies-Library

**Author Name**: mohammad alomari

## WRRC
![alt text](./assets/Screenshot%202023-04-27%20144718.png)

## Overview

## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->
first you need to set up your directory then check your node js to install or update if needed then download Express framwork and the dependencies that you need according to this document https://expressjs.com/en/starter/installing.html
then you will set your routes and error handling functions to determine the responses that comes from the server, yoou may need to create object constructor function to minipulate the reponse data that you like to send to the client tp be in a specific form 

## Project Features
<!-- What are the features included in you app -->
the app will respond to the hits from the clients depending on a specific URL format 


## the new img for lab 14 

#### WRRC including 3ed party API
<br>
<br>

![alt text](./assets/Screenshot%202023-05-02%20020831.png)



# example URls for lab 14:
### search for trending 
// example: http://localhost:3000/trending/all/day<br>
// example: http://localhost:3000/trending/all/week<br>
// example: http://localhost:3000/trending/person/day<br>
 
 ### searching for amovie 
 // example: http://localhost:3000/search/movie?movie=AKA<br>
// example: http://localhost:3000/search/movie?movie=marvel<br>

### searching movie deatails by id 

// example: http://localhost:3000/movie/5<br>
// example: http://localhost:3000/movie/6<br>
// example: http://localhost:3000/movie/8<br>


# example URls for lab 135:

exapmle for post method (insert into):<br>
### localhost:3000/addmovie
```javascript
{
  "title": "spooderman",
  "release_year": 1,
  "director": "zac snider",
  "genre": "action",
  "rating": 99,
  "moviecoverimg": "he came to save you from yourself "

}

```
example for get route:
<br>
// example : localhost:3000/getmovies




# example URls for lab 16:
<br>

```javascript
app.put('/UPDATE/:id',(req,res)=>{
  const id = req.params.id;
  const movie = req.body;
  const sql = `UPDATE moviestable SET title='${movie.title}', release_year=${movie.release_year}, director='${movie.director}', genre='${movie.genre}', rating=${movie.rating}, moviecoverimg='${movie.moviecoverimg}' WHERE id=${id} returning *`;
  client.query(sql).then((wwres)=>{
    res.send(wwres.rows);
  }).catch((err)=>{
    res.send(err);
  })
})

// example : localhost:3000/UPDATE/5
```
```javascript
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
```
 
```javascript
app.delete('/DELETE/:id',(req,res)=>{
  const id = req.params.id;
  const sql = `DELETE FROM moviestable WHERE id=${id} returning *`;
  client.query(sql).then((wwres)=>{
    res.send(`you deleted this movie ${wwres.rows[0].title}`);
  }).catch((err)=>{
    res.send(err);
  })
}
```
// example : localhost:3000/DELETE/5



# deploying the server
homepage:
<br> https://onlineserver-f7ft.onrender.com 

favourite page: <br>
https://onlineserver-f7ft.onrender.com/favorite

trending movies from a third party api :<br> https://onlineserver-f7ft.onrender.com/trending/:mediaType/day

search for a mnovies from the third party api :<br> https://onlineserver-f7ft.onrender.com /search/movie?movie=AKA

insert to the database:<br>
example: https://onlineserver-f7ft.onrender.com /addmovie

```
{
  "title": "spooderman",
  "release_year": 1,
  "director": "zac snider",
  "genre": "action",
  "rating": 99,
  "moviecoverimg": "he came to save you from yourself "

}
```


fetching all the information from the database<br>
example : https://onlineserver-f7ft.onrender.com/getmovies

deleteing <br>
example : https://onlineserver-f7ft.onrender.com/DELETE/5

updating <br>
// example : https://onlineserver-f7ft.onrender.com/UPDATE/5

```
{
  "title": "spooderman",
  "release_year": 1,
  "director": "zac snider",
  "genre": "action",
  "rating": 99,
  "moviecoverimg": "he came to save you from yourself "

}
```

getting a movie by id <br>
// example : https://onlineserver-f7ft.onrender.com/getmovie/5  

