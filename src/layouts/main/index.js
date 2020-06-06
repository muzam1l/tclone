import React from 'react'
import Feed from './Feed'
import Sidebar from './sidebar'
import Nav from '../header/bottom-nav'
import MediaQuery from 'react-responsive'

import { Route, Switch, Redirect } from 'react-router-dom'
import { AuthContext } from '../../utils/context/auth'

import './Main.css'

const Explore = React.lazy(() => import('./Explore'))

class Main extends React.Component {
    static contextType = AuthContext;
    render() {
        return (
            <div className='Main'>
                <Switch>
                    <Route path='/explore'>
                        <Explore />
                    </Route>
                    <Route path='/search'>
                        <Explore />
                    </Route>
                    <Route path='/'>
                        <Redirect to='/' />
                        <Feed />
                    </Route>
                </Switch>

                {/* (max-width: 1020px)  */}
                <MediaQuery minWidth={1020}>
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
            </div>
        )
    }
}
export default Main