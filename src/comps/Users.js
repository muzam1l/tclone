import React from 'react'
import TryAgain from './tools/TryAgain'
import Spinner from './tools/Spinner'
import './Users.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons/faArrowAltCircleUp'
import { AuthContext } from '../utils/context/auth'

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
        let url = `api/follow/${username}`;
        let res = await fetch(url);
        if (res.ok) {
            window.location.reload();
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
        if (this.state.errorFetching) {
            return (
                <div className="card">
                    <TryAgain fn={this.fetchUsers} />
                </div>
            )
        }
        return (
            <div className="Users">
                {(!this.state.users && !this.state.doneFetching) ?
                    <div className="spinner">
                        <Spinner />
                    </div>
                    : (
                        !this.state.users ?
                            <div className="message">
                                No user suggestions for you right now
                            </div>
                            : this.state.users.slice(0, this.props.length).map(itm => {
                                return (
                                    <div
                                        key={itm.screen_name}
                                        onClick={() => { window.location.href = `/user/${itm.screen_name}` }}
                                        className="content">
                                        <div className="media">
                                            <div className="img">
                                                <img src={itm.profile_image_url_https} alt='' />
                                            </div>
                                        </div>
                                        <div className="body">
                                            <div className="main">
                                                <div className="name">{itm.name}</div>
                                                <div className="user">{itm.screen_name}</div>
                                                {itm.promoted ? (
                                                    <div className="pro">
                                                        <FontAwesomeIcon icon={faArrowCircleUp} />
                                                        <span>Promoted</span>
                                                    </div>
                                                ) : undefined}
                                            </div>
                                            <div className="follow">
                                                <button onClick={() => this.followUser(itm.screen_name)} className="btn"><span>Follow</span></button>
                                            </div>
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
export default Users