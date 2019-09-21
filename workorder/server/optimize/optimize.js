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

// Find a technician from the technician schema that can take the order
var insert_from_order = technician.find({phone_number}, function(err, doc) {
    if (err) {
        throw "error";
    } else {
        let curTime = new Date().getTime();
        return doc.where(order.equipment_type).in('certifications')
        .where(order.time + curTime > doc.shiftEnd && curTime < doc.shiftStart);
    }});

// To add the work order to the corresponding technician from our last query in our database
technician.find({phone_number : insert_from_order}, 'queue', function(err, doc) {
    if (err) {
        throw "error";
    } else {
        doc.push(order.id);
    }
});

// Function that switches the latest order with the new order if priority of new order is higher && same fac
// or new order is at least 3 higher && nearby fac (predicted traveling time less than 1 hour from current fac)
var compare_priority = technician.find() and where(order.facility == 