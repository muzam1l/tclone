import {
    usersAdded,
    usersAddedDontUpdate,
    usersSelectors
} from 'features/users/usersSlice'

import { postsAdded } from './postsSlice'

export const populatePost = (post, state) => ({
    ...post,
    user: usersSelectors.selectById(state, post.user) || post.backup_user,
    retweeted_by: (post.retweeted_by && usersSelectors.selectById(state, post.retweeted_by)) || post.backup_retweeted_by,
    quoted_status: (post.quoted_status && populatePost(post.quoted_status, state))
})

export const parsePosts = (posts, { dont_dispatch_posts = false, dont_update_users = false } = {}) => dispatch => {
    try {
        posts = posts.filter(Boolean)
        if (!posts.length)
            return
        let users = posts.map(post => post.user).filter(Boolean)
        let users1 = posts.map(post => post.retweeted_status && post.retweeted_status.user)
            .filter(Boolean)
        users.push(...users1)

        // extract retweeted status, if any
        posts = posts.map(post => {
            let { retweeted_status } = post
            if (retweeted_status) {
                return ({
                    ...retweeted_status,
                    is_feed_post: post.is_feed_post,
                    is_retweeted_status: true,
                    retweeted_by: post.user,
                    created_at: post.created_at
                })
            }
            return post
        }).filter(Boolean)
        // replace users with their screen_name (selectId)
        posts = posts.map(post => ({
            ...post,
            user: post.user.screen_name,
            retweeted_by: post.retweeted_by && post.retweeted_by.screen_name,
            backup_user: post.user,
            backup_retweeted_by: post.retweeted_by
        }))

        // parse quoted posts recursively
        posts = posts.map(post => {
            if (post.quoted_status) {
                let [quote] = dispatch(parsePosts([post.quoted_status], { dont_dispatch_posts: true, dont_update_users: true }))
                post.quoted_status = quote
            }
            return post
        })

        if (!dont_dispatch_posts)
            dispatch(postsAdded(posts))
        if (dont_update_users)
            dispatch(usersAddedDontUpdate(users))
        else
            dispatch(usersAdded(users))
        return posts
    } catch (err) {
        console.log('error parsing', err)
        throw err
    }
}
