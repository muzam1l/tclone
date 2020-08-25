import React from 'react'
// import { useAuth } from 'utils/context/auth'
import { useDispatch } from 'react-redux'
import { logout } from 'store/authSlice'

function Heading(props) {
    let dispatch = useDispatch()
    let { title, btnLogout } = props;
    return (
        <div className="d-flex justify-content-between border-bottom sticky-top bg-white align-items-center">
            <h5 className="m-3"><b>{title}</b></h5>
            {btnLogout ? (
                <button onClick={() => { dispatch(logout()) }}
                    className="btn btn-outline-primary rounded-pill px-2 py-1 mr-2 font-weight-bold"
                >Don't click</button>
            ) : null}
        </div>
    )
}
export default Heading