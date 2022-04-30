import React from 'react'
import { Card, Image } from 'react-bootstrap'
import { ReactTinyLink } from 'react-tiny-link'
import getUrls from 'get-urls'

function MM(props) {
    let { post, expanded = false, className } = props
    let style = {
        card: {
            maxHeight: !expanded ? '350' : 'fit-content',
            overflow: 'hidden',
        },
    }
    let { entities = {}, text } = post
    let {
        media: [photo] = [],
        urls: [url],
    } = entities
    if (photo) {
        photo = <Image fluid rounded={true} src={photo.media_url_https} alt="media preview" />
    }
    if (!url) {
        // TODO see if this even necessary
        let unparsed_urls = Array.from(getUrls(text))
        if (unparsed_urls.length) {
            url = {
                expanded_url: unparsed_urls[0], // just the first one
            }
        }
    }
    if (url) {
        url = (
            <ReactTinyLink
                width="100%"
                cardSize={expanded ? 'large' : 'small'}
                autoPlay={expanded}
                showGraphic={true}
                maxLine={2}
                minLine={1}
                url={url.expanded_url}
            />
        )
    }
    if (photo || url)
        return (
            <Card className={`${className} w-100 bg-transparent`} style={style.card}>
                {photo}
                <div className="mt-1">{url}</div>
            </Card>
        )
    else return <></>
}

export default MM
