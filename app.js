const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
let cors = require('cors');
let bodyParser = require('body-parser');  

const listings = require('./routes/listing');

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/listings', listings);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});