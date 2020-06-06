import React from 'react'


export default function (color = 'current') {
    return (
        <div className="spinner-border">
            <style>{`
            @keyframes spinner-border {
                to {
                    -webkit-transform: rotate(360deg);
                    transform: rotate(360deg);
                }
            }
            @-webkit-keyframes spinner-border {
                to {
                    -webkit-transform: rotate(360deg);
                    transform: rotate(360deg);
                }
            }
            .spinner-border {
                display: inline-block;
                width: 1.5rem;
                height: 1.51rem;
                vertical-align: text-bottom;
                border: 0.25em solid currentColor;
                border-right-color: transparent;
                border-radius: 50%;
                -webkit-animation: spinner-border .75s linear infinite;
                animation: spinner-border .75s linear infinite;
                border-width: 0.2em;
            }
            `}</style>
        </div>
    )
}