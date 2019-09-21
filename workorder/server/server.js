var path = require('path');
const cors = require('cors');

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

    optimization.selectOptimalWorker(workOrder)
        .then(candidate => {
            Worker.update({ phone_number: candidate.phone_number }, { queue: candidate.queue }, (err, doc) => {
                console.log(doc.n, doc.nModified)
            });
            // doc.save();
        })
        .catch(err => console.log(err));

    // this will eventually be replaced by the optimization algorithm
    // var optimal_worker = await Worker.findOne({ phone_number: optimization.selectOptimalWorker(workOrder) })
    // optimal_worker.queue.push(workOrder._id)
    // optimal_worker.save()

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
    console.log(req.body)
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
    console.log("number: " + number);
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
app.post('/update', (req, res) => {
    // fields sent
    // "phone_number" // phone number of technician
    // "field" // field to update
    // "action" // remove
    // "traveling": boolean

    const { phone_number, attribute, travl_boolean} = req.body;
    // // find technician in database
    var number = phone_number.substring(1);
    // var tech = Technician.find({
    //     phone_number: number
    // });

    // if updating traveling status
    if (attribute === "traveling") {
        Worker.update({ number }, { '$set': { traveling: travl_boolean } }, (err, doc) => {
            res.send('Updated traveling status to ' + travl_boolean);
        });
    }

    // if finished with a task, remove from queue
    else if (attribute === "queue") {
        // TODO: this is also where you text the creater of work order

        Worker.update({ number }, { '$pop': { queue: -1 } }, (err, doc) => {
            res.send('Completed task. Removed from queue.');
        });
    }

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