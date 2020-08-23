import React from 'react'
import { Spinner, Col } from 'react-bootstrap'

export default function (color) {
    return (
        <Col className="d-flex justify-content-center py-5">
            <Spinner variant="primary" animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </Col>
    )
}