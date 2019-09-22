var mongoose = require('mongoose');
var models = require('./models.js');
var WorkOrder = models.WorkOrder;
var Worker = models.Worker;
var Facility = models.Facility;
var mathjs = require('mathjs');

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

mongoose.connect(require('./connection.js'));

// Query the facility table to get facility of a given work order
// Return target_facility cursor with latitude and longitude info
const find_fac = async (order) => {
    var target_facility = await Facility.find({ facilityId: order.facility }, function (err, doc) {
        if (err) {
            throw "error";
        } else {
            return doc;
        }
    }).where('name').equals(order.facility);
    return target_facility;
}

// Calculate the predicted drive time between two facilities assuming avg driving speed is 30km/h
// parameter: the two facility cursors queried from facility table
// Returns hours of drive time between two facilities
const getDirectDistance = (target_facility1, target_facility2) => {

    //  ERROR: queue is empty, no facility
    if (target_facility1 === 0) {
        return 0;
    }

    lat1 = target_facility1.latitude;
    lat2 = target_facility2.latitude;
    lng1 = target_facility1.longitude;
    lng2 = target_facility2.longitude;

    // The radius of the planet earth in kilometers
    let radiusEarth = 6378.137;
    let dLat = degreesToRadians(lat2 - lat1);
    let dLong = degreesToRadians(lng2 - lng1);
    let a = Math.pow(Math.sin(dLat / 2), 2) +
        Math.pow(Math.cos(degreesToRadians(lat1), 2)) +
        Math.pow(Math.sin(dLong / 2), 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = radiusEarth * c;
    return distance;
}

// Find a Worker from the Worker schema that can take the order
const find_valid_workers = async (order) => {
    // console.log("\n\n\n\n ORDER: ", order.name);
    // const temp = order.equipment_type;
    var valid_workers = await Worker.find({}, function (err, doc) {
        if (err) {
            throw "error";
        } else {
            // 6 - 12
            // 12 - 18
            // console.log("doc", doc);
            return doc;
        }
    });
    
    return valid_workers.map(x => x).filter(worker => {
        return worker.certifications.includes(order.equipment_type);
    });
}

// // Function that switches the latest order with the new order if priority of new order is higher && same fac
// // or new order is at least 3 higher && nearby fac (predicted traveling time less than 1 hour from current fac)
// var compare_priority = Worker.find() and where(order.facility == 

// If newOrder.priority < person.queue[0].priority && newOrder.facility = person.current facility OR if person.queue[0].priority - newOrder.priority ≥ 3 &&  GetPredictedTime(NewOrder.facility.lat, long, Current facility.lat, long) < 1 hour:
// Append newOrder.id to head of person.queue
// Otherwise: 
// Append to end of person.queue 


module.exports = {
    selectOptimalWorker: async function (workOrder) {
        return find_valid_workers(workOrder)
            .then(validWorkers => {
                // Assuming there is at least one valid worker.
                let candidate = validWorkers[0];
                
                // We are optimizing by summing the z-score of two important attributes: 
                // location between each technician and the facility where the new order is, 
                // and the number of hours left before the end of each technician's shift.
                console.log("validWorkers: ", validWorkers[0].queue);

                let distance_list = validWorkers.map(x => 
                    (x.queue.length === 0 ? 0 : find_fac(x.queue[0])))
                    .map(x => getDirectDistance(x, find_fac(workOrder)));
                console.log("distance_list: ", distance_list);

                let mean_dist = mathjs.mean(distance_list);
                let stdev_dist = mathjs.std(distance_list);
                let z_score_dist;
                if (stdev_dist === 0) {
                    z_score_dist = distance_list.map(x => 0);
                } else {
                    z_score_dist = distance_list.map(x => (x - mean_dist) / stdev_dist);
                }
                console.log("z_score_dist: ", z_score_dist);

                let hour_list = validWorkers.map(x => x.hoursLeft);
                console.log("hour_list: ", hour_list);
                let mean_hour = mathjs.mean(hour_list);
                let stdev_hour = mathjs.std(hour_list);
                let z_score_hour = hour_list.map(x => (x - mean_hour) / stdev_hour);

                let z_score_list = z_score_dist.map((a, idx) => a + z_score_hour[idx]);
                
                let index_min = z_score_list.indexOf(Math.min(z_score_list));
                console.log(index_min);
                if (index_min >= 0) {
                    candidate = validWorkers[index_min];
                }
                console.log("candidate ", candidate);
                
                // console.log("RETURNING CANDIDATE: ", candidate);
                // console.log("PUSHING WORKORDER: ", workOrder);
                candidate.queue.push(workOrder);
                console.log("first i get here")
                candidate.hoursLeft += workOrder.hours;

                // console.log("i get here")
                var first_id = candidate.queue[0]._id
                // console.log(first)
                // var something = candidate.queue.slice(1)
                // console.log(something)
                candidate.queue.sort((a, b) => { return a._id === first_id ? 1 : a.priority - b.priority })
                // console.log(something)

                // something.push(first)
                // console.log("i got here!")
                // candidate.queue = (
                //     candidate.queue.length > 1 
                //     ? something
                //     : candidate.queue
                // );
                console.log("i also get here")
                return candidate;
            })
            .catch(err => console.log(err));
        }
    }