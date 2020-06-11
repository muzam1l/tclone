import React from 'react'

import Search from '../../comps/Search'
import Trends from '../../comps/Trends'
import MediaQuery from 'react-responsive'
import FollowCard from './sidebar/FollowCard'
import { Route, Switch, withRouter } from 'react-router-dom'

import './Explore.css'
import Posts from '../../comps/Posts'

class Explore extends React.Component {
    state = {
        path: this.props.location.pathname,
        query: this.props.location.search,
    }
    componentDidUpdate() {
        // let path = this.props.location.pathname;
        let query = this.props.location.search;
        if (query !== this.state.query) {
            this.setState({
                path: this.props.location.pathname,
                query: this.props.location.search
            })
        }
    }
    render() {
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
                {this.state.path.startsWith('/search') ? (
                    <>
                        <Posts key={this.state.query} url={`/api${this.state.path}${this.state.query}`} />
                    </>
                ) :
                    <div className="trends">
                        <Switch>
                            <Route path='/explore/users'>
                                <FollowCard title='Users to follow' />
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
export default withRouter(Explore);