import React from 'react'
import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'

import { useHistory } from 'react-router-dom'
import { Form, InputGroup } from 'react-bootstrap'

function SearchBar(props) {
    let history = useHistory()
    let [value, setValue] = useState('')
    let handleChange = ({ target: { value } }) => {
        setValue(value)
    }
    let handleSubmit = (e) => {
        e.preventDefault();
        let value = e.target.search.value;
        value = encodeURIComponent(value);
        history.push(`/search?q=${value}`)
    }
    let { className } = props;
    return (
        <Form className={className} onSubmit={handleSubmit} role="search">
            <Form.Group className="w-100 mb-0 rounded-pill border-0 px-3"
                style={{ backgroundColor: "rgb(233,236,239)" }}>
                <InputGroup className="w-100">
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <FontAwesomeIcon icon={faSearch} />
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        value={value}
                        onChange={handleChange}
                        style={{ backgroundColor: "rgb(233,236,239)" }}
                        size="sm"
                        type="search"
                        placeholder="Search for posts, #hastags or @users"
                        name="search"
                        id="tsearch"
                    />
                </InputGroup>
            </Form.Group>
        </Form>
    )
}
export default SearchBar;