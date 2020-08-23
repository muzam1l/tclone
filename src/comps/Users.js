import React from 'react'
import TryAgain from './TryAgain'
import Spinner from './Spinner'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons/faArrowAltCircleUp'
import { AuthContext } from '../utils/context/auth'
import { withRouter, Link } from 'react-router-dom'
import { ListGroup, Media, Row, Col } from 'react-bootstrap'

class Users extends React.Component {
    static contextType = AuthContext
    state = {
        users: [],
        errorFetching: false,
        doneFetching: false,
    }
    componentDidMount() {
        this.fetchUsers();
    }
    async followUser(username) {
        let url = `/api/follow/${username}`;
        let res = await fetch(url);
        if (res.ok) {
            this.props.history.push({ pathname: "/explore" });
            this.props.history.replace({ pathname: "/home" });
        }
    }
    async fetchUsers() {
        let res = await fetch(this.props.url || '/api/users');
        if (!res.ok) {
            if (res.status === 401) {
                this.context.logout();
            }
            this.setState({ errorFetching: true })
        }
        else {
            let data = await res.json();
            this.setState({
                doneFetching: true,
                errorFetching: false,
                users: data ? data.users : null,
            })
        }
    }
    fetchUsers = this.fetchUsers.bind(this);
    render() {
        let { className, url, length, message } = this.props;
        if (this.state.errorFetching) {
            return (
                <div className="card">
                    <TryAgain fn={this.fetchUsers} />
                </div>
            )
        }
        return (
            <ListGroup className={"" + className} variant="flush">
                {(!this.state.users && !this.state.doneFetching) ?
                    <Spinner />
                    : (
                        !this.state.users ?
                            <div className="message">
                                {message || 'No user suggestions for you right now'}
                            </div>
                            : this.state.users.slice(0, length).map(itm => {
                                return (
                                    <ListGroup.Item
                                        className="px-1"
                                        action
                                        key={itm.screen_name}
                                        as={Link}
                                        to={`/user/${itm.screen_name}`}
                                    >
                                        <Media>
                                            <img
                                                width={50}
                                                height={50}
                                                className="rounded-circle mx-3"
                                                src={itm.profile_image_url_https}
                                                alt=''
                                            />
                                            <Media.Body>
                                                <Row>
                                                    <Col className="pr-2" xs="8">
                                                        <p className="text-dark mb-0 text-truncate"><b>{itm.name}</b></p>
                                                        <p className="text-muted text-truncate mb-1"> @{itm.screen_name}</p>
                                                    </Col>
                                                    <Col className="d-flex align-items-center justify-content-end px-2" xs="4">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); this.followUser(itm.screen_name) }}
                                                            className="btn btn-outline-primary rounded-pill px-3 py-1 font-weight-bold">
                                                            <span>Follow</span>
                                                        </button>
                                                    </Col>
                                                </Row>
                                            </Media.Body>
                                        </Media>
                                    </ListGroup.Item>
                                )
                            })
                    )
                }
            </ListGroup>
        )
    }
}
export default withRouter(Users)