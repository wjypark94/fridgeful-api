"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const config = require("../config");

const createAuthToken = function(user) {
    return jwt.sign({user}, config.JWT_SECRET, {
      subject: user.username,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256'
    });
  };
  
  const localAuth = passport.authenticate('local', {session: false});
  router.use(bodyParser.json());
  
  router.post('/', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user.serialize());
    res.json({authToken, userId: req.user._id});
  });
  
  const jwtAuth = passport.authenticate('jwt', {session: false});
  
  router.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({authToken});
  });
  module.exports = {router};