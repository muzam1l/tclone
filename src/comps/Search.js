import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'

import { useHistory } from 'react-router-dom'

/**
 * Search
 * has no margin, embed and place it accordingly
 */

function Search(props) {
    let history = useHistory();
    let handleSubmit = (e) => {
        e.preventDefault();
        let val = window.encodeURIComponent(e.target.search.value);
        history.push(`/search?q=${val}`);
    }
    let style = {
        search: {
            width: '100%',
            height: props.height || 'unset',
            padding: '.3em .5em',
            backgroundColor: 'rgb(230, 236, 240)',
            borderRadius: '10em',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        svg: {
            fontSize: '1.2em',
            marginLeft: '.5em',
        },
        form: {
            width: '100%',
            height: '100%',
            margin: 'auto .25em',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        input: {
            border: 'none',
            backgroundColor: 'inherit',
            margin: '.25em .5em',
            fontFamily: 'inherit',
            fontSize: '1em',
            width: '90%',
            height: '100%'
        }
    }
    return (
        <div style={style.search}>
            <FontAwesomeIcon style={style.svg} icon={faSearch} />
            <form style={style.form} onSubmit={handleSubmit} action="#" role="search">
                <input
                    style={style.input}
                    placeholder="Search works 😉"
                    type="search" name="search" id="tsearch" />
            </form>
        </div>
    )
}
export default Search;