import React from 'react'

import Search from '../../comps/Search'
import Trends from '../../comps/Trends'
import MediaQuery from 'react-responsive'
import FollowCard from './sidebar/FollowCard'
import Users from 'comps/Users'
import Heading from 'comps/Heading'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Col, Figure } from 'react-bootstrap'

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
            <Col className="border">
                <div className="header">
                    {!this.props.noSearchBar ?
                        <MediaQuery maxWidth={1020} >
                            <Search className="w-100 p-2" />
                        </MediaQuery> : null}
                </div>
                {this.state.path.startsWith('/search') ? (
                    <>
                        <Posts key={this.state.query} url={`/api${this.state.path}${this.state.query}`} />
                    </>
                ) :
                    <Switch>
                        <Route path='/explore/users'>
                            <Heading title="Users" />
                            <Users />
                        </Route>
                        <Route path='/'>
                            <MediaQuery maxWidth={992}>
                                <FollowCard title='Follow more users to see their posts' length={4} />
                            </MediaQuery>
                            <Heading title="Trends near you" />
                            <Figure className="d-flex flex-column align-items-end">
                                <Figure.Image src="img/explore-thumb-vector.svg" alt="" />
                                <Figure.Caption><small><a className="text-muted font-weight-lighter" href="https://www.freepik.com/free-photos-vectors/brochure">Brochure vector created by katemangostar - www.freepik.com</a></small></Figure.Caption>
                            </Figure>
                            <Trends />
                        </Route>
                    </Switch>
                }
            </Col>
        )
    }
}
export default withRouter(Explore);