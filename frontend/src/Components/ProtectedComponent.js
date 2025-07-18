import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function ProtectedComponent({ children, users }) {
    const auth = useSelector((state) => state.auth)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const isValid = (auth) => {
            const tokenValidity = new Date(auth.exp * 1000) // * 1000 to convert into milliseconds
            const now = new Date()
            return tokenValidity >= now
        }

        const getUserDetails = async () => {
            if (auth && isValid(auth) && (users ? users.includes(auth.role) : true)) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }
        getUserDetails()
    }, [auth, children, users])

    return (
        <>
            {isVisible && children}
        </>
    )
}

export default ProtectedComponent