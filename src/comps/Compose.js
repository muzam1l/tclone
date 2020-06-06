import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage'
import { faSmile } from '@fortawesome/free-regular-svg-icons/faSmile'
import { faImages } from '@fortawesome/free-regular-svg-icons/faImages'
import { faCircle } from '@fortawesome/free-regular-svg-icons/faCircle'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faUserAstronaut } from '@fortawesome/free-solid-svg-icons/faUserAstronaut'

import { AuthContext } from '../utils/context/auth'

import './Compose.css'
class Compose extends React.Component {
    static contextType = AuthContext;
    state = {
        editor_text: '',
        lines: 1,
        active: false,
    }
    handleChange(e) {
        this.setState({
            editor_text: e.target.value
        })
        let newlines = this.count(e.target.value, '\n');
        //seperate one for maybe performance
        this.setState({
            lines: newlines + 1,
            active: e.target.value.length > 0
        })
    }
    handleChange = this.handleChange.bind(this);
    handleSubmit = async (click) => {
        if (!this.state.active)
            return;
        // some more checks
        this.setState({ active: false })
        let res = await fetch('/api/post?token=test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "text": this.state.editor_text
            }),
        })
        if (res.ok) {
            // let data = await res.json();
            window.location.reload();
        }
        else
            alert('could not post your tweet, try again')
    }
    count(str, char) {
        let coun = 0;
        for (let charAt of str) {
            if (charAt === char[0]) {
                coun++;
            }
        }
        return coun;
    }
    render() {
        let user = this.context.user;
        return (
            <div className="Compose">
                <div className="media">
                    <div className="img">
                        <img src={user.default_profile_image ?
                            'img/default-profile-vector.svg' :
                            this.context.user.profile_image_url_https} alt="" />
                    </div>
                </div>
                <div className="container">
                    {/* editor */}
                    <div className="editor">
                        <textarea
                            name="text"
                            onChange={this.handleChange}
                            onKeyPress={this.handleLine}
                            value={this.state.editor_text}
                            placeholder="What's happening?"
                            rows={this.state.lines}>
                        </textarea>
                    </div>
                    <div className="belower">
                        <div className="left">
                            <button className="btn">
                                <FontAwesomeIcon icon={faImage} />
                            </button>
                            <button className="btn">
                                <FontAwesomeIcon icon={faImages} />
                            </button>
                            <button className="btn">
                                <FontAwesomeIcon icon={faSmile} />
                            </button>
                        </div>
                        <div className="right">
                            <span
                                style={!this.state.active ? { display: 'none' } : null}
                                className="progress">
                                <FontAwesomeIcon icon={faCircle} size="lg" />
                            </span>
                            <button
                                style={!this.state.active ? { display: 'none' } : null}
                                className="btn">
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                            <button
                                onClick={this.handleSubmit}
                                style={!this.state.active ? { opacity: .5 } : null}
                                className="btn submit">
                                Tweet
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Compose
