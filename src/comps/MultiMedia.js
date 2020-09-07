import React from 'react'
import { Card, Image } from 'react-bootstrap'
import { ReactTinyLink } from 'react-tiny-link'
import getUrls from 'get-urls'
import { useMediaQuery } from 'react-responsive'

function MM(props) {
    const isMobile = useMediaQuery({ query: '(max-width: 540px)' })

    let { post, expanded = false, className } = props;
    let style = {
        card: {
            maxHeight: !expanded ? "300px" : "fit-content",
            overflow: "hidden"
        }
    }
    let { entities = {}, text } = post
    let { media: [photo] = [], urls: [url] } = entities;
    if (photo) {
        photo = (<Image
            fluid
            rounded={true}
            src={photo.media_url_https}
            alt='media preview' />
        )
    }
    if (!url) {
        let unparsed_urls = Array.from(getUrls(text))
        if (unparsed_urls.length) {
            url = {
                expanded_url: unparsed_urls[0]
            }
        }
    }
    if (url) {
        url = <ReactTinyLink
            width="100%"
            cardSize={isMobile ? 'large' : "small"}
            showGraphic={true}
            maxLine={2}
            minLine={1}
            url={url.expanded_url}
        />
    }
    if (photo || url)
        return (
            <Card className={`${className} w-100 bg-transparent`} style={style.card}>
                {photo}
                <div className="mt-1">{url}</div>
            </Card>
        )
    else
        return <></>
}

export default MM