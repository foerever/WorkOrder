import React from 'react';
import '../App.css';
import { Form, Button, Card, Toast } from 'react-bootstrap';
import axios from 'axios';
import toastLogo from './chevron_toast_logo.png';
class OrderSubmissionForm extends React.Component {
    constructor(props) {
        super(props);
        this.form = {
            name: '',
            email: '',
            equipmentId: '',
            equipmentType: '',
            priority: 1,
            facilityId: '',
            completionTime: 0
        };
        this.state = {
            showToast: false
        };
    }
    onSubmit() {
        axios.post('http://localhost:8000/workorder_submission', {
            name: this.form.name,
            email: this.form.email,
            equipment_id: this.form.equipmentId,
            equipment_type: this.form.equipmentType,
            priority: this.form.priority,
            facility: this.form.facilityId,
            hours: this.form.completionTime
        });
        this.setShowToast(true);
    }
    handleChange = e => {
        this.form[e.target.name] = e.target.value;

        // this.setState({ [e.target.name]: e.target.value });
    }
    setShowToast = showToast => {
        this.setState({ showToast })
    }
    render() {
        return (
            <div style={{ textAlign: 'left', fontSize: '0.9em' }}>
                <Toast style={{ position: 'absolute', top: '0px', left: '0px', zIndex: 999 }} onClose={() => this.setShowToast(false)} show={this.state.showToast} delay={4000} autohide>
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded mr-2"
                            alt=""
                        />
                        <strong className="mr-auto">
                            <img style={{ height: '1em', width: '1em' }} src={toastLogo} alt="logo"></img> Thank you for your submission. </strong>
                        <small>0s ago</small>
                    </Toast.Header>
                    <Toast.Body>Our system will match your work order with a certified Chevron technician.</Toast.Body>
                </Toast>
                <Card>
                    <Card.Header>
                        <div>
                            <img src={toastLogo} alt="logo"
                                style={{ width: '1em', height: '1em', marginRight: '0.5em' }} /> Create New Work Order
                            </div>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                size="sm"
                                name='name'
                                onChange={this.handleChange}
                                placeholder="First and last name" />
                            <br />
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    size="sm"
                                    onChange={this.handleChange}
                                    name='email'
                                    type="email" placeholder="Enter email" />

                            </Form.Group>

                            <Form.Label>Equipment ID</Form.Label>
                            <Form.Control
                                size="sm"
                                onChange={this.handleChange}
                                name='equipmentId'
                                placeholder="Equipment ID" />
                            <br />

                            <Form.Label>Equipment Type</Form.Label>
                            <Form.Control
                                size="sm"
                                onChange={this.handleChange}
                                name='equipmentType'
                                placeholder="Equipment Type" />
                            <br />

                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Priority</Form.Label>
                                <Form.Control as="select"
                                    size="sm"
                                    name='priority'
                                    onChange={this.handleChange}
                                >
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Form.Control>
                            </Form.Group>


                            <Form.Label>Facility</Form.Label>
                            <Form.Control placeholder="Facility ID"
                                size="sm"
                                name='facilityId'
                                onChange={this.handleChange} />
                            <br />

                            <Form.Label>Completion Time</Form.Label>
                            <Form.Control placeholder="Completion Time"
                                size="sm"
                                name='completionTime'
                                onChange={this.handleChange} />
                            <br />

                            <Button variant="primary" onClick={click => this.onSubmit()}>
                                Submit
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>

            </div>
        )
    }
}

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