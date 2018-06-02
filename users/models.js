"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  });

UserSchema.methods.forAuthToken = function(){
    return {
        userName: this.userName,
        _id: this._id
    }
}

UserSchema.methods.validatePassword = function(password){
    return bcrypt.compare(password, this.password);
}

UserSchema.methods.serialize = function() {
    return {
      username: this.username || '',
    };
  };


UserSchema.statics.hashPassword = function(password){
    return bcrypt.hash(password, 10);
}

const User = mongoose.model('User', UserSchema);

module.exports = {User};