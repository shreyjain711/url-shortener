require('dotenv').config({path: './keys.env'});
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const dbFunctions = require('./dbInteraction');

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// POST Req
app.post('/api/shorturl', function(req, res) {
  let url = req.body.url;
  res.send(JSON.stringify(dbFunctions.saveUrl(url)));
});

// GET Req
app.get('/api/shorturl/:code', function(req, res) {
  const code = req.params.code;
  let url = dbFunctions.findUrl(code);
  if (url) res.redirect(url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
