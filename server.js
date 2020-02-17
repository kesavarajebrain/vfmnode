//express package
const express = require('express');
//middleware package
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./routes/api');
const app = express();
const path = require('path');

app.set('view engine', 'ejs')
app.use(bodyParser.json({ limit: "4mb" }))
app.use(bodyParser.urlencoded({ limit: "4mb", extended: true, parameterLimit: 50000 }))
app.use(cors());
// app.use('/api', api);
app.use(function (req, res, next) {
  //set headers to allow cross origin request.
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// app.get('/api', function (req, res) {
//   res.end('file catcher example');
// });

//Serve only the static files form the dist directory
// app.use(express.static(__dirname + '/src'));
app.use(express.static(path.join(__dirname, '/routes')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/routes/api'));
});
console.log('######' , __dirname)
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
console.log('server running on port', 8080);
