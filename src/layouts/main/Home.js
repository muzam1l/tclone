import React from 'react'
import Compose from 'features/posts/Compose'
import Feed from 'features/posts/Feed'
import Heading from 'comps/Heading'

class Home extends React.Component {
    render() {
        return (<>
            <Heading title="Home" btnLogout />
            <Compose className='mt-2' />
            <div style={{ height: "10px" }} className="w-100 bg-border-color border"></div>
            <Feed />
        </>)
    }
}

export default Home