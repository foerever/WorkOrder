var mongoose = require('mongoose');
var server = require('../server');
var form = require('../../src/OrderSubmission/OrderSubmissionForm');

var models = require('./models.js');
var WorkOrder = models.WorkOrder;
var Worker = models.Worker;

function degreesToRadians(degrees){
    return degrees * Math.PI / 180;
}

mongoose.connect(require('./connection.js'));

// Calculate the predicted drive time between two facilities
function getPredictedTime(lat1, lng1, lat2, lng2) {
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

// Find a Worker from the Worker schema that can take the order
const find_valid_workers = async (order) => {
    var valid_workers = await Worker.find({phone_number}, function(err, doc) {
        if (err) {
            throw "error";
        } else {
            let curTime = new Date().getTime();
            return doc.where(order.equipment_type).in('certifications')
            .where(order.time + curTime > doc.shiftEnd && curTime < doc.shiftStart);
        }});
    return valid_workers;
}

const find_phone_number = async (valid_workers) => {
    // To add the work order to the corresponding Worker from our last query in our database
    var phone_number = await Worker.find({phone_number : valid_workers}, 'queue', function(err, doc) {
        if (err) {
            throw "error";
        } else {
            doc.push(order.id);
        }
    });
}




// // Function that switches the latest order with the new order if priority of new order is higher && same fac
// // or new order is at least 3 higher && nearby fac (predicted traveling time less than 1 hour from current fac)
// var compare_priority = Worker.find() and where(order.facility == 


// When a new order is placed, find a person where the order meets certification requirement ∧ shift requirement ∧ is at most 1 hour drive away from facility of order:
// If newOrder.priority < person.queue[0].priority && newOrder.facility = person.current facility OR if person.queue[0].priority - newOrder.priority ≥ 3 &&  GetPredictedTime(NewOrder.facility.lat, long, Current facility.lat, long) < 1 hour:
// Append newOrder.id to head of person.queue
// Otherwise: 
// Append to end of person.queue 
