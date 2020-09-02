import React from 'react'
import { useEffect, useCallback } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { numFormatter } from 'utils/helpers'
import { Link } from 'react-router-dom'
import { Media, Row, ListGroup } from 'react-bootstrap'
import MultiMedia from 'comps/MultiMedia'
import Spinner from 'comps/Spinner'
import ReactionsBar from 'features/posts/ReactionsBar'

import { useBottomScrollListener } from 'react-bottom-scroll-listener';

export default function PostsList(props) {
    let { posts = [], status, getPosts } = props;
    let bottomRef = React.createRef();
    useEffect(useCallback(() => {
        if (status === 'idle' && !posts.length) {
            getPosts()
            console.log('fetching on first, status:', status)
        }
    }, [status, posts, getPosts]), [getPosts])
    useBottomScrollListener(useCallback(() => {
        if (status === "idle" && posts.length) {
            getPosts()
            console.log('loading more posts, status:', status)
        }
    }, [status, posts, getPosts]), 500)
    return (
        <ListGroup variant="flush" className="border-bottom">
            {(posts && posts.length > 0) ? posts.map(post => {
                return (
                    <ListGroup.Item
                        className="px-3"
                        action
                        as={"div"}
                        // onClick={(e) => { e.target === '' }}
                        // to={`/post/${post.id_str}`}
                        key={post.id_str}
                    >
                        <Link className="stretched-link" to={`/post/${post.id_str}`}></Link>
                        <Media>
                            <Link
                                className="rounded-circle"
                                to={`/user/${post.user.screen_name}`}
                            >
                                <img
                                    className="rounded-circle mr-2"
                                    width={50}
                                    height={50}
                                    src={(post.user.default_profile_image) ? '/img/default-profile-vector.svg' : post.user.profile_image_url_https}
                                    alt="user"
                                />
                            </Link>
                            <Media.Body>
                                <Row className="d-flex align-items-center">
                                    <Link to={`/user/${post.user.screen_name}`} className="text-dark font-weight-bold mr-1">{post.user.name}</Link>
                                    {/* tick */}
                                    <span className="text-muted mr-1">@{post.user.screen_name}</span>
                                    <pre className="m-0 text-muted">{" - "}</pre>
                                    <span className="text-muted"><ReactTimeAgo date={Date.parse(post.created_at)} timeStyle="twitter" /></span>
                                </Row>
                                <Row className="mb-n3"><blockquote className="mb-1">{post.text}</blockquote></Row>
                                <Row>
                                    <MultiMedia
                                        className="mt-3"
                                        entities={post.entities}
                                        extented_entities={post.extented_entities} />
                                </Row>
                                <Row className="d-flex justify-content-end align-items-center mb-n3 position-static">
                                    <ReactionsBar post={post} />
                                </Row>
                            </Media.Body>
                        </Media>
                    </ListGroup.Item>
                )
            }) : (
                    <div className="message">No posts for you right now</div>
                )}
            <div ref={bottomRef} >
                {status === 'loading' ? <Spinner /> : <br />}
            </div>
        </ListGroup>
    )
}