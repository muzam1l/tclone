import React from 'react'
import { useState, useRef } from 'react'
import { Modal, Media, Alert, ProgressBar, Popover, OverlayTrigger } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage'
import { faSmile } from '@fortawesome/free-regular-svg-icons/faSmile'
import { faImages } from '@fortawesome/free-regular-svg-icons/faImages'

import { useSelector, useDispatch } from 'react-redux'
import { composePost, selectPostById } from './postsSlice'
import { useEffect } from 'react'

import QuotedPost from 'comps/quoted-post'

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

export default props => {
    let location = useLocation()
    let history = useHistory()
    let dispatch = useDispatch()

    let { user } = useSelector(state => state.auth);
    let quoteId = new URLSearchParams(location.search).get("quote");
    let quotePost = useSelector(state => selectPostById(state, quoteId));

    let { compose_status: status } = useSelector(state => state.posts)

    let ta = useRef(null)
    const [height, setHeight] = useState("auto")
    const [editor_text, setText] = useState(``)
    const [active, setActive] = useState(false)


    let [progress, setProgress] = useState(10)

    let dirtyProgress = () => {
        if (progress < 90)
            setTimeout(() => { setProgress(90) }, 200)
        return true
    }
    const handleClose = () => {
        if (status !== 'error') {
            setText('')
            setActive(false)
            history.goBack();
        }
    }
    let resizeTa = () => {
        if (ta.current) {
            // let height = ta.current.scrollHeight;
            // cur.height = 'auto';
            // cur.height = (cur.scrollHeight) + 'px';
            setHeight('auto')
        }
    }
    useEffect(() => {
        if (ta.current) {
            let height = ta.current.scrollHeight;
            setHeight(height + 'px')
        }
    }, [editor_text])
    let handleChange = e => {
        resizeTa()
        let ta = e.target
        setText(ta.value)
        setActive(ta.value.length > 0)
    }
    let handleSubmit = async (e) => {
        if (!active)
            return;
        // some more checks
        setActive(false)
        let body = {
            "text": editor_text
        }
        if (quotePost) {
            body = {
                ...body,
                is_quote_status: true,
                quoted_status_id: quotePost.id,
                quoted_status_id_str: quotePost.id_str,
                quoted_status: quotePost._id
            }
        }
        let action = await dispatch(composePost(body))
        setActive(true)
        if (action.type === 'posts/composePost/fulfilled')
            handleClose()
    }
    let addEmoji = emoji => {
        setText(text => (text + emoji.native))
    }
    const picker = (
        <Popover id="popover-basic">
            <Picker
                onSelect={addEmoji}
                color="#55afb0"
                sheetSize={32}
                emoji='point_up'
                title="Pick your emoji"
                set='twitter'
            />
        </Popover>
    );

    return (
        <>
            <Modal
                className="p-0"
                size="lg"
                scrollable={true}
                show={true}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton className="py-2">
                    <Modal.Title><small className="font-weight-bold">Compose post</small></Modal.Title>
                </Modal.Header>
                {status === 'pending' && (
                    dirtyProgress() &&
                    <ProgressBar className="rounded-0" now={progress} />
                )}
                {status === "error" && (
                    <Alert variant="danger" className="font-weight-bold text-white">
                        Error submiting post, try again!
                    </Alert>
                )}
                <Modal.Body className="pt-1 pb-0">
                    <Media className='h-100 w-100'>
                        <img
                            className="rounded-circle"
                            src={user.default_profile_image ? '/img/default-profile-vector.svg' : user.profile_image_url_https}
                            alt=""
                            width={50}
                            height={50}
                        />
                        <Media.Body className="h-100 w-50">
                            <textarea
                                ref={ta}
                                className="w-100 p-2 pb-5"
                                style={{
                                    height,
                                }}
                                name="text"
                                onChange={handleChange}
                                value={editor_text}
                                placeholder="What's happening?"
                            >
                            </textarea>
                            <QuotedPost className="mb-2 mt-n5" post={quotePost} />
                        </Media.Body>
                    </Media>
                </Modal.Body>
                <Modal.Footer className="py-1">
                    <div className="d-flex w-100 justify-content-between align-items-center">
                        <div style={{ fontSize: "1.5em" }}>
                            <OverlayTrigger rootClose={true} trigger="click" placement="auto-start" overlay={picker}>
                                <button className="text-primary btn btn-lg rounded-circle btn-naked-primary p-2">
                                    <FontAwesomeIcon size="lg" icon={faSmile} />
                                </button>
                            </OverlayTrigger>
                            <button className="disabled text-primary btn btn-lg rounded-circle btn-naked-primary p-2">
                                <FontAwesomeIcon size="lg" icon={faImage} />
                            </button>
                            <button className="disabled text-primary btn btn-lg rounded-circle btn-naked-primary p-2">
                                <FontAwesomeIcon size="lg" icon={faImages} />
                            </button>
                        </div>
                        <div className="right">
                            <button
                                onClick={handleSubmit}
                                disabled={!active}
                                className="btn btn-primary rounded-pill px-3 py-2 font-weight-bold">
                                Tweet
                            </button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}