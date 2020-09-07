import React from 'react'
import getUrls from 'get-urls'

export default ({ post }) => {
    let { text } = post
    let urls = getUrls(text)
    if (urls.size) {
        urls.forEach(url => {
            text = text.replace(url, `<a href=${url} class="text-truncate d-block" target="_blank" rel="noopener noreferrer">${url}</a>`)
        })
    }
    // let text_parts = text.split(/#\w+/g)
    // let { user_mentions, hashtags } = post.entities
    // let hlen = hashtags.length;
    return (<>
        {/* {text_parts.map((part, idx) => {
            let txt = (idx < hlen) && hashtags[idx].text
            return (<>
                {part}{txt && <Link className="text-info" to={`/search?q=%23${txt}`}>#{txt}</Link>}
            </>)
        })} */}
        <div className='w-100' dangerouslySetInnerHTML={{ __html: text }}></div>
    </>)
}
