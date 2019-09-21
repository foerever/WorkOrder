var mongoose = require('mongoose');
var models = require('./models.js');
var WorkOrder = models.WorkOrder;
var Worker = models.Worker;
var Facility = models.Facility;

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

mongoose.connect(require('./connection.js'));

// Query the facility table to get facility of a given work order
// Return target_facility cursor with latitude and longitude info
const find_fac = async (order) => {
    var target_facility = await Facility.find({ facilityId: order.facilityId }, function (err, doc) {
        if (err) {
            throw "error";
        } else {
            return doc.where('name').equals(order.facilityId);
        }
    });
    return target_facility;
}

// Calculate the predicted drive time between two facilities assuming avg driving speed is 30km/h
// parameter: the two facility cursors queried from facility table
// Returns hours of drive time between two facilities
const getPredictedTime = (target_facility1, target_facility2) => {

    //  ERROR: queue is empty
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
    return distance / 30;
}

// Find a Worker from the Worker schema that can take the order
const find_valid_workers = async (order) => {
    // console.log("\n\n\n\n ORDER: ", order.name);
    let curTime = new Date().getTime();
    // const temp = order.equipment_type;
    var valid_workers = await Worker.find({}, function (err, doc) {
        if (err) {
            throw "error";
        } else {


            // 6 - 12
            // 12 - 18
            let curHour = new Date().getHours();

            doc = doc.filter(worker => {
                const shiftEnd = worker.shift === 'AM' ? 12 : 18;
                const shiftStart = worker.shift === 'AM' ? 6 : 12;
                // console.log(worker)
                return worker.certifications.includes(order.equipment_type) && order.hours + curHour < shiftEnd &&
                    curTime > shiftStart;
            });

        }
    })
    return valid_workers;
    // .where(order.equipment_type).in('certifications')
    // .where(hoursToMs(order.hours) + curTime > doc.shiftEnd && curTime < doc.shiftStart);
    // return valid_workers;
}

// // Function that switches the latest order with the new order if priority of new order is higher && same fac
// // or new order is at least 3 higher && nearby fac (predicted traveling time less than 1 hour from current fac)
// var compare_priority = Worker.find() and where(order.facility == 

// If newOrder.priority < person.queue[0].priority && newOrder.facility = person.current facility OR if person.queue[0].priority - newOrder.priority ≥ 3 &&  GetPredictedTime(NewOrder.facility.lat, long, Current facility.lat, long) < 1 hour:
// Append newOrder.id to head of person.queue
// Otherwise: 
// Append to end of person.queue 


module.exports = {
    selectOptimalWorker: function (workOrder) {
        return find_valid_workers(workOrder)
            .then(validWorkers => {
                let hours = 0;
                // console.log('validWorkers ', validWorkers);
                let candidate = validWorkers[0];

                for (let person of validWorkers) {
                    // console.log("queue: ", person.queue);
                    // console.log("workOrder: ", workOrder)
                    if (person.queue.length === 0) {
                        candidate = person;
                        break;
                    } else {
                        find_fac(person.queue[0])
                            .then(res1 => {
                                find_fac(workOrder)
                                    .then(res2 => {
                                        if (getPredictedTime(res1, res2) < 1) {
                                            // Look for person with the maximum hours Left
                                            if (hours < person.hoursLeft) {
                                                hours = person.hoursLeft
                                                candidate = person;
                                            }
                                        }
                                    });
                            });
                        // console.log('PERESON: ', person);
                        // Check to see if predicted drive time between current and order facility exceeds one hour
                        if (getPredictedTime(find_fac(person.queue[0]), find_fac(workOrder)) < 1) {
                            // Look for person with the maximum hours Left
                            if (hours < person.hoursLeft) {
                                hours = person.hoursLeft
                                candidate = person;
                            }
                        }
                    }

                }
                // console.log("RETURNING CANDIDATE: ", candidate);
                // console.log("PUSHING WORKORDER: ", workOrder);
                candidate.queue.push(workOrder);
                candidate.traveling ? candidate.queue.sort((a, b) => { return a.priority - b.priority }) :
                    candidate.queue.slice(1).sort((a, b) => { return a.priority - b.priority });
                return candidate;
            })
            .catch(err => console.log(err));

    },

    // sortAddOrder: async function (candidate, workOrder) {
    //     console.log("CANDIATE: ", candidate);
    //     candidate.then(res => {
    //         console.log("RES ", res);
    //         res.queue.push(workOrder);
    //         res.traveling ? candidate.queue.sort((a, b) => { return a.priority - b.priority }) :
    //             res.queue.slice(1).sort((a, b) => { return a.priority - b.priority });
    //         return res;
    //     }
    // ).catch(err => console.log(err));
    // candidate.queue.push(workOrder);
    // candidate.traveling ? candidate.queue.sort((a, b) => { return a.priority - b.priority }) :
    //     candidate.queue.slice(1).sort((a, b) => { return a.priority - b.priority });
    // return candidate.phone_number;
    // }
};