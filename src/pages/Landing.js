import React from 'react'
import Login from 'comps/auth/Login'
import Signup from 'comps/auth/Signup'
import Navbar from 'layouts/landing/Navbar'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { Container, Col, Row } from 'react-bootstrap'

import MediaQuery from 'react-responsive'
const Explore = React.lazy(() => import('layouts/main/Explore'))
class Landing extends React.Component {
    render() {
        return (
            <Router>
                <>
                    <Navbar />
                    <Container>
                        <Row>
                            <Col lg="7">
                                <MediaQuery minWidth={992} >
                                    <Explore noSearchBar />
                                </MediaQuery>
                            </Col>
                            <Col className="mx-auto  h-100 sticky-top" xs lg="5">
                                <Switch>
                                    <Route path="/signup">
                                        <Signup />
                                    </Route>
                                    <Route path="/search">
                                        <MediaQuery maxWidth={992}>
                                            <Explore noSearchBar />
                                        </MediaQuery>
                                        <MediaQuery minWidth={992}>
                                            <Login />
                                        </MediaQuery>
                                    </Route>
                                    <Route path="/">
                                        <Redirect to="/" />
                                        <Login />
                                    </Route>
                                </Switch>
                            </Col>
                        </Row>
                    </Container>
                </>
            </Router>
        )
    }
}
export default Landing