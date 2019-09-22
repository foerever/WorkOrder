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
        res.status(200).send(doc)
    })
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

    var optimal_worker = await Worker.findOne({ phone_number: 19492957381});

    console.log("optimal_worker: " + optimal_worker);
    optimal_worker.queue.push(workOrder._id)
    optimal_worker.save()

    // client.studio.flows('FW4ade4ea937ce0a7524299a937d7fc440')
    //     .executions
    //     .list({
    //         dateCreatedFrom: new Date(Date.UTC(2019, 1, 17, 0, 0, 0)),
    //         dateCreatedTo: new Date(Date.UTC(2019, 1, 18, 0, 0, 0)),
    //         limit: 20
    //     })
    //     .then(executions => executions.forEach(e => console.log(e.sid)));

    client.studio.flows('FW4ade4ea937ce0a7524299a937d7fc440').executions
        .create({ to: '+' + optimal_worker.phone_number.toString(), from: '+14422640841',
            parameters: JSON.stringify({ id: workOrder._id, location: workOrder.facility,
                                                time: workOrder.hours.toString()})})
        .then(function(execution) { console.log(execution.sid); });

    // client.messages
    //     .create({
    //         body: ('ALERT: New Work Order: ' +  workOrder._id +  ' Location: ' + workOrder.facility
    //             + ' Time to complete: ' + workOrder.hours.toString() + ' Reply YES to accept, NO to decline. '),
    //         from: '+14422640841',
    //         to: '+' + optimal_worker.phone_number.toString()  // replace with user.number
    //     })
    //     .then(message => console.log(message.sid));

    // need to eventually find a different page for this to go to
    res.status(200).send("thanks for submitting a work order :)")
})

app.post('/worker_submission', function (req, res, next) {

    var workerSignUp = new Worker({
        name: req.body.name,
        phone_number: req.body.phone_number,
        certifications: req.body.certifications,
        shift: req.body.shift,
        queue: [],
        traveling: false,
        hoursLeft: 0
    });

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

// Technician has declined the work order, remove from their queue
app.post('/declined', (req, res) => {
    // find technician in database
    var number = req.body.number;
    var tech = Technician.find({
        phone_number: number
    });

    var dec_work_order = tech.queue.pop();

    // TODO: function to reassign work order
});

// functionally a get request to retrieve information about the technician's current status
app.post('/status', async function (req, res, next) {
    console.log("status hit");

    // find technician in database
    var number = req.body.phone_number.substring(1);

    // this one is to modify the database
    // this one is so u can see the contents or whatever u need to do
    // var tech_object = (await Worker.findOne({ phone_number: number }));
    // console.log(tech_object);
    // console.log("before: " + tech_object.traveling);
    // tech_object.traveling = false;
    //
    // const filter = { phone_number: number };
    // const update = { traveling: false };
    // let doc = await Worker.findOneAndUpdate(filter, update, {
    //     new: true // new specifies that 'doc' is the updated version
    // });

    var tech_after = (await Worker.findOne({ phone_number: number }));

    console.log("traveling? " + tech_after.traveling);
    console.log("next ticket: " + tech_after.queue[0]);
    res.status(200).send({ traveling: tech_after.traveling, destination: tech_after.queue[0]})
});

// updates a technician's traveling status
app.post('/update', async (req, res) => {

    console.log("update hit");
    const { phone_number, attribute, change } = req.body;
    console.log("phone number: " + phone_number + " attribute: " + attribute + " change" + change);

    var number = phone_number.substring(1);

    // if updating traveling status
    if (attribute === "traveling") {
        Worker.update({ number }, { '$set': { traveling: change } }, (err, doc) => {
            res.send('Updated traveling status to ' + change);
        });
    }

    // if finished with a task, remove from queue
    else if (attribute === "queue") {

        // declined request, remove from back
        if (change === true) {
            console.log("request declined, removing");

            var worker = await Worker.find({phone_number: number});
            worker.queue.pop();
            worker.save();
            // Worker.update({ number }, { '$pop': { queue: 1 } }, (err, doc) => {
            //     res.send('Declined task. Removed from queue.');
            // });
        }
        // finished request, remove from front
        else if (change === false) {
            console.log("request finished, removing")
            // TODO: this is also where you text the creator of work order
            Worker.update({ number }, { '$pop': { queue: -1 } }, (err, doc) => {
                res.send('Completed task. Removed from queue.');
            });
        }

    }

    var tech = Worker.find({
        phone_number: number
    });
    console.log("[AFTER UPDATING]" + "tech traveling" + tech.traveling + "tech queue: " + tech.queue);

    res.status(200)
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