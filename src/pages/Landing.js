import React from 'react'
import Login from '../comps/auth/Login'
import Signup from '../comps/auth/Signup'
import Navbar from '../layouts/landing/Navbar'
// import Spinner from '../comps/tools/Spinner'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import MediaQuery from 'react-responsive'
import './Landing.css'
const Explore = React.lazy(() => import('../layouts/main/Explore'))
class Landing extends React.Component {
    render() {
        return (
            <Router>
                <div className="Landing">
                    <Navbar />
                    <content>
                        <div className="main">
                            <MediaQuery minWidth={850} >
                                <Explore />
                            </MediaQuery>
                        </div>
                        <div className="sidebar">
                            <div className="column">
                                <div className="thumb">
                                    <img src="img/login-thumb-vector.svg" alt="people vector" />
                                    <a href="https://www.freepik.com/free-photos-vectors/people">People vector created by pikisuperstar - www.freepik.com</a>
                                </div>
                                <div style={{}} className="title">
                                    See what’s happening in the fake_world right now
                                </div>
                                <Switch>
                                    <Route path="/signup">
                                        <Signup />
                                    </Route>
                                    <Route path="/search">
                                        <MediaQuery maxWidth={850}>
                                            <Explore />
                                        </MediaQuery>
                                        <MediaQuery minWidth={850}>
                                            <Login />
                                        </MediaQuery>
                                    </Route>
                                    <Route path="/">
                                        <Redirect to="/" />
                                        <Login />
                                    </Route>
                                </Switch>
                            </div>
                        </div>
                    </content>
                </div>
            </Router>
        )
    }
}
export default Landing