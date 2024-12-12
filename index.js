const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const route = require('./routes');
const swaggerDocs = require('./swagger');
const logger = require('./config/log');
const { errorHandlingMiddeware } = require('./middlewares/error');

require('dotenv').config();

BigInt.prototype.toJSON = function () {
  return this.toString();
};


logger.info('START SUCESSS');

const app = express();

db.connect();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

route(app);

app.use(errorHandlingMiddeware);

const http = require('http').Server(app);
const port = 3001;

http.listen(port, () => {
  console.log('Server is running on port ' + port);
  swaggerDocs(app, port);
});
