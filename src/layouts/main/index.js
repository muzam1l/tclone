import React from 'react'
import Home from './Home'
import Sidebar from './sidebar'
import MediaQuery from 'react-responsive'
import { Row, Col } from 'react-bootstrap'

import { Route, Switch } from 'react-router-dom'
import PostDetail from 'features/posts/PostDetail'
import Explore from './Explore'
import Search from 'features/search/Search'
import UserDetail from 'features/users/UserDetail'
import Compose from 'features/posts/compose-modal'
import Notifies from 'features/notifies/notify-page'
import Settings from 'features/settings/settings-page.js'

class Main extends React.Component {
    render() {
        return (
            <Row>
                <Col className="px-sm-4" sm="12" lg="8">
                    <Col className="border">
                        <Switch>
                            <Route path='/explore' component={Explore} />
                            <Route path='/search' component={Search} />
                            <Route path='/post/:postId' component={PostDetail} />
                            <Route path='/user/:username' component={UserDetail} />
                            <Route path='/notifications' component={Notifies} />
                            <Route path='/settings' component={Settings} />
                            <Route path='/' component={Home} />
                        </Switch>
                        <Route path='/compose/post' component={Compose} />
                    </Col>
                </Col>

                <MediaQuery minWidth={992}>
                    <Col lg="4" className="vh-100 overflow-y-auto hide-scroll sticky-top">
                        <Sidebar />
                    </Col>
                </MediaQuery>
            </Row>
        )
    }
}
export default Main