import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children, users }) {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth)

    useEffect(() => {
        const isValid = (auth) => {
            const tokenValidity = new Date(auth.exp * 1000) // * 1000 to convert into milliseconds
            const now = new Date()
            return tokenValidity >= now
        }

        const getUserDetails = async () => {
            if (auth && isValid(auth)) {
                if (!(users ? users.includes(auth.role) : true)) {
                    alert("Unauthorized User")
                    navigate(-1)
                }
            } else {
                navigate('/login')
            }
        }
        getUserDetails()
    }, [auth, children, users, navigate])

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute