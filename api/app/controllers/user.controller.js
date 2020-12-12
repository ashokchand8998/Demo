//used for encryption
const crypto = require('crypto');

//including database related modules to use
const { sequelize } = require('../models');
const db = require("../models");
const User = db.user;

//checking whether user exists
exports.find = (req, res) => {
    User.findOne({
        where: {
            email_id: req.body.email_id
        }
    })
    .then( function(data) {
        if(data) {
            res.status(200).send({
                exists: true
            });
        } else {
            res.status(200).send({
                exists: false
            });
        }
    })
    .catch(function(err) {
        res.status(500).send({
            message: err
        });
    })
}

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
        admin: req.body.admin ? req.body.admin : false,
        password: passobject.hash,
        salt: passobject.salt
    }

    //saving user in the database
    User.create(user)
    .then(function(data) {
        res.send({
            id: data.id,
            email_id: data.email_id,
        });
    })
    .catch(function(err) {
        res.status(500).send({
            message: err.message === "Validation error" ? "User with same email id already exists!! Please try to login" : err.message
        });
    });
};


// Find a single User with and email_id and then authenticate
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


//tracker report data
exports.getTrackReport = (req, res) => {
    user_id = req.params.uid;
    start_date = req.params.start_date;
    end_date = req.params.end_date;
    User.findOne({
        where: {
            id: user_id
        }
    }).then(function(data) {
         if(data["admin"]) {
            if(start_date && end_date) {
                sequelize.query(`SELECT 
                email_id,
                 count(title) AS total_tasks, 
                 SUM(CASE WHEN completed THEN 1 ELSE 0 END) AS completed_tasks 
                 FROM public.task RIGHT JOIN public.user 
                 ON public.task.user_id = public.user.id 
                 WHERE last_date >= '${start_date}' AND last_date <= '${end_date}' 
                 GROUP BY email_id;`)
                .then(function(results, metadata) {
                    res.send(results[0])
                })
                .catch(function(err) {
                    res.status(500).send({
                        message: err.message
                    })
                })
            }
         } else {
             res.status(404).send({
                 message: "You don't have access to this page!!"
             })
         }
    }).catch(function(err) {
        res.status(500).send({
            message: err.message || "Some error has occured while retriving user!!"
        });
    });
        
}

/*
//Feature not implemented
Delete a User with the specified email_id in the request
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
*/
