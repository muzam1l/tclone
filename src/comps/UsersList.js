import React from 'react'
import FollowButton from 'comps/FollowButton'
import { Link } from 'react-router-dom'
import { ListGroup, Media, Row, Col } from 'react-bootstrap'
import UserLink from 'comps/user-link'

import { truncateText } from 'utils/helpers'

export default props => {
    let { users,
        followUser,
        unFollowUser,
        className,
        length,
        compact,
        noPop
    } = props
    return (<>
        <ListGroup className={"border-bottom " + className} variant="flush">
            {users && users.slice(0, length).map(user => {
                return (<ListGroup.Item
                    className="px-1 text-truncate"
                    action
                    key={user.screen_name}
                    as={noPop ? Link : UserLink}
                    user={user}
                    to={`/user/${user.screen_name}`}
                >
                    <Media>
                        <img
                            width={50}
                            height={50}
                            className="rounded-circle mx-1"
                            src={user.profile_image_url_https}
                            alt=''
                        />
                        <Media.Body>
                            <Row>
                                <Col className="pr-5 pr-lg-4 pr-xl-2" xs="8">
                                    <p className="text-dark mb-0 text-truncate text-capitalize font-weight-bold">{user.name}</p>
                                    <p className="text-muted text-truncate mt-n1"> @{user.screen_name}</p>
                                </Col>
                                <Col className="d-flex align-items-center justify-content-end px-1" xs="4">
                                    <FollowButton
                                        user={user}
                                        unFollowUser={unFollowUser}
                                        followUser={followUser}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                {!compact && <blockquote className="mb-0 mt-n2">{truncateText(user.description, 5)}</blockquote>}
                            </Row>
                        </Media.Body>
                    </Media>
                </ListGroup.Item>)
            })}
        </ListGroup>
    </>)
}