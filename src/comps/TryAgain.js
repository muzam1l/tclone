import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons/faRedo'
import { Col } from 'react-bootstrap'

function TryAgain(props) {
    return (
        <>
            <Col className="d-flex flex-column align-items-center py-3">
                <h6 className="text-muted mb-3">{props.message || 'Something went wrong'}</h6>
                <button
                    className="btn btn-primary rounded-pill font-weight-bold d-flex align-items-center px-3"
                    onClick={props.fn}
                >
                    <FontAwesomeIcon className="mr-2" icon={faRedo} />
                    <span>Try again</span>
                </button>
            </Col>
        </>

    )
}
export default TryAgain;