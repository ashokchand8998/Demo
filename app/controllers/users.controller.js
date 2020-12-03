const { RSA_PKCS1_PSS_PADDING } = require('constants');
const crypto = require('crypto');
const { cursorTo } = require('readline');
const { sequelize } = require('../models');
const db = require("../models");
const User = db.users;
//for using operators
//const Op = db.sequelize.Op;
//hashing password function
const setHashedPassword = function(password, new_salt = crypto.randomBytes(16).toString('hex')) {
    let new_hash = crypto.pbkdf2Sync(password, new_salt, 1000, 64, 'sha512').toString('hex');
    return {
        salt: new_salt,
        hash: new_hash
    }
}

//Create and save new User
exports.create = (req, res) => {
    //validate request
    if(!req.body.email_id) {
        res.status(400).send({
            message: req.body + "Content can not be empty!"
        });
        return
    }

    //create user
    const passobject = setHashedPassword(req.body.password);
    const user = {
        email_id: req.body.email_id,
        password: passobject.hash,
        salt: passobject.salt
    }

    //saving user in the database
    User.create(user)
    .then(function(data) {
        res.send({
            id: data.id,
            email_id: data.email_id
        });
    })
    .catch(function(err) {
        res.status(500).send({

            message: err.message === "Validation error" ? "User with same email id already exists!! Please try to login" : err.message
        });
    });
};

// Find a single User with and email_id
exports.authenticate = (req, res) => {
    User.findOne({
        where: {
            email_id: req.body.email_id
        }
    })
    .then(function(data) {
        if(data) {
            const currentHash = setHashedPassword(req.body.password, data.salt).hash;
            if(data.password === currentHash) {
                res.send({
                    id: data.id,
                    email_id: data.email_id
                });
            }
            else {
                res.status(403).send("Wrong password entered!!")
            }
        }
        else {
            res.status(403).send(`Not able to find user with email_id: ${req.body.email_id}. Maybe user dosen't exists!!`)
        }
    })
    .catch(function(err) {
        res.status(500).send({
            message: err.message || "Some error has occured while retriving user!!"
        });
    });
};

//Update a User by the email_id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    User.update(req.body, {
        where: {
            id: id
        }
    }).then(function(num) {
        console.log("returned data: " + typeof num);
        if(num == 1) {
            res.send({
                messsage: "User was updated successfully!"
            });
        }
        else {
            res.send({
                message: `Cannot update User with id=${id}. Maybe user dosen't exist or request body is empty!`
            })
        }
    }).catch(function(err) {
        res.status(500).send({
            message: "Error updating User with id=" + id
        });
    });
};

//Tracker Report
exports.getTrackReport = (req, res) => {
    console.log(User)
    sequelize.query("SELECT email_id, count(title) AS total_tasks, SUM(CASE WHEN completed THEN 1 ELSE 0 END) AS completed_tasks FROM public.task RIGHT JOIN public.user ON public.task.user_id = public.user.id GROUP BY email_id;")
    .then(function(results, metadata) {
        res.send(results[0])
    })
    .catch(function(err) {
        res.status(500).send({
            message: err.message
        })
    })
}

//Delete a User with the specified email_id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    
    User.destroy({
        where: {
            id: id
        }
    })
    .then(function(num) {
        if(num === 1) {
            res.send({
                message: "User was deleted successfuly!"
            });
        } else {
            res.send({
                message: `Cannot update User with id=${id}. Maybe user dosen't exist!`
            });
        }
    })
    .catch(function(err) {
        res.status(500).send({
            message: "Could not delete the user with id=" + id
        });
    });
};
