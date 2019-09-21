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

mongoose.connect(require('./connection.js'));

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


// POSTS 
app.post('/workorder_submission', async function (req, res, next) {

    var workOrder = new WorkOrder({
        name: req.body.name,
        email: req.body.email,
        equipment_id: req.body.equipment_id,
        equipment_type: req.body.equipment_type,
        priority: req.body.priority,
        facility: req.body.facility
    });

    workOrder.save()

    // this will eventually be replaced by the optimization algorithm
    var optimal_worker = await Worker.findOne({ phone_number: optimization.selectOptimalWorker(workOrder) })
    optimal_worker.queue.push(workOrder._id)
    optimal_worker.save()

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
    var number = req.body.phone_number;
    console.log("number: " + number.substring(1));
    // this one is to modify the database

    // this one is so u can see the contents or whatever u need to do
    var tech_object = (await Worker.findOne({ phone_number: number.substring(1) }))[0].toObject();
    console.log(tech_object);
    // unfortunately to save the object we need to refetch it again for now | temporary fix
    var tech_cursor = await Worker.findOne({ phone_number: number.substring(1) })
    tech_cursor.traveling = true;
    tech_cursor.save();

    // find technician's first work order
    // var first_work_order = tech.queue[0];
    // console.log("first_work_order:" + first_work_order);
    // var t = tech.traveling;

    res.status(200).send({ "traveling": "yes" })
});

// updates a technician's traveling status
app.post('/update', (req, res) => {
    // fields sent
    // "phone_number" // phone number of technician
    // "field" // field to update
    // "action" // remove
    // "traveling": boolean

    // find technician in database
    var number = req.body.number;
    var tech = Technician.find({
        phone_number: number
    });

    console.log(tech);

    tech.save();
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