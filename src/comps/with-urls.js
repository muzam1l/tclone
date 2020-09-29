import React from 'react'
import { unescape } from 'html-escaper';
import getUrls from 'get-urls'
import DOMPurify from 'dompurify';

export default ({ children }) => {
    if (!children || !children.toString)
        return null
    let text = children.toString() //should be already ESCAPED
    text = DOMPurify.sanitize(unescape(text), { ALLOWED_TAGS: ['b'] });
    let urls = getUrls(text)
    if (urls.size) {
        urls.forEach(url => {
            if (!(url.startsWith('http://') || url.startsWith('https://')))
                url = 'https://' + url
            let orig = url.startsWith('https://') ? url.slice(8) : url.slice(7)
            text = text.replace(orig, `<a href=${url} class="text-truncate d-block-inline" target="_blank" rel="noopener noreferrer">${orig}</a>`)
        })
    }
    text = text.replace(/@(\w+)/g, '<a class="high-index mr-1" href="/user/$1"> $& </a>')
    text = text.replace(/#(\w+)/g, match =>
        (`<a class="high-index mr-1" href="/search?q=${encodeURIComponent(match)}"> ${match} </a>`)
    )
    text = text.replace(/\n/g, '<div style="flex-basis: 100%;width: 0px;height: 0px;overflow: hidden;"></div>')
    if (text.trim() === '' || text.replace(/<b>/g, '').replace(/<\/b> /g, '').trim() === '')
        text = 'null'
    return (<>
        <div className='mw-100 d-flex flex-wrap' dangerouslySetInnerHTML={{ __html: text }}></div>
        {/* <div className='mw-100 d-flex flex-column'>{text}</div> */}
    </>)
}