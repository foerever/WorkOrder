import React from 'react';
import '../../App.css';
import { Map, TileLayer } from 'react-leaflet'

// import 'leaflet/dist/leaflet.css';

const MapView = () => (
    <div>
        <Map style={{ height: '90vh', width: '100%' }} center={[29.749907, -95.358421]} zoom={13}>
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </Map>

    </div>
);

export default MapView;