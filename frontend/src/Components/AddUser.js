import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

import services from '../services/services';

import InputField from './InputField'
import DropDown from './DropDown'
import Loading from "./Loading";
import Error from "./Error";

function AddUser() {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const { register, control, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true)
        setError(null)
        const response = await services.addUser(data)
        if (response.status === 200) {
            setIsLoading(false)
            alert("User added successfully")
        } else {
            setError("Error adding user!")
        }
        window.location.reload();
        setIsLoading(false)
    }

    return (
        <div className='form-container'>
            {isLoading && <Loading />}
            {error && <Error message={error} />}
            <form className='form' onSubmit={handleSubmit(onSubmit)}>
                <div className='form-header'>Add User</div>
                <div className='form-fields'>
                    <div className='space-between'>
                        <InputField
                            label='Email'
                            registerProps={register("email")}
                            type='email'
                            toUpper={false}
                            required
                        />
                        <DropDown
                            label="Role"
                            options={{ 0: 'manager', 1: 'admin' }}
                            fieldname={"role"}
                            formcontrol={control}
                            storeLabel={true}
                            sorted={false}
                            required
                        />
                        <input className='button' type='submit' value="Add" onSubmit={handleSubmit(onSubmit)} />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddUser
