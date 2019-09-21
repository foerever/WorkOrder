import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

var workOrderSchema = mongoose.Schema({
    name: String,
    email: String,
    equipment_id: String,
    equipment_type: String,
    priority: Number,
    facility: String
});

var technicianSchema = mongoose.Schema({
    name: String,
    phone_number: Number,
    certifications: String,
    shift: Boolean
});