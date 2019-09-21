var mongoose = require('mongoose');

var workOrderSchema = mongoose.Schema({
    name: String,
    email: String,
    equipment_id: String,
    equipment_type: String,
    priority: Number,
    facility: String,
    hours: Number,
}, {
    timestamps: true
});

var workerSchema = mongoose.Schema({
    name: String,
    phone_number: Number,
    certifications: [String],
    shift: Boolean,
    queue: [workOrderSchema],
    traveling: Boolean,
    hoursLeft: Number
});

var facilitySchema = mongoose.Schema({
    facilityId: String,
    location: {
        type: { type: String },
        coordinates: []
    }
});
facilitySchema.index({ location: "2dsphere" });




module.exports = {
    workOrderSchema: workOrderSchema,
    workerSchema: workerSchema,
    facilitySchema
}

