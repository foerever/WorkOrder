import React from 'react';
import './App.css';
import MapView from './OrderSubmission/Map/MapView'
import OrderSubmissionForm from './OrderSubmission/OrderSubmissionForm';
import { Container, Row, Col } from 'react-bootstrap'

const OrderSubmission = () => (
    <div>
        <Container>
            <Row>
                <Col xs={3}><OrderSubmissionForm /></Col>
                <Col xs={9}><MapView /></Col>
            </Row>
        </Container>
    </div>
);

export default OrderSubmission;