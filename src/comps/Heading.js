import React from 'react'

import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from 'store/authSlice'

import { Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { Row, Figure } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'

function Heading(props) {
    let { title, btnLogout, backButton, btnProfile } = props

    let dispatch = useDispatch()
    let history = useHistory()
    const isMobile = useMediaQuery({ query: '(max-width: 576px)' })
    let { user: authUser, isAuthenticated } = useSelector(state => state.auth)
    let [btnTxt, setBtnTxt] = React.useState("Don't click")
    if (backButton)
        backButton = (<button
            onClick={() => { isAuthenticated ? history.goBack() : history.push('/') }}
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
    if (btnProfile && isAuthenticated)
        btnProfile = (
            <Link
                className="d-flex align-items-end"
                to={`/user/${authUser.screen_name}`}
            >
                <Figure
                    className="bg-border-color rounded-circle overflow-hidden my-auto ml-2"
                    style={{ height: "35px", width: "35px" }}
                >
                    <Figure.Image
                        src={(authUser.default_profile_image) ? '/img/default-profile-vector.svg' : authUser.profile_image_url_https}
                        className="w-100 h-100"
                    />
                </Figure>
            </Link>
        )
    return (
        <div className="d-flex justify-content-between border-bottom sticky-top bg-white align-items-center">
            <Row className="d-flex align-items-center">
                {backButton}
                {isMobile && btnProfile}
                <h5 className="my-3 mx-2 font-weight-bold">{title}</h5>
            </Row>
            {btnLogout}
        </div>
    )
}
export default Heading