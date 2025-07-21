import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../css/Success.css';

function Success() {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth)

    const applicationNo = useSelector((state) => state.applicationNo.value)
    const campsApplNo = useSelector((state) => state.applicationNo.campsApplNo)

    useEffect(() => {
        if (!campsApplNo && auth && ['admin', 'manager', 'accounts_manager'].includes(auth.role)) {
            navigate('/personal_details')
        }
    }, [])

    const handleClick = () => {
        if(['admin', 'manager', 'accounts_manager'].includes(auth.role)){
            navigate('/incomplete_application')
        }
        else {
            navigate('/login')
        }
    }

    return (
        <div>
            <div className='success'>
                <div className="success-container">
                    <div className="tick-icon">✓</div>
                    <div className="particles">
                        <div className="particle" style={{ '--x': '-20px', '--y': '15px' }}></div>
                        <div className="particle" style={{ '--x': '25px', '--y': '-5px' }}></div>
                        <div className="particle" style={{ '--x': '25px', '--y': '-15px' }}></div>
                        <div className="particle" style={{ '--x': '-15px', '--y': '25px' }}></div>
                        <div className="particle" style={{ '--x': '-35px', '--y': '10px' }}></div>
                        <div className="particle" style={{ '--x': '35px', '--y': '-10px' }}></div>
                        <div className="particle" style={{ '--x': '-30px', '--y': '-15px' }}></div>
                        <div className="particle" style={{ '--x': '30px', '--y': '15px' }}></div>
                        <div className="particle" style={{ '--x': '15px', '--y': '35px' }}></div>
                    </div>
                    <div className='success-msg'>Success!</div>
                    {/* <div>Application submitted successfully.</div> */}

                    {campsApplNo &&
                        <div className='appl-no'>Application Number : {campsApplNo}</div>
                    }

                    {/* <div>Application Number Temp : {applicationNo}</div> */}
                    <div className='button-container'>
                        <button className='create-btn' onClick={handleClick}>Okay</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Success;
