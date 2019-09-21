var mongoose = require('mongoose');
var schema = require('./schema');

module.exports = {
    Worker: mongoose.model('Worker', schema.workOrderSchema),
    Technician: mongoose.model('Technician', schema.technicianSchema)
}