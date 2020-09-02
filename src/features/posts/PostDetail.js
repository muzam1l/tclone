import React from 'react'
import { useEffect } from 'react'
import Heading from 'comps/Heading'
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import MultiMedia from 'comps/MultiMedia'
import { useSelector, useDispatch } from 'react-redux'
import { selectPostById, getPost } from './postsSlice'

import { numFormatter } from 'utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import ScrollToTop from 'comps/ScrollToTop'
import ReactionsBar from './ReactionsBar'

export default props => {
    let { match: { params: { postId } = {} } = {} } = props
    let dispatch = useDispatch()
    let post = useSelector(state => selectPostById(state, postId))
    useEffect(() => {
        if (!post)
            dispatch(getPost(postId))
    }, [post, postId, dispatch])
    if (!post) {
        return <div className="message">Not Found</div>
    }
    return (<>
        <ScrollToTop />
        <Heading backButton title="Post" />
        <Col className="p-3 d-flex flex-column">
            <Row>
                <Row>
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
                    <Col className="d-flex flex-column">
                        <Link to={`/user/${post.user.screen_name}`} className="text-dark font-weight-bold mr-1">{post.user.name}</Link>
                        {/* tick */}
                        <span className="text-muted mr-1">@{post.user.screen_name}</span>
                    </Col>
                </Row>
                <Row></Row>
            </Row>
            <Row><blockquote
                style={{ whiteSpace: "pre-wrap", fontSize: "1.5em" }}
                className="text-break my-2"
            >{post.text}</blockquote></Row>
            <Row className="mb-2">
                <MultiMedia
                    entities={post.entities}
                    extented_entities={post.extented_entities}
                    options={{ expanded: true }}
                />
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
                    <span className="font-weight-bold mr-1">{numFormatter(post.retweet_count)}</span>
                    <Link to="#" className="text-muted">Retweets and Comments</Link>
                </div>
                <div className="py-1 pr-3">
                    <span className="font-weight-bold mr-1">{numFormatter(post.favorite_count)}</span>
                    <Link to="#" className="text-muted">Likes</Link>
                </div>
            </Row>
            <Row className="d-flex justify-content-end align-items-center mt-2">
                <ReactionsBar post={post} />
            </Row>
        </Col>
    </>)
}