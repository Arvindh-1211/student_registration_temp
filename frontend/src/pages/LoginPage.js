import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import authServices from '../services/authService';
import { setAuth } from '../store/authSlice';
import { setApplicationNo, setCampsApplNo } from '../store/applicationNoSlice';

import Loading from "../Components/Loading";
import Error from "../Components/Error";
import Header from '../Components/Header';
import '../css/Login.css'

function LoginPage() {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const { handleSubmit, register } = useForm();

    useEffect(() => {
        dispatch(setAuth({}))
        dispatch(setApplicationNo(null))
        dispatch(setCampsApplNo(null))
    }, [dispatch])

    const onSubmit = async (data) => {
        setIsLoading(true)
        setError(null)
        try {
            data.password = btoa(data.password)

            const response = await authServices.login({ ...data, loginType: 'application_number' })
            if (response?.application_no) {
                dispatch(setApplicationNo(response.application_no));
                dispatch(setAuth(response))
                navigate('/personal_details');
            }
            else if (response?.message === 'Application already submitted!') {
                setIsLoading(false)
                setError(response.message);
            }
            else {
                setError("Invalid Credentials!")
            }
        } catch (error) {
            setError(error.message || "Login Failed!")
        }
        setIsLoading(false)
    }

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        setIsLoading(true)
        setError(null)

        const base64Url = credentialResponse.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(atob(base64));

        if (decodedPayload.email.endsWith('@bitsathy.ac.in')) {
            const response = await authServices.login({ email: decodedPayload.email, loginType: 'google' })
            if (response) {
                dispatch(setAuth({ ...response, name: decodedPayload.name }))
                if (response.role === 'admin' || response.role === 'manager' || response.role === 'accounts_manager') {
                    setIsLoading(false)
                    navigate('/home')
                }
                else {
                    setIsLoading(false)
                    navigate('/')
                }
            }
            else {
                setIsLoading(false)
                setError("Unauthorized User!")
            }
        }
        else {
            setError("Use @bitsathy.ac.in email!");
        }
        setIsLoading(false)
    }

    const handleGoogleLoginError = (error) => {
        setIsLoading(false)
        setError("Google Login Failed!")
    }

    return (
        <div className='login'>
            <GoogleOAuthProvider clientId={clientId}>
                <Header />
                <div className='login-det'>
                    <div className='login-container'>
                        {isLoading && <Loading />}
                        {error && <Error message={error} />}
                        <form className='login-card' onSubmit={handleSubmit(onSubmit)}>
                            <div className='login-header'>Login</div>

                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={handleGoogleLoginError}
                                width='240'
                            />

                            <div style={{ borderColor: '#27403c55', borderWidth: '1px', borderStyle: 'solid', width: '250px' }}></div>

                            <div>
                                <div className='input-label'>Username</div>
                                <input
                                    className='input-field'
                                    type='text'
                                    {...register('username')}
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
                            <input className='login-btn' type="submit" onSubmit={handleSubmit(onSubmit)} />
                        </form>
                    </div>
                </div>
            </GoogleOAuthProvider>
        </div>
    )
}

export default LoginPage 