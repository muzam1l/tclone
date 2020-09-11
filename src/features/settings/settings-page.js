import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Profile from './profile-modal'

export default props => {
    return (<>
        <Switch>
            <Route path='/settings/profile' component={Profile} />
        </Switch>
        <div className="message font-weight-bold">Settings coming in future</div>
    </>)
}