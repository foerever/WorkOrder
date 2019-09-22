import React from 'react';
import '../App.css';
import {Button} from 'react-bootstrap';
import axios from 'axios';

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clear: false,
            erica: false
        }
    }

    onClear() {
        this.setState({clear:true})
        axios.post('http://localhost:8000/clear')
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