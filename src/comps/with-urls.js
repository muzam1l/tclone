import React from 'react'
import { unescape } from 'html-escaper';
import anchorme from "anchorme";
import DOMPurify from 'dompurify';

export default ({ children }) => {
    if (!children || !children.toString)
        return null
    let text = children.toString() //can be escaped too
    text = DOMPurify.sanitize(unescape(text), { ALLOWED_TAGS: ['b'] });
    text = anchorme({
        input: text,
        // use some options
        options: {
            attributes: {
                target: "_blank",
                rel: "noopener noreferrer",
                class: "text-wrap break-all",
            },
            // any link above 50 characters will be truncated
            truncate: 50,
        },
        // and extensions
        extensions: [
            // an extension for hashtag search
            {
                test: /#(\w|_)+/gi,
                transform: (string) =>
                    `<a class="high-index" href="/search?q=${encodeURIComponent(string)}"> ${string} </a>`,
            },
            // an extension for mentions
            {
                test: /@(\w|_)+/gi,
                transform: (string) =>
                    `<a class="high-index" href="/user/${string.slice(1)}">${string}</a>`,
            },
        ],
    });

    // should not pass for a good code beforehand
    if (DOMPurify.sanitize(text, { ALLOWED_TAGS: [] }).trim() === '')
        text = 'null'
    return (<>
        <div className='mw-100 overflow-hidden' dangerouslySetInnerHTML={{ __html: text }}></div>
    </>)
}