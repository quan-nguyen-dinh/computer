const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const route = require('./routes');
const swaggerDocs = require('./swagger');

require('dotenv').config();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();

db.connect();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

route(app);

const errorMiddleware = (err, req, res, next) => {
  console.log('------MIDDLE WARE-------------', err.name, err.message);
  if (err.name === 'Error' && err.message) {
    res.status(400).json({ message: err.message });
    return;
  }
  console.log(err.message);
};

app.use(errorMiddleware);

const http = require('http').Server(app);
const port = 3001;

http.listen(port, () => {
  console.log('Server is running on port ' + port);
  swaggerDocs(app, port);
});
