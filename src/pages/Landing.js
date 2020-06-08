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
                                <Explore noSearchBar />
                            </MediaQuery>
                        </div>
                        <div className="sidebar">
                            <div className="column">
                                <Switch>
                                    <Route path="/signup">
                                        <Signup />
                                    </Route>
                                    <Route path="/search">
                                        <MediaQuery maxWidth={850}>
                                            <Explore noSearchBar />
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