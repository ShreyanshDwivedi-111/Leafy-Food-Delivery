import React from 'react';
import "./Modal.css";
import { TrashIcon } from "@heroicons/react/24/outline";

const Modal = (props) => {
    const handleCancel = () => {
        props.closeModal(false);
    }
    const handleConfirm = () => {
        // Check if a custom function is provided via props
        if (props.customFunction && typeof props.customFunction === 'function') {
            // Call the custom function
            props.customFunction();
        }
        // Call closeModal with false
        props.closeModal(false);
    }

  return (
    <div className='modal-container'>
        <div className="modal-icon-conatiner">
            <TrashIcon className='modal-icon'/>
        </div>
        <p>Are you sure you want to delete this record?</p>
        <div className="modal-buttons">
            <button className='modal-cancel secondary-btn' onClick={handleCancel}>Cancel</button>
            <button className='modal-confirm danger-btn' onClick={handleConfirm}>Confrim</button>
        </div>
    </div>
  )
}

export default Modal;