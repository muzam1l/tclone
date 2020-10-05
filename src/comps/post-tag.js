import React from 'react'
import UserLink from 'comps/user-link'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default ({ post, no_reply_tag = false }) => {
    const { user: authUser } = useSelector(state => state.auth)
    let { retweeted_by } = post

    let name1 = authUser && (authUser.screen_name === post.user.screen_name) ? 'You' : '@' + post.user.screen_name
    let name2 = authUser && (authUser.screen_name === post.in_reply_to_screen_name) ? 'you' : '@' + post.in_reply_to_screen_name
    let reply_tag_text = `${name1} replied to ${name2}`
    return <>
        {retweeted_by && (no_reply_tag = true) && (
            <UserLink
                user={retweeted_by}
                className="text-muted"
                to={`/user/${retweeted_by.screen_name}`}
            >
                <small>@{retweeted_by.screen_name} retweeted</small>
            </UserLink>
        )}
        {!no_reply_tag && post.in_reply_to_screen_name && (
            <Link
                className="text-muted"
                to={`/post/${post.in_reply_to_status_id_str}`}
            >
                <small>{reply_tag_text}</small>
            </Link>
        )}
    </>
}