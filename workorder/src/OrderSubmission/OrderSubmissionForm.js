import React from 'react';
import '../App.css';
import { Form, Button } from 'react-bootstrap';

const OrderSubmissionForm = () => (
    <div>
        <div style={{ fontSize: '1.5em' }}>Create New Work Order</div>
        <br />
        <Form>
            <Form.Label>Name</Form.Label>
            <Form.Control placeholder="First and last name" />
            <br />
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />

            </Form.Group>
            <br />

            <Form.Label>Equipment ID</Form.Label>
            <Form.Control placeholder="Equipment ID" />
            <br />

            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Priority</Form.Label>
                <Form.Control as="select">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Form.Control>
            </Form.Group>

            <Form.Label>Equipment ID</Form.Label>
            <Form.Control placeholder="Equipment ID" />
            <br />

            <Form.Label>Facility</Form.Label>
            <Form.Control placeholder="Facility ID" />
            <br />

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    </div>
);
export default OrderSubmissionForm;

// var workOrderSchema = mongoose.Schema({
//     name: String,
//     email: String,
//     equipment_id: String,
//     equipment_type: String,
//     priority: Number,
//     facility: String
// });

// var technicianSchema = mongoose.Schema({
//     name: String,
//     phone_number: Number,
//     certifications: String,
//     shift: Boolean
// });