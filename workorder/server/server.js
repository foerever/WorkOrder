var path = require('path');
const cors = require('cors');

const accountSid = 'ACf8dbd03481d0f69325cee1a3284434d7';
const authToken = '359e4fd7c507e8fc06d6cb697f075c5d';
const client = require('twilio')(accountSid, authToken);

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

var models = require('./models.js');
var WorkOrder = models.WorkOrder;
var Worker = models.Worker;
var Facility = models.Facility;

var optimization = require('./optimize.js')
mongoose.connect(require('./connection.js'), { useFindAndModify: false });

//run middleware
app.use(cors());
// app.options('*', cors());

//parse inc requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// GETs
app.get('/workorders', (req, res) => {
    WorkOrder.find({
    }, function (err, doc) {
        res.status(200).send(doc);
    });
})

app.get('/workers', (req, res) => {
    Worker.find({
    }, function (err, doc) {
        res.json(doc)
    })
});

// TESTING ONLY
app.get('/nukeWorkers', (req, res) => {
    Worker.remove({ name: { '$ne': 'Erica' } })
        .then(doc => res.send('Nuked all workers except Erica.'))
});
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/', 'index.html'));
});

// app.get('/delete', (req, res) => {
//     Worker.remove({}).then(res.json({ message: "deleted everything" }));
// });

//  testing purposes only
app.post('/addWorkOrderToWorkerQueue', (req, res) => {
    const { phone_number, name, email, equipment_id, equipment_type, priority, facility, hours } = req.body;
    const workOrder = new WorkOrder({
        name, email, equipment_id, equipment_type, priority, facility, hours
    });
    Worker.update({ phone_number }, { '$push': { queue: workOrder } }, (err, doc) => {
        res.send('Push to queue success');
    });
});

// POSTS 
app.post('/workorder_submission', async function (req, res, next) {
    console.log("made it")
    var workOrder = new WorkOrder({
        name: req.body.name,
        email: req.body.email,
        equipment_id: req.body.equipment_id,
        equipment_type: req.body.equipment_type,
        priority: req.body.priority,
        facility: req.body.facility,
        hours: req.body.hours
    });
    workOrder.save();

    //  optimization code off until now so we don't dirty our data

    // optimization.selectOptimalWorker(workOrder)
    //     .then(candidate => {
    //         Worker.update({ phone_number: candidate.phone_number }, { queue: candidate.queue }, (err, doc) => {
    //             console.log(doc.n, doc.nModified)
    //         });
    //         // doc.save();
    //     })
    //     .catch(err => console.log(err));

    // this will eventually be replaced by the optimization algorithm
    // var optimal_worker = await Worker.findOne({ phone_number: optimization.selectOptimalWorker(workOrder) })
    // optimal_worker.queue.push(workOrder._id)
    // optimal_worker.save()

    var optimal_worker = await Worker.findOne({ phone_number: 19492957381 });

    console.log("optimal_worker: " + optimal_worker.name);
    optimal_worker.queue.push(workOrder._id)
    optimal_worker.save()

    client.studio.flows('FW4ade4ea937ce0a7524299a937d7fc440').executions
        .create({ to: '+' + optimal_worker.phone_number.toString(), from: '+14422640841',
            parameters: JSON.stringify({ id: workOrder._id, location: workOrder.facility,
                                                time: workOrder.hours
            })})
        .then(function(execution) { console.log(execution.sid); });

    // need to eventually find a different page for this to go to
    res.status(200).send("thanks for submitting a work order :)")
})

app.post('/worker_submission', function (req, res, next) {

    var workerSignUp = new Worker({
        name: req.body.name,
        phone_number: req.body.phone_number,
        certifications: req.body.certifications,
        shift: req.body.shift === 'AM' ? true : false,
        queue: [],
        traveling: false,
        hoursLeft: 0
    });
    console.log(workerSignUp.shift);

    workerSignUp.save()
    // console.log('saved!!');
    // likewise, need to find a different page for this to go to
    res.status(200).send("thanks for submitting a new technician form :)")
});

app.post('/addFacilities', (req, res) => {
    Facility.insertMany(req.body)
        .then(doc => { res.json(doc); })
        .catch(err => res.json(err));
});


app.get('/getFacilities', (req, res) => {
    Facility.find({}).then(doc => res.json(doc)).catch(err => console.log(err));
})

const getRandomNum = (min, max) => {

    return Math.floor(Math.random() * (max - min)) + min;
}
app.get('/deleteAllFacilities', (req, res) => {
    Facility.remove({}).then(res.send('Successfully deleted all facilities.'));

});
app.get('/populateFacilities/:num', (req, res) => {
    let generatedFacilities = [];
    // console.log(params);
    const { num } = req.params;
    for (let i = 0; i < num; i++) {
        generatedFacilities.push({
            facilityId: `Facility ${i + 1}`,
            location: {
                type: 'Point',
                coordinates: [getRandomNum(-94.1266, -106.4850), getRandomNum(27.8006, 33.9137)]
            }
        })
    }
    Facility.insertMany(generatedFacilities)
        .then(doc => { res.send(`Successfully generated ${num} facilities.`); })
        .catch(err => res.json(err));
});


app.get('/getWorkerMarkers', (req, ress) => {
    Facility.find({})
        .then(res => {
            const allFacilityIds = res.map(facility => facility.facilityId);
            // console.log(allFacilityIds, res);
            Worker.find({})
                .then(res2 => {
                    let markers = [];
                    // console.log(res2);
                    for (let worker of res2) {

                        if (worker.queue.length > 0) {
                            const curFacility = worker.queue[0];
                            // console.log(curFacility, allFacilityIds)
                            if (allFacilityIds.includes(curFacility.facility)) {
                                // console.log('hihihi')
                                let coordinates = res[allFacilityIds.indexOf(curFacility.facility)].location.coordinates;
                                //  offset so that the facility is still visible
                                coordinates[0] += 0.05;
                                coordinates[0] += 0.05;
                                coordinates.reverse();
                                markers.push({
                                    name: worker.name,
                                    traveling: worker.traveling,
                                    coordinates,
                                    curFacility: curFacility.facility
                                });
                            }
                        }
                    }
                    ress.json(markers);
                });
        });

});

app.post('/getFacilitiesInBox', (req, res) => {
    const { bottomLeft, upperRight } = req.body;
    // console.log(req.body)
    Facility.find({
        'location': {
            '$geoWithin': {
                '$box': [
                    bottomLeft,
                    upperRight
                ]
            }
        }
    }).then(doc => res.json(doc)).
        catch(err => console.log(err));
})

// functionally a get request to retrieve information about the technician's current status
app.post('/status', async function (req, res, next) {
    console.log("status hit");

    // find technician in database
    var number = req.body.phone_number.substring(1);

    var tech_after = (await Worker.findOne({ phone_number: number }));

    console.log("traveling? " + tech_after.traveling);
    console.log("next ticket: " + tech_after.queue[0]);
    console.log("num in the queue: " + tech_after.queue.length);
    res.status(200).send({ traveling: tech_after.traveling, num_queue: tech_after.queue.length, destination: tech_after.queue[0]})
});

// updates a technician's traveling status
app.post('/update',  async (req, res) => {

    console.log("update hit");
    const { phone_number, attribute, change, work_order_id } = req.body;
    console.log("phone number: " + phone_number + " attribute: " + attribute + " change" + change + " work_order_id: "
        + work_order_id
    );

    var number = phone_number.substring(1);

    // if updating traveling status
    if (attribute === "traveling") {
        var worker = await Worker.findOne({phone_number: number});
        worker.traveling = change;
        worker.save();
    }

    // modifications to the queue
    else if (attribute === "queue") {
        console.log("modifying queue");
        // declined request, remove by index
        if (change === true) {
            console.log("request declined, removing");
            console.log("work order id: " + work_order_id);
            var worker = await Worker.findOne({phone_number: number});
            // removes based on index of work_order
            var index = worker.queue.map(function(x) {return x._id; }).indexOf(work_order_id);

            console.log("index of work order: " + index);
            if (index !== -1) {
                var removed = worker.queue.splice(index, 1);
                var hrs = removed.hours ? removed.hours : 0;
                // decrement hours on this worker
                worker.hoursLeft -= hrs;
                worker.save();

                // TODO: function to reassign work order
            }
            // hacky do nothing if not found..but it shouldn't be not found anyways ¯\_(ツ)_/¯ just in case
        }
        // finished request, remove from front
        else if (change === false) {
            console.log("request finished, removing")
            // TODO: this is also where you text the creator of work order
            var worker = await Worker.findOne({phone_number: number});
            // removes from the front of the queue
            var removed = worker.queue.shift();
            var hrs = removed.hours ? removed.hours : 0;
            // decrement hours on this worker
            worker.hoursLeft -= hrs;
            worker.save();
        }

    }
    res.status(200).send("You updated the database!\n")
});

const port = process.env.PORT || 8000;

// remember to run webpack or this path wont find the files needed for the bundle
app.use(express.static(path.resolve(__dirname, '../public/')))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// server error handle
app.use(function (req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
})

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});