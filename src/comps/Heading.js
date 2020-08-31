import React from 'react'

import { useHistory } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { logout } from 'store/authSlice'
import { Row } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'

function Heading(props) {
    let dispatch = useDispatch()
    let history = useHistory()
    let { title, btnLogout, backButton } = props;
    let [btnTxt, setBtnTxt] = React.useState("Don't click")
    if (backButton)
        backButton = (<button
            onClick={() => { history.goBack() }}
            className="ml-2 btn btn-naked-primary rounded-circle text-primary">
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>)
    if (btnLogout)
        btnLogout = (<button onClick={() => { dispatch(logout()) }}
            onMouseEnter={() => { setBtnTxt("Bola naa yaar") }}
            onMouseLeave={() => { setBtnTxt("Never click it") }}
            className="btn btn-outline-primary rounded-pill px-2 py-1 mr-2 font-weight-bold"
        >{btnTxt}
        </button>)
    return (
        <div className="d-flex justify-content-between border-bottom sticky-top bg-white align-items-center">
            <Row className="d-flex align-items-center">
                {backButton}
                <h5 className="m-3 font-weight-bold">{title}</h5>
            </Row>
            {btnLogout}
        </div>
    )
}
export default Heading