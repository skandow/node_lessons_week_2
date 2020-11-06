const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200)})
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .populate('dishes.dish')
    .then((favorites) => {
        console.log(favorites.dishes)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(req.user)
    Favorites.create({user: req.user._id, dishes: req.body})
    .then((favorite) => {
        console.log('favorite Created', favorite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
        .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT opearation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndDelete({user: req.user._id})
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200)})
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET opearation not supported on /favorites/' + req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (!favorite) {
            let newFavorite = Favorites.create({user: req.user._id});
            newFavorite.dishes.push(req.params.dishId);
            console.log('favorite Created', newFavorite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(newFavorite);
        } else {
            let thisDish = favorite.dishes.find(dish => dish._id.equals(req.params.dishId))
            if (!thisDish) { 
            favorite.dishes.push({"_id": req.params.dishId});
            favorite.save();
            console.log('favorite Added', favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        } else {
            res.statusCode = 403;
            res.end('This dish has already been added to your favorites.')
        }}}, (err) => next(err))
        .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT opearation not supported on /favorites' + req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        favorite.dishes.id(req.params.dishId).remove();
        favorite.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;