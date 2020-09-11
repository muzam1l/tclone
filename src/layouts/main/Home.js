import React from 'react'
import Compose from 'features/posts/Compose'
import Feed from 'features/posts/Feed'
import Heading from 'comps/Heading'
import MediaQuery from 'react-responsive'

class Home extends React.Component {
    render() {
        return (<>
            <Heading title="Home" btnLogout btnProfile />
            <MediaQuery minWidth={576}>
                <Compose className='mt-2' />
                <div style={{ height: "10px" }} className="w-100 bg-border-color border"></div>
            </MediaQuery>
            <Feed />
        </>)
    }
}

export default Home