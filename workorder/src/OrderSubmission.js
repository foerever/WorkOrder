import React from 'react';
import './App.css';
import MapView from './WorkOrders/Map/MapView'
import OrderSubmissionForm from './WorkOrders/OrderSubmissionForm';
import { Container, Row, Col } from 'react-bootstrap'

const WorkOrders = () => (
    <div>
        <Container>
            <Row>
                <Col xs={4} > <OrderSubmissionForm /></Col>
                <Col xs={8}><MapView /></Col>
            </Row>
        </Container>

    </div>
);

export default WorkOrders;