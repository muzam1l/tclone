import React from 'react'


export default function (color) {
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
            .spinner {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                color: rgb(29, 161, 242);
                margin-top: 1em;
            } 
            `}</style>
        </div>
    )
}