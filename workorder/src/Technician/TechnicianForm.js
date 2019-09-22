import React from 'react';
import '../App.css';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

class TechnicianForm extends React.Component {
    constructor(props) {
        super(props);
        this.allCerts = ['Sensor', 'Security', 'Networking', 'Pump', 'HVAC', 'Vehicle', 'Conveyor', 'Separator',
            'Compressor', 'Electricity'];
        this.certs = {};
        this.allCerts.forEach(cert => this.certs[`check-${cert}`] = false);
        this.form = {
            name: '',
            phone: '',
            certs: this.certs,
            shift: 'AM'
        };

    }
    handleChange = e => {
        //  store phone numbers as only digits
        if (e.target.name === 'phone') {
            this.form['phone'] = e.target.value.replace(/\D/g, '');
        }
        else if (e.target.name === 'certs') {
            this.form.certs[e.target.id] = !this.form.certs[e.target.id];
        } else {
            this.form[e.target.name] = e.target.value;
        }

    }
    onSubmit = () => {

        axios.post('http://localhost:8000/worker_submission', {
            name: this.form.name,
            phone_number: this.form.phone,
            certifications: this.allCerts.filter(cert => this.certs[`check-${cert}`] === true),
            shift: this.form.shift
        });
    }
    render() {
        return (<div style={{ textAlign: 'left', fontSize: '0.9em' }}>
            <Card>
                <Card.Header>
                    <div>Technician Registration</div>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            name='name'
                            onChange={this.handleChange}
                            placeholder="First and last name" />
                        <br />

                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            name='phone'
                            onChange={this.handleChange}
                            placeholder="000-000-0000" />
                        <br />

                        <Form.Label>Certifications</Form.Label>
                        <div className="mb-3">
                            {['Sensor', 'Security', 'Networking', 'Pump', 'HVAC', 'Vehicle', 'Conveyor', 'Separator',
                                'Compressor', 'Electricity'].map(cert => (
                                    <Form.Check key={cert} onChange={this.handleChange} inline label={cert} name="certs" id={`check-${cert}`} />
                                ))}
                        </div>



                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Preferred Shift</Form.Label>
                            <Form.Control as="select"
                                name='shift'
                                onChange={this.handleChange}
                            >
                                <option>AM</option>
                                <option>PM</option>
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" onClick={click => this.onSubmit()}>
                            Submit
            </Button>
                    </Form>
                </Card.Body>
            </Card>

        </div>
        );
    }
}
export default TechnicianForm;