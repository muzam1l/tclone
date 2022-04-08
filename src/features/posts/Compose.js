import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage'
import { faSmile } from '@fortawesome/free-regular-svg-icons/faSmile'

import { connect } from 'react-redux'
import { composePost } from 'features/posts/postsSlice'
import { withRouter, Link } from 'react-router-dom'

import { Media } from 'react-bootstrap'
import { AlertsContext } from 'features/alerts/alertsContext'

import DOMPurify from 'dompurify'
import { filterInput } from 'utils/helpers'

class Compose extends React.Component {
    static contextType = AlertsContext
    state = {
        editor_text: '',
        active: false,
        pending: false,
    }
    handleChange(e) {
        let ta = e.target
        if (!this.ta) this.ta = ta
        let text = ta.value
        this.setState({
            editor_text: text,
            active: this.isValid(text),
        })
        this.resizeTa()
    }
    isValid(text = '') {
        return Boolean(DOMPurify.sanitize(text, { ALLOWED_TAGS: [] }).trim().length > 0)
    }
    // eslint-disable-next-line no-dupe-class-members
    handleChange = this.handleChange.bind(this)
    handleSubmit = async e => {
        if (!this.state.active) return
        let text = this.state.editor_text.trim()
        try {
            text = filterInput(this.state.editor_text, 'html', {
                max_length: 500,
                identifier: 'Post',
            })
        } catch (err) {
            return alert(err.message)
        }
        this.setState({ active: false })
        let body = {
            text,
        }
        await this.props.composePost({ body })
        this.setState({ editor_text: '' })
        this.resizeTa()
        let {
            posts: { compose_status },
        } = this.props
        if (compose_status === 'error') {
            alert('Post could not be submitted, try again')
        } else this.context.ensureNotifPermission()
    }
    resizeTa() {
        // for auto resizing of text area
        if (this.ta) {
            this.ta.style.height = 'auto'
            this.ta.style.height = this.ta.scrollHeight + 'px'
        }
    }
    render() {
        let { auth, className } = this.props
        let { user } = auth
        return (
            <div className={'p-2 ' + className}>
                <Media>
                    <Link className="rounded-circle" to={`/user/${user.screen_name}`}>
                        <img
                            className="rounded-circle"
                            src={
                                user.default_profile_image
                                    ? '/img/default-profile-vector.svg'
                                    : user.profile_image_url_https
                            }
                            alt=""
                            width={50}
                            height={50}
                        />
                    </Link>
                    <Media.Body>
                        <textarea
                            className="w-100 p-2"
                            style={{ maxHeight: '80vh' }}
                            name="text"
                            onChange={this.handleChange}
                            onKeyPress={this.handleLine}
                            value={this.state.editor_text}
                            placeholder="What's happening?"
                        ></textarea>
                        <div className="border-top d-flex justify-content-between align-items-center pt-2">
                            <div style={{ fontSize: '1.5em' }}>
                                <Link
                                    className="text-primary btn btn-lg rounded-circle btn-naked-primary p-2"
                                    to="/compose/post"
                                >
                                    <FontAwesomeIcon size="lg" icon={faSmile} />
                                </Link>
                                <button className="disabled text-primary btn btn-lg rounded-circle btn-naked-primary p-2">
                                    <FontAwesomeIcon size="lg" icon={faImage} />
                                </button>
                            </div>
                            <div className="right">
                                <button
                                    onClick={this.handleSubmit}
                                    disabled={!this.state.active}
                                    className="btn btn-primary rounded-pill px-3 py-2 font-weight-bold"
                                >
                                    Post
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
