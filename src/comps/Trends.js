import React from 'react'
import TryAgain from './TryAgain'
import Spinner from './Spinner'
import { withRouter, Link } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'

class TrendingCard extends React.Component {
    state = {
        trends: [],
        locations: [],
        errorFetching: false,
        doneFetching: false
    }
    componentDidMount() {
        this.fetchTrends();
    }
    async fetchTrends() {
        let res = await fetch('/api/trends?woeid=1');
        if (!res.ok) {
            this.setState({ errorFetching: true })
        }
        else {
            let data = await res.json();
            this.setState({
                doneFetching: true,
                errorFetching: false,
                trends: data ? data.trends : null,
                locations: data ? data.locations : null
            })
        }
    }
    fetchTrends = this.fetchTrends.bind(this);

    render() {
        if (this.state.errorFetching) {
            return (
                <div className="card">
                    <TryAgain fn={this.fetchTrends} />
                </div>
            )
        }
        return (
            <ListGroup variant="flush">
                {(!this.state.trends && !this.state.doneFetching) ?
                    <Spinner />
                    : (
                        !this.state.trends ?
                            <div className="message">
                                No trends near you right now
                            </div>
                            : this.state.trends.slice(0, this.props.length).map(itm => {
                                return (
                                    <ListGroup.Item
                                        as={Link}
                                        action
                                        key={itm.name}
                                        to={`/search?q=${itm.query}`}
                                    >
                                        <small className="text-muted">{itm.name}</small>
                                        <p className="mb-1 text-black"><b>{itm.name}</b></p>
                                        <em className="">{itm.tweet_volume + ' Tweets'} </em>
                                    </ListGroup.Item>

                                )
                            })
                    )
                }
            </ListGroup>
        )
    }
}

export default withRouter(TrendingCard);