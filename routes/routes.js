const express = require('express');
//create a mini_app(express.Router instead of using main_app(express())
const router = express.Router();
const path = require('path')

//importing database/table controllers
const tasks = require("../app/controllers/tasks.controller.js");
const users = require("../app/controllers/users.controller.js")

//routes
//handling get requests from client
router.get('/api/getalltasks/:uid', function(req, res) {
    tasks.findAll(req, res);
});

//getting all tasks data
router.get('/api/gettask/:uid/:id', function(req, res) {
    tasks.findOne(req, res);
})

//getting track report data
router.get('/api/view-track-report/:uid/:start_date/:end_date', function(req, res) {
    users.getTrackReport(req, res);
})

//handling post request from client
router.post('/api/add-user', function(req, res) {
    users.create(req, res);
})

//checking whether user exists
router.post('/api/check-user', function(req, res) {
    users.find(req, res);
})

//authenticating user while logging in
router.post('/api/user-login', function(req, res) {
    users.authenticate(req, res);
})

//adding new task request
router.post('/api/addnewtask/:uid', function(req, res) {
    tasks.create(req, res);
});

//handling delete requests from client
router.delete('/api/delete-task/:uid/:id', function(req, res) {
    tasks.delete(req, res);
})

//handling put(update) requests from client
router.put('/api/task/:uid/:id', function(req, res) {
    tasks.update(req, res);
})

router.use(function(req, res) {
    res.status(404).send({message: "Cannot access the requested page!"});
});

//elements that can be accessed when this file is imported
module.exports = router;