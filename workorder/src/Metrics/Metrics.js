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
            lineChartDataSets: []
        }
    }

    componentWillMount() {

        function random_rgba() {
            var o = Math.round, r = Math.random, s = 255;
            return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
        }

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
                var equipmentDict = {};
                for (let workorder of res.data) {
                    var d = new Date(workorder.createdAt);
                    var hour = d.getHours();

                    var timeStamp = Math.round(new Date().getTime() / 1000);
                    var timeStampYesterday = timeStamp - (24 * 3600);
                    
                    // only consider work orders for the past 24 hours
                    if (d >= new Date(timeStampYesterday*1000).getTime()) {
                        // create a mapping of equipment types to frequency of use per hour
                        // for the past 24 hours
                        if (workorder.equipment_type in equipmentDict) {
                            if (hour in equipmentDict[workorder.equipment_type]) {
                                equipmentDict[workorder.equipment_type][hour] += 1
                            } else {
                                equipmentDict[workorder.equipment_type][hour] = 1
                            }
                        } else {
                            var new_dict = {}
                            new_dict[hour] = 1
                            equipmentDict[workorder.equipment_type] = new_dict
                        }
                    }
                }
                var lineChartDataSets = []
                for (const [key, value] of Object.entries(equipmentDict)) {
                    var dataSet = {
                        label:key,
                        data:[],
                        borderColor: random_rgba()
                    }
                    for (var i = 1; i < 25; i++) {
                        if (i in value) {
                            dataSet.data.push(value[i]);
                        } else {
                            dataSet.data.push(0);
                        }
                    }
                    lineChartDataSets.push(dataSet);
                }
                this.setState({lineChartDataSets})

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
            labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
            datasets: this.state.lineChartDataSets
        }

        var barStyle = {
            width: 800
        }

        return (
            <div>
                <div style={barStyle}>
                    <h2>Hourly Frequency of Work Order per Equipment Type</h2>
                    <Line data={lineChartData}/>
                </div>

                <div style={barStyle}>
                    <h2>Queue Length per Technician</h2>
                    <Bar data={barChartData}/>
                </div>
            </div>
        );
    }
}
export default Metrics;