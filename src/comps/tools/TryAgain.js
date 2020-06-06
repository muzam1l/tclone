import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons/faRedo'

function TryAgain(props) {
    let style = {
        main: {
            'display': 'flex',
            'flexDirection': 'row',
            'justifyContent': 'center',
            'color': 'rgb(29, 161, 242)',
            'marginTop': '1em'
        },
        detail: {
            'display': 'flex',
            'flexDirection': 'column',
            'alignItems': 'center'
        },
        txt: {
            'color': 'rgb(101, 119, 134)'
        },
        btnTxt: {
            'fontWeight': '700',
            'marginLeft': '1em'
        },
        btn: {
            margin: '1.5em',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            color: 'white',
            backgroundColor: 'rgb(29, 161, 242)',
            borderRadius: '10em',
            padding: '.7em 1em',
        }
    }
    return (
        <div style={style.main}>
            <div style={style.detail}>
                <div style={style.txt}>
                    Something went wrong
                </div>
                <div style={style.btn} className='btn' onClick={props.fn}>
                    <FontAwesomeIcon icon={faRedo} />
                    <div style={style.btnTxt}>Try again</div>
                </div>
            </div>
        </div>
    )
}
export default TryAgain;