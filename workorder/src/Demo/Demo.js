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
            workers: false,
            workorders: false,
            facility: false
        }
    }

    onClear() {
        this.setState({clear:true})
        axios.post('http://localhost:8000/clear')
    }

    clearDB(db) {
        this.setState({workers:true})
        axios.post('http://localhost:8000/clearDB', {input: db})
    }

    addErica() {
        this.setState({erica:true})
        axios.post('http://localhost:8000/addErica')
    }

    render() {
        return (
            <div>
                <h1>DEMO</h1>
                <h2>Clear DB</h2>
                <Button variant="dark" disabled={this.state.clear} onClick={click => this.onClear()}>
                    Clear DB
                </Button>

                <Button variant="dark" disabled={this.state.workers} onClick={click => this.clearDB(0)}>
                    Clear Workers DB
                </Button>

                <Button variant="dark" disabled={this.state.workorders} onClick={click => this.clearDB(1)}>
                    Clear WorkOrder DB
                </Button>

                <Button variant="dark" disabled={this.state.facility} onClick={click => this.clearDB(2)}>
                    Clear Facility DB
                </Button>

                
                <h2>Add sample data</h2>

                <h2>Simple Tests</h2>
                <Button variant="dark" disabled={this.state.erica} onClick={click => this.addErica()}>
                    Add Erica
                </Button>
            </div>
        )
    }

}

export default Demo;