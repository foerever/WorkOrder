import React from 'react';
import '../App.css';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';

class Metrics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            barChartLabels: [],
            barChartValues: [],
            lineChartCoords: [],
            lineChartX: []
        }
    }

    componentWillMount() {

        axios.get('http://localhost:8000/workers')
            .then(res => {
                // build the array for the bar chart data
                var barChartLabels = []
                var barChartValues = []
                for (let worker of res.data) {
                    barChartLabels.push(worker.name)
                    barChartValues.push(worker.queue.length)
                }
                this.setState({barChartLabels, barChartValues})
            })
            .catch(function(error) {
                console.log(error)
            })

        axios.get('http://localhost:8000/workorders')
            .then(res => {
                // build the array for the line chart data
                var lineChartCoords = []
                var x_axis = new Set()
                for (let workorder of res.data) {
                    var d = new Date(workorder.createdAt);
                    lineChartCoords.push({x:d, y:d.getHours()})
                    x_axis.add(d)
                }
                var lineChartX = Array.from(x_axis)
                console.log(lineChartCoords)
                this.setState({lineChartCoords, lineChartX})

            })
            .catch(function(error) {
                console.log(error)
            })
    }

    render() {
        var barChartData = {
            labels: this.state.barChartLabels,
            datasets: [{
                label: "Queue Length per Technician",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: this.state.barChartValues
            }]
        }

        var lineChartData = {
            labels: this.state.lineChartX,
            datasets: [{
                label: "Work Order Requests per Hour",
                data: this.state.lineChartCoords
            }]
        }

        var barStyle = {
            width: 800
        }

        return (
            <div>
                <div style={barStyle}><Bar data={barChartData}/></div>
                <Line data={lineChartData}/>
            </div>
        );
    }
}
export default Metrics;