import React from 'react'
import Login from 'layouts/landing/Login'
import Signup from 'layouts/landing/Signup'
import Navbar from 'layouts/landing/Navbar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Container, Col, Row } from 'react-bootstrap'

import MediaQuery from 'react-responsive'
const Explore = React.lazy(() => import('layouts/main/Explore'))
const Search = React.lazy(() => import('features/search/Search'))
const PostDetail = React.lazy(() => import('features/posts/PostDetail'))
const UserDetail = React.lazy(() => import('features/users/UserDetail'))
class Landing extends React.Component {
    render() {
        return (
            <Router>
                <>
                    <Navbar />
                    <Container>
                        <Row>
                            <Col xs="12" lg="7">
                                <Switch>
                                    <Route path="/signup">
                                        <MediaQuery maxWidth={992}>
                                            <Signup />
                                        </MediaQuery>
                                        <MediaQuery minWidth={993}>
                                            <Explore noSearchBar />
                                        </MediaQuery>
                                    </Route>
                                    <Route path="/search" component={Search} />
                                    <Route path='/post/:postId' component={PostDetail} />
                                    <Route path='/user/:username' component={UserDetail} />
                                    <Route path="/">
                                        <MediaQuery maxWidth={992}>
                                            <Login />
                                        </MediaQuery>
                                        <MediaQuery minWidth={993}>
                                            <Explore noSearchBar />
                                        </MediaQuery>
                                    </Route>
                                </Switch>
                            </Col>
                            <MediaQuery minWidth={993}>
                                <Col className="mx-auto vh-100 sticky-top overflow-y-auto hide-scroll" xs lg="5">
                                    <Switch>
                                        <Route path="/signup">
                                            <Signup />
                                        </Route>
                                        <Route path="/">
                                            {/* <Redirect to="/" /> */}
                                            <Login />
                                        </Route>
                                    </Switch>
                                </Col>
                            </MediaQuery>
                        </Row>
                    </Container>
                </>
            </Router>
        )
    }
}
export default Landing