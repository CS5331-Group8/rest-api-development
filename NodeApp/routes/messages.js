var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('../models/user');
var Message = require('../models/message');
var userRoute = require('./user');
// var IdCounter = require('../models/counter');
//For assingment just use magic strings
// Using JWT is sort of cheating but the right thing to do
//I have no idea what .populate does but law number 1. Do not fix what is no broken
router.get('/', function (req, res, next) {
    Message.find({isPublic: true})
        .populate('user', 'fullname')
        .exec(function (err, messages) {
            if (err) {
                console.log("This should only be the empty case");
                return res.status(200).json({
                    "status": true,
                    "result": []
                });
            }
            var result = []
            for (var i = 0; i < messages.length; i++) {
                console.log(messages[i]);
                result[i] = {};
                result[i]["id"] = messages[i].idCounter;
                result[i]["title"] = messages[i].title;
                result[i]["author"] = messages[i].author;
                result[i]["publish_date"] = messages[i].publish_date;
                result[i]["public"] = true;
                result[i]["text"] = messages[i].text;
            }
            // console.log(result);
            res.status(200).json({
                "status": true,
                "result": result
            });
        });
});
//FOr the rest need to verify
router.use('/', function (req, res, next) {

    // console.log(userRoute.uuidMap[req.body.token]);
    if(!uuidMap[req.body.token]){
        return res.status(200).json({
            "status": false,
            "error": "Invalid authentication token."
        });
    }
    jwt.verify(userRoute.uuidMap[req.body.token], 'secret', function (err, decoded) {
        if (err) {
            console.log("Token wrong")
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        console.log("CORRECT");
        next();
    });
});
router.post('/', function (req, res, next) {
    var decoded = jwt.decode(userRoute.uuidMap[req.body.token]);
    Message.find({user: decoded.user._id})
        .populate('user', 'fullname')
        .exec(function (err, messages) {
            if (err) {
                console.log("Should not be Error if error gg");
                return res.status(200).json({
                    "status": true,
                    "result": []
                });
            }
            // console.log(messages);
            var result = []
            for (var i = 0; i < messages.length; i++) {
                result[i] = {};
                result[i]["id"] = messages[i].idCounter;
                result[i]["title"] = messages[i].title;
                result[i]["author"] = messages[i].author;
                result[i]["publish_date"] = messages[i].publish_date;
                result[i]["public"] = messages[i].isPublic;
                result[i]["text"] = messages[i].text;
            }
            res.status(200).json({
                "status": true,
                "result": result
            });
        });
});

router.post('/create', function (req, res, next) {
    var decoded = jwt.decode(userRoute.uuidMap[req.body.token]);
    User.findById(decoded.user._id, function (err, user) {
        if (err) {
            console.log("ADD ERROR" + err);
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        var message = new Message({
            title: req.body.title,
            author: user.fullname,
            publish_date: new Date().toISOString(),
            isPublic: req.body.public,
            text: req.body.text,
            user: user
        });
        //This statement is not working dont know why but not important le i dont use it already.
        user.messages.push(message);
        user.save();
        message.save(function (err, result) {
            if (err) {
                console.log("No error should be here");
                return res.status(200).json({
                    "status": false,
                    "error": "Invalid authentication token."
                });
            }
            res.status(201).json({
                "status": true,
                "result": {
                    "id" : result.idCounter
                }
            });
        });
    });
});

router.post('/permission', function (req, res, next) {
    var decoded = jwt.decode(userRoute.uuidMap[req.body.token]);
    console.log(req.body);
    Message.find({idCounter: req.body.id}, function (err, messageArr) {
        if (!messageArr) {
            //This should not happen
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        message = messageArr[0];
        if (err) {
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        if (!message) {
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        if (message.user != decoded.user._id) {
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        message.isPublic = req.body.public;
        message.save(function (err, result) {
            if (err) {
                return res.status(200).json({
                    "status": false,
                    "error": "Invalid authentication token."
                });
            }
            res.status(200).json({
                "status": true,
            });
        });
    });
});

router.post('/delete', function (req, res, next) {
    var decoded = jwt.decode(userRoute.uuidMap[req.body.token]);
    // console.log(req.query.token + "   : lol");
    console.log(req.body.id + "      ID");
    Message.find({idCounter: req.body.id}, function (err, messageArr) {
        if (!messageArr) {
            //This should not happen
            console.log("WRONG MSG ID but i got to return invalid token ....");
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        message = messageArr[0];
        console.log("Should only find 1" + messageArr.length);
        if (err) {
            console.log("WRONG MSG ID but i got to return invalid token ....");
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        if (!message) {
            console.log("WRONG MSG ID but i got to return invalid token ....")
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        if (message.user != decoded.user._id) {
            console.log("DOnt let this guy delete other people stuff");
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        var removeMsg = new Message(message);
        console.log("removing");
        removeMsg.remove(function (err, result) {
            if (err) {
                console.log("should never come here check like hell on top")
                return res.status(200).json({
                    "status": false,
                    "error": "Invalid authentication token."
                });
            }
            res.status(200).json({
                "status": true,
            });
        });
    });
});

module.exports = router;