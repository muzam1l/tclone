import React from 'react'
import { useCallback } from 'react'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useAlerts } from 'features/alerts/alertsContext'

export default props => {
    let { isAuthenticated, user: AuthUser } = useSelector(state => state.auth)
    const alerts = useAlerts()
    let ensureNotifPermission;
    /**
     * dirty fix, as in unauthenticated, this button wont be visble (hence no handleFollow call, below)
     * but body still executes, giving error
     */
    if (alerts)
        ensureNotifPermission = alerts.ensureNotifPermission

    let { followUser, user, unFollowUser } = props
    let { following } = user;
    let [hoverText, setHoverText] = React.useState('')
    let [hoverVariant, setHoverVariant] = React.useState('')
    let handleFollow = async e => {
        e.preventDefault()
        followUser(user.screen_name)
        ensureNotifPermission()
    }
    let handleUnFollow = async e => {
        e.preventDefault()
        unFollowUser(user.screen_name)
        setHoverText("Unfollowed")
    }
    let handleMouseEnter = useCallback(async _ => {
        following && setHoverText("Unfollow")
        following && setHoverVariant('danger')
    }, [following])
    let handleMouseLeave = async _ => {
        setHoverText('')
        setHoverVariant('')
    }
    let text = !following ? "Follow" : "Following"
    let variant = following ? "primary" : "outline-primary"
    if (!isAuthenticated
        || (AuthUser && AuthUser.screen_name === user.screen_name))
        return <></>
    return (<>
        <Button
            onClick={following ? handleUnFollow : handleFollow}
            variant={hoverVariant || variant}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="rounded-pill px-3 py-1 font-weight-bold">
            <span>{hoverText || text}</span>
        </Button>
    </>)
}