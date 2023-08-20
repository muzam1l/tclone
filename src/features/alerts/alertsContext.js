import React from 'react'
import { useState, useCallback } from 'react'

import Prompt from 'comps/prompt-modal'

import { useSelector } from 'react-redux'
import { askPermission, subscribeUserToPush } from '../../subscription'
import { useHistory } from 'react-router-dom'

const AlertsContext = React.createContext()
const AlertsProvider = ({ children, ...props }) => {
    const history = useHistory()

    /*Detect incomplete profile on basis of description */
    const { user: { description } } = useSelector(state => state.auth)

    let [showNotifPermission, setNotifPermission] = useState(false)

    // checks if there are already modals active
    const isAnyModal = useCallback(() => {
        if (showNotifPermission ||
            history.location.pathname === '/settings/profile' ||
            history.location.pathname === '/compose/post'
        )  //similarly for others
            return true
        return false
    }, [showNotifPermission, history.location.pathname])
    const handlePermission = (result) => {
        console.log('Permission result: ', result)
        if (result === true)
            subscribeUserToPush()
    }

    // kinda apis for this provider
    const ensureNotifPermission = () => {
        const delay = 3000
        setTimeout(() => {
            /*May be dont ask if it denied already, but lets just keep it for now (¬‿¬)*/
            const isNotificationPermitted = Notification.permission === 'granted'
            if (!isAnyModal() && !isNotificationPermitted)
                setNotifPermission(true)
        }, delay)
    }
    const ensureCompleteProfile = useCallback(() => {
        const delay = 500
        setTimeout(() => {
            if (!isAnyModal() && !description)
                history.push('/settings/profile?redirected=true')
        }, delay);
    }, [description, history, isAnyModal])
    return (<AlertsContext.Provider value={{
        ensureNotifPermission,
        ensureCompleteProfile
    }} {...props}>
        {children}
        {/* notification prompt */}
        <Prompt
            show={showNotifPermission}
            header="Allow push notifications!"
            body="I will not bug you often, but lets try having notifications on user mentions or follows to test interactivity on this project"
            cancelText="Maybe later"
            confirmText="Bring it on"
            handleConfirm={() => askPermission().then(handlePermission)}
            handleCancel={() => { setNotifPermission(false) }}
        />
    </AlertsContext.Provider>)
}

const useAlerts = () => React.useContext(AlertsContext)
//for functional components

export { AlertsProvider, useAlerts, AlertsContext } 