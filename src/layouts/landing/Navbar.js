import React from 'react'
import './Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter'
import Search from '../../comps/Search'
import { Link } from 'react-router-dom'
import MediaQuery from 'react-responsive'

class Navbar extends React.Component {
    render() {
        return (
            <nav className="Navbar">
                <div className="left">
                    <div className="logo">
                        <Link to="/" className="btn">
                            <FontAwesomeIcon size="lg" icon={faTwitter} />
                        </Link>
                    </div>
                    <div className="search">
                        <Search height='32.5px' />
                    </div>
                </div>
                <MediaQuery minWidth="580px">
                    <div className="right">
                        <Link to="/login" className="btn"><span>Log in</span> </Link>
                        <Link to="/signup" className="btn"><span>Sign up</span></Link>
                    </div>
                </MediaQuery>

            </nav>
        )
    }
}
export default Navbar;