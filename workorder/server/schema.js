var mongoose = require('mongoose');

var workOrderSchema = mongoose.Schema({
    name: String,
    email: String,
    equipment_id: String,
    equipment_type: String,
    priority: Number,
    facility: String,
});

var workerSchema = mongoose.Schema({
    name: String,
    phone_number: Number,
    certifications: [String],
    shift: Boolean
});

module.exports = {
    workOrderSchema: workOrderSchema,
    workerSchema: workerSchema,
}

