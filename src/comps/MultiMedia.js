import React from 'react'
import { Card, Image } from 'react-bootstrap'

function MM(props) {
    let { entities, options = {}, className } = props;
    let { expanded = false } = options
    let style = {
        card: {
            maxHeight: !expanded ? "300px" : "fit-content",
            overflow: "hidden"
        }
    }
    let { media: [photo] = [] } = entities;
    let content
    if (photo) {
        content = (<Image
            fluid
            rounded={true}
            src={photo.media_url_https}
            alt='media preview' />
        )
    }
    if (entities.media && entities.media.length)
        return (
            <Card className={`${className} w-100`} style={style.card}>
                {content}
            </Card>
        )
    else
        return null
}

export default MM