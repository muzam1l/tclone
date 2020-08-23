import React from 'react'
import { useAuth } from 'utils/context/auth'

function Heading(props) {
    let auth = useAuth();
    let { title, btnLogout } = props;
    return (
        <div className="d-flex justify-content-between border-bottom sticky-top bg-white align-items-center">
            <h5 className="m-3"><b>{title}</b></h5>
            {btnLogout ? (
                <button onClick={auth.logout}
                    className="btn btn-outline-primary rounded-pill px-2 py-1 mr-2 font-weight-bold"
                >Don't click</button>
            ) : null}
        </div>
    )
}
export default Heading