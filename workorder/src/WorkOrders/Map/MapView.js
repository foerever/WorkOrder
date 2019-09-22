import React from 'react';
import '../../App.css';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import axios from 'axios';
import L from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster';

// import facilityMarker from './resources/facility_marker.png';
// import 'leaflet/dist/leaflet.css';

let facilityIcon = L.icon({
    iconRetinaUrl: require('./resources/facility_marker.png'),
    iconUrl: require('./resources/facility_marker.png'),
    shadowUrl: require('./resources/facility_marker.png')
});
let technicianIconFixing = L.icon({
    iconRetinaUrl: require('./resources/technician_marker_fixing.png'),
    iconUrl: require('./resources/technician_marker_fixing.png'),
    shadowUrl: require('./resources/technician_marker_fixing.png')
});

let technicianIconTraveling = L.icon({
    iconRetinaUrl: require('./resources/technician_marker_traveling.png'),
    iconUrl: require('./resources/technician_marker_traveling.png'),
    shadowUrl: require('./resources/technician_marker_traveling.png')
})
class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.map = undefined;
        this.state = {
            facilities: [],
            workerMarkers: []
        };
    }
    componentDidMount() {
        // console.log(this.map)
        this.map.leafletElement.on('moveend', () => {
            // const {}
            const bounds = this.map.leafletElement.getBounds();
            const bottomLeft = [bounds['_southWest'].lng, bounds['_southWest'].lat].map(x => Number(x));
            const upperRight = [bounds['_northEast'].lng, bounds['_northEast'].lat].map(x => Number(x));
            axios.post('http://localhost:8000/getFacilitiesInBox', { bottomLeft, upperRight })
                .then(res => this.setState({ facilities: res.data }));
            axios.get('http://localhost:8000/getWorkerMarkers')
                .then(res => { this.setState({ workerMarkers: res.data }) });
        });
    }
    render() {
        return (
            <div>
                <Map ref={(ref) => { this.map = ref; }} style={{ height: '90vh', width: '100%' }}
                    center={[29.749907, -95.358421]} zoom={10}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MarkerClusterGroup
                        disableClusteringAtZoom={9}
                        spiderfyOnMaxZoom={false}>
                        {this.state.facilities.map(facility => {
                            let coordinates = facility.location.coordinates;
                            coordinates.reverse();
                            console.log(facility.facilityId)
                            return (
                                <Marker
                                    icon={facilityIcon}
                                    position={coordinates}
                                    key={facility.facilityId}>
                                    <Popup><div>Facility ID: <br />{facility.facilityId}</div></Popup>
                                </Marker>);
                        }).concat(this.state.workerMarkers.map(worker => {
                            return (
                                <Marker
                                    key={worker.name}
                                    icon={worker.traveling ? technicianIconTraveling : technicianIconFixing}
                                    position={worker.coordinates} >
                                    <Popup><div>Worker Name: <br />{worker.name}</div></Popup>
                                </Marker>)
                        }))}
                    </MarkerClusterGroup>
                </Map>

            </div>);
    }
}


export default MapView;