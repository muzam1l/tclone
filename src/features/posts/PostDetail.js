import React from 'react'
import { useEffect, useCallback } from 'react'
import Heading from 'comps/Heading'
import { Link } from 'react-router-dom'
import { Row, Col, Figure } from 'react-bootstrap'
import MultiMedia from 'comps/MultiMedia'
import { useSelector, useDispatch } from 'react-redux'
import { selectPostById, getPost, selectReplies, getReplies } from './postsSlice'

import { numFormatter } from 'utils/helpers'
import ScrollToTop from 'comps/ScrollToTop'
import ReactionsBar from './ReactionsBar'
import PostText from 'comps/PostText'
import QuotedPost from 'comps/quoted-post'
import UserLink from 'comps/user-link'
import Spinner from 'comps/Spinner'
import PostsList from 'comps/PostsList'
import PostTag from 'comps/post-tag'

export default props => {
    let { match: { params: { postId } = {} } = {} } = props
    let dispatch = useDispatch()
    let post = useSelector(state => selectPostById(state, postId))
    const replies = useSelector(state => selectReplies(state, postId))
    let { post_detail_status: status, post_replies_status } = useSelector(state => state.posts)
    useEffect(() => {
        if (!post)
            dispatch(getPost(postId))
    }, [post, postId, dispatch])
    const getPosts = useCallback(() => {
        dispatch(getReplies(postId))
    }, [dispatch, postId])

    if (status === 'loading')
        return <Spinner />
    if (!post) {
        return <div className="message font-weight-bold">Post not Found</div>
    }
    return (<>
        <ScrollToTop />
        <Heading backButton title="Post" />
        <Col className="p-3 d-flex flex-column">
            <Row className="d-flex px-3 pb-1 mt-n2 text-muted">
                <PostTag post={post} />
            </Row>
            <Row>
                <Row>
                    <UserLink
                        user={post.user}
                        className="rounded-circle"
                        to={`/user/${post.user.screen_name}`}
                    >
                        <Figure
                            className="bg-border-color rounded-circle mr-2 overflow-hidden"
                            style={{ height: "50px", width: "50px" }}
                        >
                            <Figure.Image
                                src={(post.user.default_profile_image) ? '/img/default-profile-vector.svg' : post.user.profile_image_url_https}
                                className="w-100 h-100"
                            />
                        </Figure>
                    </UserLink>
                    <Col className="d-flex flex-column">
                        <UserLink
                            user={post.user}
                            to={`/user/${post.user.screen_name}`}
                            className="text-dark font-weight-bold mr-1">
                            {post.user.name}
                        </UserLink>
                        {/* tick */}
                        <span className="text-muted mr-1">@{post.user.screen_name}</span>
                    </Col>
                </Row>
                <Row></Row>
            </Row>
            <Row><blockquote
                style={{ fontSize: "1.5em" }}
                className="my-2 mw-100">
                <PostText expanded post={post} />
            </blockquote></Row>
            <Row className="mb-2">
                <MultiMedia
                    expanded
                    post={post}
                />
                <QuotedPost className="mt-2" post={post.quoted_status} />
            </Row>
            <Row>
                <span className="text-muted pb-2">
                    {new Date(post.created_at).toLocaleTimeString()}
                    {" - "}
                    {new Date(post.created_at).toDateString()}
                </span>
            </Row>
            <Row className="border-top border-bottom d-flex p-2">
                <div className="py-1 pr-3">
                    <span className="font-weight-bold mr-1">{numFormatter(post.favorite_count)}</span>
                    <Link to={`/post/${post.id_str}/likes`} className="text-muted">Likes</Link>
                </div>
                <div className="py-1 pr-3">
                    <span className="font-weight-bold mr-1">{numFormatter(post.retweet_count)}</span>
                    <Link to={`/post/${post.id_str}/reposts`} className="text-muted">Reposts</Link>
                </div>
            </Row>
            <Row className="d-flex justify-content-end align-items-center mt-2 border-bottom">
                <ReactionsBar post={post} />
            </Row>
            <PostsList
                no_reply_tag
                posts={replies}
                status={post_replies_status}
                getPosts={getPosts}
            />
        </Col>
    </>)
}