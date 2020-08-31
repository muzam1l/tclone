import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage'
import { faSmile } from '@fortawesome/free-regular-svg-icons/faSmile'
import { faImages } from '@fortawesome/free-regular-svg-icons/faImages'

import { connect } from 'react-redux'
import { composePost } from 'features/posts/postsSlice'
import { withRouter } from 'react-router-dom'

import { Media } from 'react-bootstrap'

class Compose extends React.Component {
    state = {
        editor_text: '',
        active: false,
        pending: false
    }
    handleChange(e) {
        let ta = e.target
        if (!this.ta)
            this.ta = ta
        this.setState({
            editor_text: ta.value,
            active: ta.value.length > 0
        })
        this.resizeTa()
    }
    handleChange = this.handleChange.bind(this);
    handleSubmit = async (e) => {
        if (!this.state.active)
            return;
        // some more checks
        this.setState({ active: false })
        await this.props.composePost({
            "text": this.state.editor_text
        })
        this.setState({ editor_text: '' })
        this.resizeTa()
        let { posts: { compose_status } } = this.props
        if (compose_status === "error") {
            alert('Post could not be submitted, try again')
        }
    }
    resizeTa() {
        // for auto resizing of text area
        if (this.ta) {
            this.ta.style.height = 'auto';
            this.ta.style.height = (this.ta.scrollHeight) + 'px';
        }
    }
    render() {
        let { auth, className } = this.props;
        let { user } = auth
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
export default connect(state => state, { composePost })(withRouter(Compose))
