var mongoose = require('mongoose');
var server = require('../server');
var form = require('../../src/OrderSubmission/OrderSubmissionForm');

function degreesToRadians(degrees){
    return degrees * Math.PI / 180;
}

// Calculate the predicted drive time between two facilities
function getPredictedTime(lat1, lng1, lat2, lng2){
    // The radius of the planet earth in meters
    let radiusEarth = 6378137;
    let dLat = degreesToRadians(lat2 - lat1);
    let dLong = degreesToRadians(lng2 - lng1);
    let a = Math.pow(Math.sin(dLat / 2), 2) +
            Math.pow(Math.cos(degreesToRadians(lat1), 2)) + 
            Math.pow(Math.sin(dLong / 2), 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = radiusEarth * c;
    return distance / 30;
}

var insert_from_order = technician.find({phone_number}, function(err, doc) {
    if (err) {
        throw "error";
    } else {
        let curTime = new Date().getTime();
        doc.where(order.equipment_type).in('certifications').where(order.time + curTime > doc.shiftEnd && curTime < doc.shiftStart);
    }});

technician.find({phone_number : insert_from_order}, 'queue', function (err, doc) {
    if (err) {
        throw "error";
    } else {
        doc.push(order.id);
    }
});


for (order in workOrderSchema) {
    var person = db.findOne({technician}).where('order.equipment_type').in('technician.certifications').select(name);
    work_order_list.person.push(order);
}
