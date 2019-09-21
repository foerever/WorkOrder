import React from 'react';
import '../App.css';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
class OrderSubmissionForm extends React.Component {
    constructor(props) {
        super(props);
        this.form = {
            name: '',
            email: '',
            equipmentId: '',
            equipmentType: '',
            priority: 1,
            facilityId: ''
        };
    }
    onSubmit() {
        axios.post('http://localhost:8000/workorder_submission', {
            name: this.form.name,
            email: this.form.email,
            equipment_id: this.form.equipmentId,
            equipment_type: this.form.equipmentType,
            priority: this.form.priority,
            facility: this.form.facilityId
        });
    }
    handleChange = e => {
        this.form[e.target.name] = e.target.value;

        // this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        return (
            <div style={{ textAlign: 'left', fontSize: '0.9em' }}>
                <Card>
                    <Card.Header>
                        <div >Create New Work Order</div>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                name='name'
                                onChange={this.handleChange}
                                placeholder="First and last name" />
                            <br />
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    onChange={this.handleChange}
                                    name='email'
                                    type="email" placeholder="Enter email" />

                            </Form.Group>
                            {/* <br /> */}

                            <Form.Label>Equipment ID</Form.Label>
                            <Form.Control
                                onChange={this.handleChange}
                                name='equipmentId'
                                placeholder="Equipment ID" />
                            <br />

                            <Form.Label>Equipment Type</Form.Label>
                            <Form.Control
                                onChange={this.handleChange}
                                name='equipmentType'
                                placeholder="Equipment Type" />
                            <br />

                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Priority</Form.Label>
                                <Form.Control as="select"
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
                                name='facilityId'
                                onChange={this.handleChange} />
                            <br />

                            <Button variant="primary" type="submit" onClick={click => this.onSubmit()}>
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