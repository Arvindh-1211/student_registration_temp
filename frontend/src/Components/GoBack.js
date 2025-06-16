import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


function GoBack() {
    const auth = useSelector((state) => state.auth)

    const navigate = useNavigate();
    useEffect(() => {
        if (auth?.role === 'admin') {
            navigate('/home');
        }
        else {
            navigate('/login');
        }
    }, [navigate]);
    return null;
}

export default GoBack;