"use strict";

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');

mongoose.Promise = global.Promise;

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const {DATABASE_URL, PORT} = require('./config');
const {CLIENT_ORIGIN} = require('./config');

const recipeRouter = require('./recipeRouter');
const { Recipe } = require('./models');

const app = express();
const jsonParser = bodyParser.json();


app.use(bodyParser.json());
app.use(morgan('common'));

const cors = require('cors');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
 
  
  next();
});

app.use(
  cors({
      origin: CLIENT_ORIGIN
  })
);

app.use('/api/users', usersRouter);
app.use('/api/auth', jsonParser, authRouter);
app.use('/api/recipelist', recipeRouter);

app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

app.get('/*', (req, res) => {
  res.json({ok: true});
});

app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'working'
  });
});

passport.use(localStrategy);
passport.use(jwtStrategy);


let server;

//runServer is responsible for coordinating the connection
//to the database and the running of the HTTP server
//use Mongoose to connect to the database using the URL from config.js
function runServer(databaseUrl=DATABASE_URL, port=PORT){
  return new Promise(function(resolve, reject){
      mongoose.connect(databaseUrl, function(err){
              if(err){
                  return reject(err);
              }
              console.log(`mongoose connected to ${databaseUrl}`);
              server = app.listen(port, function(){
                  console.log(`Your app is listening on port ${port}!!!!`);
                  resolve();
              })
              .on('error', function(err){
                  mongoose.disconnect();
                  reject(err);
              });
      });
  });
}

//closeServer needs access to a server object but that only 
//gets created wen runServer runs so we declare server here 
//and then assign a value to it in run

//responsible for disconnecting from the database and
//closing down the app

function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }

//useful trick for making this file both an executabel script 
//and a module
if (require.main === module) {
  runServer(DATABASE_URL).catch(err=> console.log(err));
}

module.exports = {app, runServer, closeServer}
