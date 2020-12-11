const express = require('express');

//create a mini_app(express.Router instead of using main_app(express())
const router = express.Router();
const path = require('path')

//importing database/table controllers
const task = require("../app/controllers/task.controller.js");
const user = require("../app/controllers/user.controller.js")

/* routes */
//handling get requests from client
router.get('/api/getalltasks/:uid/:completed', function(req, res) {
    task.findAll(req, res);
});

//getting track report data
router.get('/api/view-track-report/:uid/:start_date/:end_date', function(req, res) {
    user.getTrackReport(req, res);
})

/* handling post request from client */
//creating new users
router.post('/api/add-user', function(req, res) {
    user.create(req, res);
})

//checking whether user exists
router.post('/api/check-user', function(req, res) {
    user.find(req, res);
})

//authenticating user while logging in
router.post('/api/user-login', function(req, res) {
    user.authenticate(req, res);
})

//adding new task request
router.post('/api/addnewtask/:uid', function(req, res) {
    task.create(req, res);
});

//handling delete requests from client
router.delete('/api/delete-task/:uid/:id', function(req, res) {
    task.delete(req, res);
})

//handling put(update) requests from client
router.put('/api/task/:uid/:id', function(req, res) {
    task.update(req, res);
})

router.use(function(req, res) {
    res.status(404).send({message: "Cannot access the requested page!"});
});

//exporting so elements can be accessed when this file is imported
module.exports = router;