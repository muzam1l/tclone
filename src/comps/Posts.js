import React from 'react'
import Spinner from './tools/Spinner'
import TryAgain from './tools/TryAgain'
import ReactTimeAgo from 'react-time-ago'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet'
import { faShare } from '@fortawesome/free-solid-svg-icons/faShare'

import { numFormatter } from '../utils/helpers'
import { AuthContext } from '../utils/context/auth'

import FollowCard from '../layouts/main/sidebar/FollowCard'

import './Posts.css'

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
    /*
    //this one runs only once
    useEffect(() => {
    */
    render() {
        return (
            <div className="Posts">
                {this.state.posts.map(post => {
                    return (
                        <div key={post.id_str} className="post">
                            <div className="photo">
                                <div className="img">
                                    <img src={(post.user.default_profile_image) ?
                                        'img/default-profile-vector.svg' :
                                        post.user.profile_image_url_https} alt="" />
                                </div>
                            </div>
                            <div className="body">
                                <div className="head">
                                    <div className="name">{post.user.name}</div>
                                    <div className="tick"></div>
                                    <div className="username">{post.user.screen_name}</div>
                                    <div className="dot">.</div>
                                    <div className="timeago"><ReactTimeAgo date={Date.parse(post.created_at)} timeStyle="twitter" /></div>
                                </div>
                                <div className="text">{post.text}</div>
                                {(post.entities.media && post.entities.media.length) ? (
                                    <div className="media">
                                        {/* thumbnail */}
                                        {(post.entities.media[0].type === "photo") ? (
                                            <div className="thumb">
                                                <img src={post.entities.media[0].media_url_https} alt='media preview' />
                                            </div>
                                        ) : undefined}
                                    </div>
                                ) : undefined}
                                <div className="foot">
                                    <div className="itm">
                                        <button className="btn"><FontAwesomeIcon icon={faComment} /></button>
                                        <span>{numFormatter(post.retweet_count)}</span>
                                    </div>
                                    <div className="itm">
                                        <button className="btn"><FontAwesomeIcon icon={faRetweet} /></button>
                                        <span>{numFormatter(post.retweet_count)}</span>
                                    </div>
                                    <div className="itm">
                                        <button className="btn"><FontAwesomeIcon icon={faHeart} /></button>
                                        <span>{numFormatter(post.favorite_count)}</span>
                                    </div>
                                    <div className="itm">
                                        <button className="btn"><FontAwesomeIcon icon={faShare} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* bottom */}
                {this.state.errorFetching ?
                    <TryAgain fn={this.fetchPosts} />
                    :
                    this.state.doneFetching ?
                        <>
                            <div className="message">
                                No (more) posts to show!
                            </div>
                            <FollowCard title='Follow (more) users to see their posts' />
                        </>
                        :
                        (!this.state.errorFetching) ?
                            <div ref={this.bottomRef} className="spinner">
                                <Spinner />
                            </div>
                            : undefined
                }
            </div>
        )
    }
}

export default Posts
