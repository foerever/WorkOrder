import React from 'react';
import '../App.css';
import {Button} from 'react-bootstrap';
import axios from 'axios';

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clear: false,
            erica: false,
            anthony: false,
            workers: false,
            workorders: false,
            facility: false,
            sample: false,
            sample_workers: false,
            sample_work_order: false,
            sample_facilities: false
        }
    }

    onClear() {
        this.setState({clear:true})
        axios.post('http://localhost:8000/clear')
    }

    clearDB(db) {
        if (db === 0) {
            this.setState({workers:true});
        } else if (db === 1) {
            this.setState({workorders:true});
        } else if (db === 2) {
            this.setState({facility:true});
        }
        axios.post('http://localhost:8000/clearDB', {input: db})
    }

    addErica() {
        this.setState({erica:true})
        axios.post('http://localhost:8000/addErica')
    }

    addAnthony() {
        this.setState({anthony:true})
        axios.post('http://localhost:8000/addAnthony')
    }

    addRandom() {
        axios.post('http://localhost:8000/addRandomWorkOrder')
    }

    addSampleData(db) {
        if (db === 3) {
            this.setState({sample:true});
        } else if (db === 0) {
            this.setState({sample_workers: true});
        } else if (db === 1) {
            this.setState({sample_work_order: true});
        } else if (db === 2) {
            this.setState({sample_facilities: true});
        }
        axios.post('http://localhost:8000/addSampleData', {type: db})
    }

    render() {

        var spaceStyle = {
            marginLeft: 20
        }

        return (
            <div>
                <h1>DEMO</h1>
                <h2>Clear DB</h2>
                <Button style={spaceStyle} variant="dark" disabled={this.state.clear} onClick={click => this.onClear()}>
                    Clear DB
                </Button>

                <Button style={spaceStyle} variant="dark" disabled={this.state.workers} onClick={click => this.clearDB(0)}>
                    Clear Workers DB
                </Button>

                <Button style={spaceStyle} variant="dark" disabled={this.state.workorders} onClick={click => this.clearDB(1)}>
                    Clear WorkOrder DB
                </Button>

                <Button style={spaceStyle} variant="dark" disabled={this.state.facility} onClick={click => this.clearDB(2)}>
                    Clear Facility DB
                </Button>

                <h2>Add sample data</h2>
                <Button style={spaceStyle} variant="dark" disabled={this.state.sample} onClick={click => this.addSampleData(3)}>
                    Add All Sample Data
                </Button>

                <Button style={spaceStyle} variant="dark" disabled={this.state.sample_workers} onClick={click => this.addSampleData(0)}>
                    Add Sample Workers
                </Button>

                <Button style={spaceStyle} variant="dark" disabled={this.state.sample_work_order} onClick={click => this.addSampleData(1)}>
                    Add Sample Work Orders
                </Button>

                <Button style={spaceStyle} variant="dark" disabled={this.state.sample_facilities} onClick={click => this.addSampleData(2)}>
                    Add Sample Facilities
                </Button>

                <h2>Simple Tests</h2>
                <Button style={spaceStyle} variant="dark" disabled={this.state.erica} onClick={click => this.addErica()}>
                    Add Erica
                </Button>

                <Button style={spaceStyle} variant="dark" disabled={this.state.anthony} onClick={click => this.addAnthony()}>
                    Add Anthony
                </Button>

                <Button style={spaceStyle} variant="dark" onClick={click => this.addRandom()}>
                    Add Random Work Order
                </Button>
            </div>
        )
    }

}

export default Demo;