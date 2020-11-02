const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Promotions = require('../models/promotions');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.get((req, res, next) => {
    Promotions.find({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    if (authenticate.verifyAdmin(user.req)) {
    Promotions.create(req.body)
    .then((promotion) => {
        console.log('Promotion Created', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
        .catch((err) => next(err));
} else {
    res.statusCode = 403;
    res.end('You are not authorized to use this operation.')
}
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT opearation not supported on /promotions');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
    Promotions.remove({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
} else {
    res.statusCode = 403;
    res.end('You are not authorized to use this operation.')
}
});

promotionRouter.route('/:promotionId')
.get((req, res, next) => {
    Promotions.findById(req.params.promotionId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
        .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST opearation not supported on /promotions/' + req.params.promotionId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
    Promotions.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, { new: true })
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
        .catch((err) => next(err));
} else {
    res.statusCode = 403;
    res.end('You are not authorized to use this operation.')
}
})
.delete(authenticate.verifyUser, (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
    Promotions.findByIdAndDelete(req.params.promotionId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
} else {
    res.statusCode = 403;
    res.end('You are not authorized to use this operation.')
}
});

module.exports = promotionRouter;