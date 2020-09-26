import React from 'react'
import WithUrls from 'comps/with-urls'

import { truncateText } from 'utils/helpers'

export default ({ post, expanded = false }) => {
    let { text } = post
    text = text || ''
    if (!expanded)
        text = truncateText(text, 5)
    text = text.replace(/@(\w+)/g, '<a class="high-index" href="/user/$1">$&</a>')
    text = text.replace(/#(\w+)/g, match =>
        (`<a class="high-index" href="/search?q=${encodeURIComponent(match)}">${match}</a>`)
    )
    return (<>
        <WithUrls>{text}</WithUrls>
    </>)
}
