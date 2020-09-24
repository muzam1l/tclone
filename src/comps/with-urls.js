import React from 'react'
import getUrls from 'get-urls'

export default ({ children }) => {
    if (!children || !children.toString)
        return null
    let text = children.toString()
    let urls = getUrls(text)
    if (urls.size) {
        urls.forEach(url => {
            text = text.replace(url, `<a href=${url} class="text-truncate d-block" target="_blank" rel="noopener noreferrer">${url}</a>`)
        })
    }
    return (<>
        <div className='mw-100 d-flex flex-column' dangerouslySetInnerHTML={{ __html: text }}></div>
    </>)
}