import React from 'react'

import Search from '../../comps/Search'
import Trends from '../../comps/Trends'
import MediaQuery from 'react-responsive'
import FollowCard from './sidebar/FollowCard'
import Users from '../../comps/Users'
import { Route, Switch } from 'react-router-dom'

import './Explore.css'
import Posts from '../../comps/Posts'

class Explore extends React.Component {
    render() {
        let path = window.location.pathname;
        let query = window.location.search;
        return (
            <div className="Feed Explore">
                <div className="header">
                    <MediaQuery maxWidth={1020} >
                        <div className="top">
                            <div className="search">
                                {!this.props.noSearchBar ?
                                    <Search /> : undefined
                                }
                            </div>
                        </div>
                    </MediaQuery>
                    <div className="tabs">
                        {/* TODO */}
                    </div>
                </div>
                {path.startsWith('/search') ? (
                    <>
                        <Posts url={`/api${path}${query}`} />
                    </>
                ) :
                    <div className="trends">
                        <Switch>
                            <Route path='/explore/users'>
                                <FollowCard title='Users to follow' length={20} />
                            </Route>
                            <Route path='/'>
                                <MediaQuery maxWidth={1020}>
                                    <FollowCard title='Follow (more) users to see their posts' length={4} />
                                </MediaQuery>
                                <div className="header">Trends near you</div>
                                <div className="thumb">
                                    <img src="img/explore-thumb-vector.svg" alt="" />
                                    <a href="https://www.freepik.com/free-photos-vectors/brochure">Brochure vector created by katemangostar - www.freepik.com</a>
                                </div>
                                <Trends />
                            </Route>
                        </Switch>
                    </div>
                }
            </div>
        )
    }
}
export default Explore;