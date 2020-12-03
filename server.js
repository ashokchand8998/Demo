const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

/*var url = require("url")
var dt = require("./myfirstmodule")
var fs = require("fs")
*/

const app = express();

//allow static pages to load
app.use(express.static(__dirname + "/public"));

/*
Code to use and interact with database using sequelize
*/
const db = require("./app/models");

//In development, you may need to drop existing tables and re-sync database. Just use force: true as following code:
// db.sequelize.sync({force: true}).then(function() {
//     console.log("Drop and re-sync db.");
// });

//don't know whether cors is needed in current context
var corsOptions = {
    origin: "http://localhost:8081"
}
app.use(cors(corsOptions));

//setting port to process evironment port or 8080 if its not set
const port = process.env.PORT || 8080;

//to acess both urlencoded data and json data withing the request body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', require('./routes/routes'));

app.listen(port, function() {
    console.log(`server is running on port: ${port}`);

    /*var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    fs.readFile(filename, function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        if (err) throw err
        res.write(data);
        res.end();
    });
    */
});