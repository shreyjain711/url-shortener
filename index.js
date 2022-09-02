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
app.post('/api/shorturl', async function(req, res) {
  let url = req.body.url;
  res.send(JSON.stringify(await dbFunctions.saveUrl(url)));
});

// GET Req
app.get('/api/shorturl/:code', async function(req, res) {
  const code = req.params.code;
  let url = await dbFunctions.findUrl(code);
  console.log('got:', url);
  if(url && url.length == 1) {
    console.log('redirecting to:', url[0].original_url);
    res.redirect(url[0].original_url);
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
