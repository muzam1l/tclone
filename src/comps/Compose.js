import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage'
import { faSmile } from '@fortawesome/free-regular-svg-icons/faSmile'
import { faImages } from '@fortawesome/free-regular-svg-icons/faImages'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { Media } from 'react-bootstrap'

class Compose extends React.Component {
    state = {
        editor_text: '',
        lines: 1,
        active: false,
    }
    handleChange(e) {
        let ta = e.target
        this.setState({
            editor_text: ta.value,
            active: ta.value.length > 0
        })
        // for auto resizing of text area
        ta.style.height = 'auto';
        ta.style.height = (ta.scrollHeight) + 'px';
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
            this.props.history.push({ pathname: "/explore" });
            this.props.history.replace({ pathname: "/" });
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
        let { user, className } = this.props;
        return (
            <div className={"p-2 " + className}>
                <Media>
                    <img
                        className="rounded-circle"
                        src={user.default_profile_image ? 'img/default-profile-vector.svg' : user.profile_image_url_https}
                        alt=""
                        width={50}
                        height={50}
                    />
                    <Media.Body>
                        <textarea
                            className="w-100 p-2"
                            style={{ fontSize: "1.25em", fontWeight: "400" }}
                            name="text"
                            onChange={this.handleChange}
                            onKeyPress={this.handleLine}
                            value={this.state.editor_text}
                            placeholder="What's happening?"
                        >
                        </textarea>
                        <div className="border-top d-flex justify-content-between align-items-center pt-2">
                            <div style={{ fontSize: "1.5em" }}>
                                <button className="disabled text-primary btn btn-lg rounded-circle btn-naked-primary p-2">
                                    <FontAwesomeIcon size="lg" icon={faImage} />
                                </button>
                                <button className="disabled text-primary btn btn-lg rounded-circle btn-naked-primary p-2">
                                    <FontAwesomeIcon size="lg" icon={faImages} />
                                </button>
                                <button className="disabled text-primary btn btn-lg rounded-circle btn-naked-primary p-2">
                                    <FontAwesomeIcon size="lg" icon={faSmile} />
                                </button>
                            </div>
                            <div className="right">
                                <button
                                    onClick={this.handleSubmit}
                                    disabled={!this.state.active}
                                    className="btn btn-primary rounded-pill px-3 py-2 font-weight-bold">
                                    Tweet
                                </button>
                            </div>
                        </div>
                    </Media.Body>
                </Media>
            </div>
        )
    }
}
export default connect(state => state.auth, {})(withRouter(Compose))
