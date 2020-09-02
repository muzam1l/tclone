import React from 'react'
import { useDispatch } from 'react-redux'
import { likePost, unlikePost } from './postsSlice'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart'
import { numFormatter } from 'utils/helpers'

export default props => {
    let dispatch = useDispatch()
    let { post } = props
    return (<>
        <button
            className="btn btn-naked-primary rounded-pill bg-clear high-index"
        >
            <FontAwesomeIcon icon={faComment} />
            <small className="text-muted m-1">{numFormatter(post.retweet_count)}</small>
        </button>
        <button
            onClick={() => post.favorited ? dispatch(unlikePost(post)) : dispatch(likePost(post))}
            className="btn btn-naked-danger rounded-pill bg-clear high-index"
        >
            {post.favorited ? (
                <FontAwesomeIcon icon={heartSolid} className="text-danger" />
            ) : <FontAwesomeIcon icon={faHeart} />}

            <small className="text-muted m-1">{numFormatter(post.favorite_count)}</small>
        </button>
    </>)
}