import React from 'react'
import WithUrls from 'comps/with-urls'
import { truncateText } from 'utils/helpers'

export default ({ post, expanded = false }) => {
    let { text } = post
    if (!expanded)
        text = truncateText(text, 5)
    return (<>
        <WithUrls>{text}</WithUrls>
    </>)
}
