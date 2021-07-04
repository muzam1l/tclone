import React from 'react'
import { useDispatch } from 'react-redux'
import { likePost, unlikePost, repostPost, unRepostPost } from './postsSlice'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import { faComment as commentSolid } from '@fortawesome/free-solid-svg-icons/faComment'
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart'
import { faReply } from '@fortawesome/free-solid-svg-icons/faReply'
import { numFormatter } from 'utils/helpers'

export default props => {
    const history = useHistory()

    let { isAuthenticated } = useSelector(state => state.auth)
    let dispatch = useDispatch()
    let handleLike = e => {
        e.preventDefault()
        if (!isAuthenticated) {
            history.push(`/login`)
            return
        }
        post.favorited ? dispatch(unlikePost(post)) : dispatch(likePost(post))

    }
    let handleRepost = post => {
        if (!isAuthenticated) {
            history.push(`/login`)
            return
        }
        post.retweeted ? dispatch(unRepostPost(post)) : dispatch(repostPost(post))
    }
    let { post } = props
    return (<div className='d-flex align-items-center'>
        <Dropdown drop="up" className="bg-clear high-index">
            <Dropdown.Toggle
                className="btn btn-naked-primary rounded-pill"
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
        {/* reply */}
        <Link
            to={`/compose/post?reply_to=${post.id_str}`}
            className="btn btn-naked-secondary rounded-pill high-index"
        >
            <FontAwesomeIcon style={{ fontSize: '1.2em' }} className='mb-1 text-muted' icon={faReply} />
        </Link>
        {/* like */}
        <button
            onClick={handleLike}
            className="btn btn-naked-danger rounded-pill high-index"
        >
            {post.favorited ? (
                <FontAwesomeIcon icon={heartSolid} className="text-danger" />
            ) : <FontAwesomeIcon icon={faHeart} />}

            <small className="m-1">{numFormatter(post.favorite_count)}</small>
        </button>
    </div>)
}