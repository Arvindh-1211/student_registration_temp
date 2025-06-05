import '../css/EditUserModal.css'

import InputField from './InputField'
import DropDown from './DropDown'
import { useForm } from 'react-hook-form';
import { IoIosCloseCircleOutline } from "react-icons/io";
import services from '../services/services';
import { useEffect, useRef, useState } from 'react';
import Loading from './Loading';
import Error from './Error';

function EditUserModal({ userData, isOpen, setIsOpen }) {
  const { register, handleSubmit } = useForm({ defaultValues: userData });
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
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

  const onEdit = async (data) => {
    setIsLoading(true)
    setError(null)

    const response = await services.editUser(userData.user_id, data);
    if (response?.status === 200) {
      setIsOpen(false);
      window.location.reload();
    } else {
      setError("Failed to edit user details!")
    }
    setIsLoading(false)
  }

  const onDelete = async () => {
    setIsLoading(true)
    setError(null)

    const response = await services.deleteUser(userData.user_id);
    if (response?.status === 200) {
      setIsOpen(false);
      window.location.reload();
    } else {
      setError("Failed to delete user!")
    }
    setIsLoading(false)
  }

  return (
    <div className='modal-container'>

      {isLoading && <Loading />}
      {error && <Error message={error} />}

      <div className='modal-content' ref={modalRef}>
        <div className='modal-header'>
          <div className='modal-heading'>Edit User</div>
          <IoIosCloseCircleOutline className='modal-close-btn' onClick={() => { setIsOpen(false) }} />
        </div>
        <form onSubmit={handleSubmit(onEdit)}>
          <InputField
            label='Email'
            registerProps={register("username")}
            type='text'
            toUpper={false}
          />
          <DropDown
            label="Role"
            options={['admin', 'manager']}
            registerProps={register("role")}
            storeLabel={true}
          />
          <div className='button-container'>
            <input className='delete-btn btn' type="button" value='Delete' onClick={onDelete} />
            <input className='user-edit-btn btn' type="submit" value='Edit' onSubmit={handleSubmit(onEdit)} />
          </div>
        </form>
      </div>

    </div>
  )
}

export default EditUserModal