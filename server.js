/*Express App Server*/
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

//setting port to process evironment port or 8080 if its not set
const port = process.env.PORT || 8080;

/* Middleware */
//allow static pages to load
app.use(express.static('./frontend/public'));

//to access both urlencoded data and json data withing the request body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//routes
app.use('/', require('./api/routes/routes.js'));

const db = require("./app/models");

//In development, you may need to drop existing tables and re-sync database. Just use force: true as following code:
db.sequelize.sync({}).then(function() {
    console.log("Drop and re-sync db.");
});

app.listen(port, function() {
    console.log(`server is running on port: ${port}`);
});