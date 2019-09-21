'use strict'

var express = require('express');
var router = express.Router();

// for connection
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// hide this connection file
var connection_info  = require('./connection_info');

var db = mongoose.connect(connection_info.connection_info , () => {
    console.log('db connected!')
});

//POSTS 
router.post('/workorder_submission', function (req, res, next) {
    console.log(req.body)
})

router.post('/technician_submission', function (req, res, next) {
    console.log(req.body)
})

module.exports = router;
