const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./config/db");
const route = require("./routes");
require('dotenv').config();
const swaggerDocs = require('./swagger');
BigInt.prototype.toJSON = function() {
    return this.toString()
} 
const app = express();

db.connect();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

route(app);
const http = require("http").Server(app);
const port = 3001;

http.listen(port, () => {
    console.log("Server is running on port " + port);
    swaggerDocs(app, port);
});