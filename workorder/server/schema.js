var mongoose = require('mongoose');

var workOrderSchema = mongoose.Schema({
    name: {type:String, default:"default name"},
    email: {type:String, default:"default@email.com"},
    equipment_id: {type:String, default:"default equipment id"},
    equipment_type: {type: String, default:"default equipment type"},
    priority: {type:Number, default:11111111111},
    facility: {type:String, default:"default facility"},
    hours: {type:Number, default:0},
}, {
    timestamps: true
});

var workerSchema = mongoose.Schema({
    name: {type:String, default:"default name"},
    phone_number: {type:Number, default:11111111111},
    certifications: {type:[String],default:["Default Certification"]},
    shift: {type:Boolean, default:false},
    queue: {type:[workOrderSchema], default:[]},
    state: {type:Number, default:0},
    hoursLeft: {type:Number, default:0}
});

var facilitySchema = mongoose.Schema({
    facilityId: {type:String,default:"default facility id"},
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

