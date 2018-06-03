"use strict";

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/fridgeful';
exports.PORT = process.env.PORT || 8080;
exports.CLIENT_ORIGIN = "http://localhost:3000" || 'https://mystifying-jepsen-0af500.netlify.com/';
exports.JWT_SECRET = process.env.JWT_SECRET || 'secret';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';