import React from 'react'
import { useDispatch } from 'react-redux'
import { likePost, unlikePost, repostPost, unRepostPost } from './postsSlice'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import { faComment as commentSolid } from '@fortawesome/free-solid-svg-icons/faComment'
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart'
import { numFormatter } from 'utils/helpers'

export default props => {
    let dispatch = useDispatch()
    let handleLike = e => {
        e.preventDefault();
        post.favorited ? dispatch(unlikePost(post)) : dispatch(likePost(post))

    }
    let handleRepost = post => {
        post.retweeted ? dispatch(unRepostPost(post)) : dispatch(repostPost(post))
    }
    let { post } = props
    return (<>
        <Dropdown drop="up" className="bg-clear high-index">
            <Dropdown.Toggle
                className="btn btn-naked-primary rounded-pill bg-clear"
                id="comment-dropdown"
            >
                {post.retweeted ? (
                    <FontAwesomeIcon icon={commentSolid} className="text-success" />
                ) : <FontAwesomeIcon icon={faComment} />}
                <small className="m-1">{numFormatter(post.retweet_count)}</small>
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight className="higher-index rounded-0">
                <Dropdown.Item
                    className="high-index"
                    as='button'
                    onClick={e => handleRepost(post)}
                >{post.retweeted ? "Undo Repost" : "Repost"}</Dropdown.Item>
                <Dropdown.Item
                    as={Link}
                    className="high-index"
                    to={`/compose/post?quote=${post.id_str}`}
                >Quote this post</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        <button
            onClick={handleLike}
            className="btn btn-naked-danger rounded-pill bg-clear high-index"
        >
            {post.favorited ? (
                <FontAwesomeIcon icon={heartSolid} className="text-danger" />
            ) : <FontAwesomeIcon icon={faHeart} />}

            <small className="m-1">{numFormatter(post.favorite_count)}</small>
        </button>
    </>)
}