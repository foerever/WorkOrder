var mongoose = require('mongoose');
var schema = require('./schema');

module.exports = {
    WorkOrder: mongoose.model('WorkOrder', schema.workOrderSchema),
    Worker: mongoose.model('Worker', schema.workerSchema),
    Facility: mongoose.model('Facility', schema.facilitySchema)
}