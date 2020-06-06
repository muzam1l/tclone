import React from 'react'
import TryAgain from './tools/TryAgain'
import Spinner from './tools/Spinner'

import './Trends.css'

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
            <div className="Trends">
                {(!this.state.trends && !this.state.doneFetching) ?
                    <div className="spinner">
                        <Spinner />
                    </div>
                    : (
                        !this.state.trends ?
                            <div className="message">
                                No trends near you right now
                            </div>
                            : this.state.trends.slice(0, this.props.length).map(itm => {
                                return (
                                    <div
                                        key={itm.name}
                                        className="content"
                                        onClick={() => { window.location.href = `${window.origin}/search?q=${itm.query}` }}>
                                        <div className="main">
                                            <div className="detail">{itm.name}</div>
                                            <div className="hashtag">{itm.name}</div>
                                            <div className="ntweets">{itm.tweet_volume + ' Tweets'} </div>
                                        </div>
                                    </div>
                                )
                            })
                    )
                }
            </div>
        )
    }
}

export default TrendingCard;