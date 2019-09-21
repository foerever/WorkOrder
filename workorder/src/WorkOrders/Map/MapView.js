import React from 'react';
import '../../App.css';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import axios from 'axios';
import L from 'leaflet'
// import facilityMarker from './resources/facility_marker.png';
// import 'leaflet/dist/leaflet.css';

let icon = L.icon({
    iconRetinaUrl: require('./resources/facility_marker.png'),
    iconUrl: require('./resources/facility_marker.png'),
    shadowUrl: require('./resources/facility_marker.png')
})
class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.map = undefined;
        this.state = {
            facilities: []
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
        });

    }
    render() {
        return (<div>
            <Map ref={(ref) => { this.map = ref; }} style={{ height: '90vh', width: '100%' }} center={[29.749907, -95.358421]} zoom={13}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {this.state.facilities.map(facility => {
                    let coordinates = facility.location.coordinates;
                    coordinates.reverse();
                    return (<Marker
                        icon={icon}
                        position={coordinates} >
                        <Popup>Facility ID: <br />{facility.facilityId}</Popup>
                    </Marker>);
                })}
            </Map>

        </div>);
    }
}


export default MapView;