const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req, res, next) => {
    Leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
    Leaders.create(req.body)
    .then((leader) => {
        console.log('leader Created', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
        .catch((err) => next(err));
} else {
    res.statusCode = 403;
    res.end('You are not authorized to use this operation.')
}
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT opearation not supported on /leaders');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
    Leaders.remove({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
} else {
    res.statusCode = 403;
    res.end('You are not authorized to use this operation.')
}
});

leaderRouter.route('/:leaderId')
.get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
        .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST opearation not supported on /leaders/' + req.params.leaderId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
        .catch((err) => next(err));
} else {
    res.statusCode = 403;
    res.end('You are not authorized to use this operation.')
}
})
.delete(authenticate.verifyUser, (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
    Leaders.findByIdAndDelete(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
} else {
    res.statusCode = 403;
    res.end('You are not authorized to use this operation.')
}
});

module.exports = leaderRouter;