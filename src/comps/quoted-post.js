import React from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Link } from 'react-router-dom'
import { Row, Card, Figure } from 'react-bootstrap'
import MultiMedia from 'comps/MultiMedia'
import PostText from 'comps/PostText'
import UserLink from 'comps/user-link'

export default ({ post, className, expanded = false }) => {
    if (!post)
        return <></>
    return (<>
        <Card className={`${className} w-100 border bg-white overflow-hidden`}>
            <Link className="stretched-link" to={`/post/${post.id_str}`}></Link>
            <div className="p-2">
                <Row className="d-flex align-items-center">
                    <UserLink
                        user={post.user}
                        className="rounded-circle d-block"
                        to={`/user/${post.user.screen_name}`}
                    >
                        <Figure
                            className="bg-border-color rounded-circle overflow-hidden mr-1 mb-0"
                            style={{ height: "25px", width: "25px" }}
                        >
                            <Figure.Image
                                src={(post.user.default_profile_image) ? '/img/default-profile-vector.svg' : post.user.profile_image_url_https}
                                className="w-100 h-100"
                            />
                        </Figure>
                    </UserLink>
                    <UserLink
                        user={post.user}
                        to={`/user/${post.user.screen_name}`}
                        className="text-dark font-weight-bold mr-1"
                    >{post.user.name}</UserLink>
                    {/* tick */}
                    <span className="text-muted">@{post.user.screen_name}</span>
                    <pre className="m-0 text-muted">{" - "}</pre>
                    <span className="text-muted"><ReactTimeAgo date={Date.parse(post.created_at)} timeStyle="twitter" /></span>
                </Row>
                <Row className=""><blockquote className="mb-1">
                    <PostText to={`/post/${post.id_str}`} expanded={expanded} post={post} />
                </blockquote></Row>

            </div>
            <Row>
                <MultiMedia
                    // expanded={expanded}
                    className="rounded-0"
                    post={post} />
            </Row>
        </Card>
    </>)
}