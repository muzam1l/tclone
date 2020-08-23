import React from 'react'
import Compose from 'comps/Compose'
import Posts from 'comps/Posts'
import { Col } from 'react-bootstrap'
import Heading from 'comps/Heading'

class Home extends React.Component {
    render() {
        return (
            <Col className="border">
                <Heading title="Home" btnLogout={true} />
                <Compose className='mt-2' />
                <div style={{ height: "10px" }} className="w-100 bg-border-color border"></div>
                <Posts url='/api/home_timeline' />
            </Col>
        )
    }
}

export default Home