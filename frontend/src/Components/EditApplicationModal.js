import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { IoIosCloseCircleOutline } from "react-icons/io";
import { setApplicationNo } from '../store/applicationNoSlice';
import Loading from './Loading';
import Error from './Error';
import services from '../services/services';

function Detail({ label, value, marks }) {
    return (
        <div className='detail'>
            <span className='detail-label'>
                <div>{label}</div><div>:</div>
            </span>
            {value}
            {marks && marks.sec && marks.max && `${parseFloat(marks.sec)} / ${parseFloat(marks.max)}`}
        </div>
    )

}


function EditApplicationModal({ applicationData, isOpen, setIsOpen }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const modalRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        // Add event listener only when filter menu is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const onEdit = async () => {
        setIsLoading(true)
        setError(null)
        dispatch(setApplicationNo(applicationData.sno))
        setIsOpen(false);
        setIsLoading(false);
        navigate('/final_review');
    }

    const onDelete = async () => {
        setIsLoading(true)
        setError(null)

        const response = await services.deleteApplication(applicationData.sno);
        if (response?.status === 200) {
            setIsOpen(false);
            window.location.reload();
        } else {
            setError("Failed to delete application!")
        }
        setIsLoading(false)
    }

    return (
        <div className='modal-container'>
            {isLoading && <Loading />}
            {error && <Error message={error} />}

            <div className='modal-content' ref={modalRef}>
                <div className='modal-header'>
                    <div className='modal-heading'>{applicationData.student_name} {applicationData.initial}</div>
                    <IoIosCloseCircleOutline className='modal-close-btn' onClick={() => { setIsOpen(false) }} />
                </div>

                <div className='modal-body'>
                    {applicationData &&
                        Object.entries(applicationData)
                            .filter(([key]) => key !== 'student_name' && key !== 'initial')
                            .map((item, index) => (
                                // <div key={index} className='modal-data-row'>
                                //     <span className='modal-data-label'>{item[0].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}:</span> {/* Convert snake_case to a displayable format */}
                                //     <span className='modal-data-value'>{item[1]}</span>
                                // </div>
                                <Detail label={item[0].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')} value={item[1]} />
                            ))
                    }
                </div>

                <div className='button-container'>
                    <input className='delete-btn btn' type="button" value='Delete' onClick={onDelete} />
                    <input className='user-edit-btn btn' type="button" value='Edit' onClick={onEdit} />
                </div>
            </div>
        </div>
    )
}

export default EditApplicationModal
