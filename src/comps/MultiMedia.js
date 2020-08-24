import React from 'react'
import { Card } from 'react-bootstrap'

function MM(props) {
    let { entities } = props;
    // returns just thumb for now
    //TODO make it work for all
    if (entities.media && entities.media.length)
        return (
            <Card className="w-100">
                {(entities.media[0].type === "photo") ? (
                    <Card.Img
                        src={entities.media[0].media_url_https}
                        alt='media preview' />
                ) : undefined}
            </Card>
        )
    else
        return null
}

export default MM