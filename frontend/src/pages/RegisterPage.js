import { useForm } from "react-hook-form";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoPlus } from "react-icons/go";

import authServices from '../services/authService';

import Loading from "../Components/Loading";
import Error from "../Components/Error";
import Header from '../Components/Header';

function RegisterPage() {
    const navigate = useNavigate();
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const { handleSubmit, register } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true)
        setError(null)
        data.password = btoa(data.password)

        const response = await authServices.register(data)
        setIsLoading(false)
        if (response) {
            alert("User created successfully")
        }
        else {
            setError("Unable to create user")
        }
    }

    return (
        <div className='login'>
            <Header />
            <div className='login-det'>
                <div className='login-container'>
                    {isLoading && <Loading />}
                    {error && <Error message={error} />}
                    <form className='login-card' onSubmit={handleSubmit(onSubmit)}>
                        <div className='login-header'>Add User</div>
                        <div>
                            <div className='input-label'>Username</div>
                            <input
                                className='input-field'
                                type='text'
                                {...register('username')}
                            />
                        </div>
                        <div>
                            <div className='input-label'>Role</div>
                            <input
                                className='input-field'
                                type='text'
                                {...register('role')}
                            />
                        </div>
                        <div>
                            <div className='input-label'>Password</div>
                            <input
                                className='input-field'
                                type='password'
                                {...register('password')}
                            />
                        </div>
                        <div className="button-container">
                            <input className='login-btn' type="button" value="Cancel" onClick={() => {navigate('/')}}/>
                            <input className='login-btn' type="submit" value="Submit" onSubmit={handleSubmit(onSubmit)} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
