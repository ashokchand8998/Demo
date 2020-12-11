const db = require("../models");
const Task = db.task;

//Create and save new Task
exports.create = (req, res) => {
    //validate request
    if(!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return
    }

    //create task
    const task = {
        title: req.body.title,
        last_date: req.body.last_date,
        completed: req.body.completed ? req.body.completed : false,
        user_id: req.body.user_id
    }

    //saving task in the database
    Task.create(task)
    .then(function(data) {
        res.send(data);
    })
    .catch(function(err) {
        res.status(500).send({
            message: err.message || "Some error has occured while adding a task!"
        });
    });
};

// Retrive all tasks from the database based on condition provided
exports.findAll = (req, res) => {
    Task.findAll({
        where: {
            user_id: req.params.uid,
            completed: req.params.completed
        }
    })
    .then(function(data) {
        res.send(data);
    })
    .catch(function(err) {
        res.status(500).send({
            message: err.message || "Some error has occured while retriving tasks!"
        });
    });
};

//Update a task
exports.update = (req, res) => {
    Task.update(req.body, {
        where: {
            user_id: req.params.uid,
            id: req.params.id
        }
    }).then(function(num) {
        if(num == 1) {
            res.send({
                messsage: "Task was updated successfully!"
            });
        }
        else {
            res.send({
                message: "Cannot update Task. Maybe task dosen't exist or request body is empty!"
            })
        }
    }).catch(function(err) {
        res.status(500).send({
            message: "Error updating Task"
        });
    });
};

//Delete a task
exports.delete = (req, res) => {
    Task.destroy({
        where: {
            user_id: req.params.uid,
            id: req.params.id
        }
    })
    .then(function(num) {
        if(num === 1) {
            res.send({
                message: "Task was deleted successfuly!"
            });
        } else {
            res.send({
                message: "Cannot update Task. Maybe task dosen't exist!"
            });
        }
    })
    .catch(function(err) {
        res.status(500).send({
            message: "Could not delete the task"
        });
    });
};