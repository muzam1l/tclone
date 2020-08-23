import React from 'react'
import Home from './Home'
import Sidebar from './sidebar'
import Nav from '../header/bottom-nav'
import MediaQuery from 'react-responsive'

import { Route, Switch, Redirect } from 'react-router-dom'
import { AuthContext } from '../../utils/context/auth'

import { Row, Col } from 'react-bootstrap'

const Explore = React.lazy(() => import('./Explore'))

class Main extends React.Component {
    static contextType = AuthContext;
    render() {
        return (
            <Row>
                <Col className="px-sm-4" sm="12" lg="8">
                    <Switch>
                        <Route path='/explore'>
                            <Explore />
                        </Route>
                        <Route path='/search'>
                            <Explore />
                        </Route>
                        <Route path='/'>
                            <Home />
                        </Route>
                    </Switch>
                </Col>
                <Col lg="4" className="vh-100 overflow-y-auto hide-scroll sticky-top">
                    {/* (max-width: 1020px)  */}
                    <MediaQuery minWidth={992}>
                        <Sidebar />
                    </MediaQuery>
                    {/* (max-width: 576px) , (max-height: 500px) */}
                    <MediaQuery maxWidth={576}>
                        {/* //for taking out duplicate */}
                        <MediaQuery minHeight={500}>
                            <Nav />
                        </MediaQuery>
                    </MediaQuery>
                    <MediaQuery maxHeight={500}>
                        <Nav />
                    </MediaQuery>
                </Col>
            </Row>
        )
    }
}
export default Main