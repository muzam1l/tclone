import React from 'react'
import { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'


export default (
    { header, body, confirmText, cancelText, handleConfirm, handleCancel, delay, ...props }
) => {
    let [defaultShow, setShow] = useState(false)

    let onHide = () => {
        setShow(false);
        handleCancel && handleCancel();
    }
    let onConfirm = () => {
        handleConfirm && handleConfirm();
        setShow(false)
        props.onHide ? props.onHide() : handleCancel && handleCancel()
    }
    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, delay || 250)
        // eslint-disable-next-line
    }, [])
    return (<>
        <Modal
            size="sm"
            scrollable={true}
            show={defaultShow}
            onHide={handleCancel || onHide}
            keyboard={true}
            {...props}
        >
            <Modal.Body className="d-flex flex-column align-items-center mb-2">
                <h4 className="font-weight-bold mx-1">{header || "Confirm"}</h4>
                <p className="text-muted mx-1">{body || "Please confirm you action to proceed or click anywhere outside or Esc or button below to cancel"}</p>
                <div className="d-flex w-100 justify-content-between">
                    <button
                        onClick={handleCancel || props.onHide || onHide}
                        className="w-50 mx-2 px-3 btn btn-secondary rounded-pill font-weight-bold"
                    >{cancelText || "Cancel"}</button>
                    <button
                        onClick={onConfirm}
                        className="w-50 mx-2 px-3 btn btn-primary rounded-pill font-weight-bold"
                    >{confirmText || "Confirm"}</button>
                </div>
            </Modal.Body>
        </Modal>
    </>)
}