import React from 'react'
import WithUrls from 'comps/with-urls'

export default ({ post }) => {
    let { text } = post
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
        <WithUrls>{text}</WithUrls>
    </>)
}
