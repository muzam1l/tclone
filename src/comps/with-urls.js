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
                class: "text-truncate d-block-inline",
            },
            // any link above 30 characters will be truncated
            truncate: 30,
        },
        // and extensions
        extensions: [
            // an extension for hashtag search
            {
                test: /#(\w|_)+/gi,
                transform: (string) =>
                    `<a class="high-index mr-1" href="/search?q=${encodeURIComponent(string)}"> ${string} </a>`,
            },
            // an extension for mentions
            {
                test: /@(\w|_)+/gi,
                transform: (string) =>
                    `<a class="high-index mr-1" href="/user/${string.slice(1)}">${string}</a>`,
            },
        ],
    });
    //Dirty UI fix
    text = text.replace(/\n/g, '<div style="flex-basis: 100%;width: 0px;height: 0px;overflow: hidden;"></div>')

    // should not pass for a good code beforehand
    if (DOMPurify.sanitize(text, { ALLOWED_TAGS: [] }).trim() === '')
        text = 'null'
    return (<>
        <div className='mw-100 d-flex flex-wrap' dangerouslySetInnerHTML={{ __html: text }}></div>
    </>)
}