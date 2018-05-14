const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');

mongoose.Promise = global.Promise;

 const app = express();
 const jsonParser = bodyParser.json();

 const PORT = process.env.PORT || 3000;

const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');

 app.get('/api/*', (req, res) => {
   res.json({ok: true});
 });

 app.use(
     cors({
         origin: CLIENT_ORIGIN
     })
 )


 app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

 module.exports = {app};