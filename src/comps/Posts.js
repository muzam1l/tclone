import React from 'react'
import Spinner from './Spinner'
import TryAgain from './TryAgain'
import ReactTimeAgo from 'react-time-ago'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet'
import { faShare } from '@fortawesome/free-solid-svg-icons/faShare'

import { numFormatter } from 'utils/helpers'
import { AuthContext } from 'utils/context/auth'
import { Link } from 'react-router-dom'

import FollowCard from 'layouts/main/sidebar/FollowCard'
import { Col, Media, Row, Card, ListGroup } from 'react-bootstrap'
import MultiMedia from 'comps/MultiMedia'

import Users from './Users'

class Posts extends React.Component {
    static contextType = AuthContext;
    state = {
        posts: [],
        post_id_strs: [],
        page: 0,
        isFetching: false, //not used yet, spinner shown as default
        errorFetching: false,
        doneFetching: false,
    }
    bottomRef = React.createRef();
    componentDidMount() {
        this.observer = this.bottomObserver();
        if (this.bottomRef.current) {
            this.observer.observe(this.bottomRef.current);
        }
        //this.initSock();
    }
    componentDidUpdate() {
        if (this.bottomRef.current) {
            this.observer.disconnect();
            this.observer.observe(this.bottomRef.current);
        }
    }
    bottomObserver() {
        let intersectionObserver = new IntersectionObserver(([entry]) => {
            if (entry.intersectionRatio > 0) {
                console.log('intersection with target node.');
                this.fetchPosts();
            }
        });
        return intersectionObserver;
    }
    async fetchPosts() {
        let errorFetching = false;
        let responce = {};
        let p = this.state.page;
        if (!this.state.doneFetching) {
            let url = this.props.url + ((this.props.url.includes('?')) ? `&p=${p + 1}` : `?p=${p + 1}`)
            let fetchRes = await fetch(url);
            if (!fetchRes.ok) {
                if (fetchRes.status === 401) {
                    this.context.logout()
                }
                errorFetching = true
            }

            else
                responce = await fetchRes.json();
        }
        this.setState(state => {
            let doneFetching = false;
            let posts = state.posts;
            let page = state.page;
            let post_id_strs = state.post_id_strs;

            if (responce.posts && responce.posts.length > 0) {
                page = page + 1;
                for (let pst of responce.posts) {
                    if (pst && !state.post_id_strs.includes(pst.id_str)) {
                        post_id_strs.push(pst.id_str);
                        posts.push(pst);
                    }
                    else {
                        //maybe use this info to get new posts include
                        //as this situation happens when there are new post in db
                    }
                }
            }
            if (!errorFetching && (responce.done || !responce.posts || responce.posts.length === 0)) {
                doneFetching = true;
            }
            return {
                doneFetching,
                errorFetching,
                page,
                post_id_strs,
                posts
            }
        });
    }
    fetchPosts = this.fetchPosts.bind(this);
    render() {
        return (
            <ListGroup variant="flush">
                {this.state.posts.map(post => {
                    return (
                        <ListGroup.Item
                            className="px-3"
                            action
                            as={"div"}
                            // onClick={() => { }}
                            to={`/posts/${post.id_str}`}
                            key={post.id_str}
                        >
                            <Media>
                                <Link
                                    className="rounded-circle"
                                    to={`/users/${post.user.screen_name}`}
                                >
                                    <img
                                        className="rounded-circle mr-2"
                                        width={50}
                                        height={50}
                                        src={(post.user.default_profile_image) ? 'img/default-profile-vector.svg' : post.user.profile_image_url_https}
                                        alt="user profile image"
                                    />
                                </Link>
                                <Media.Body>
                                    <Row className="d-flex align-items-center">
                                        <Link to={`/users/${post.user.screen_name}`} className="text-dark font-weight-bold mr-1">{post.user.name}</Link>
                                        {/* tick */}
                                        <span className="text-muted mr-1">@{post.user.screen_name}</span>
                                        <pre className="m-0 text-muted">{" - "}</pre>
                                        <span className="text-muted"><ReactTimeAgo date={Date.parse(post.created_at)} timeStyle="twitter" /></span>
                                    </Row>
                                    <Row><blockquote style={{ whiteSpace: "pre-wrap" }} className="text-break mb-2">{post.text}</blockquote></Row>
                                    <Row className="mb-2">
                                        <MultiMedia entities={post.entities} extented_entities={post.extented_entities} />
                                    </Row>
                                    <Row className="d-flex justify-content-around align-items-center mb-n2">
                                        <button
                                            className="btn btn-naked-primary rounded-pill"
                                        >
                                            <FontAwesomeIcon icon={faComment} />
                                            <span>{numFormatter(post.retweet_count)}</span>
                                        </button>
                                        <button
                                            className="btn btn-naked-success rounded-pill"
                                        >
                                            <FontAwesomeIcon className="m-1" icon={faRetweet} />
                                            {/* <span>{numFormatter(post.retweet_count)}</span> */}
                                        </button>
                                        <button
                                            className="btn btn-naked-danger rounded-pill"
                                        >
                                            <FontAwesomeIcon icon={faHeart} />
                                            <span>{numFormatter(post.favorite_count)}</span>
                                        </button>
                                        <button
                                            className="btn btn-naked-primary rounded-pill"
                                        >
                                            <FontAwesomeIcon className="m-1" icon={faShare} />
                                        </button>
                                    </Row>
                                </Media.Body>
                            </Media>
                        </ListGroup.Item>
                    )
                })
                }

                {/* bottom */}
                {
                    this.state.errorFetching ?
                        <TryAgain fn={this.fetchPosts} />
                        :
                        this.state.doneFetching ?
                            <>
                                <div className="message text-info">
                                    No (more) posts to show!
                                </div>
                                {/* <Users url={this.props.url} message={' '} /> */}
                                <FollowCard title='Follow (more) users to see their posts' length={7} />
                            </>
                            :
                            (!this.state.errorFetching) ?
                                <div ref={this.bottomRef} >
                                    <Spinner />
                                </div>
                                : undefined
                }
            </ListGroup>
        )
    }
}

export default Posts
