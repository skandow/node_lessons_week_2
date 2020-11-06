const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    } 
    cb(null, true);
}; 

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200)})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET opearation not supported on /dishes');
})
.post(cors.corsWithOptions, authenticate.verifyUser, upload.single('imageFile'), (req, res) => {
    if (authenticate.verifyAdmin(req.user)) {  
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file)
} else {
    res.statusCode = 403;
    res.end('You are not authorized to use this operation.')
}})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT opearation not supported on /dishes');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE opearation not supported on /dishes');
})
module.exports = uploadRouter;