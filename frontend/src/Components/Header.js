import '../css/Header.css'

import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { MdOutlineHome } from "react-icons/md";
import { MdHome } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { useState, useRef, useEffect } from 'react';

import bitlogo from '../assets/bitlogo.png'
import Loading from "../Components/Loading";
import Error from "../Components/Error";
import ProtectedComponent from './ProtectedComponent';
import { setAuth } from '../store/authSlice'
import { setApplicationNo } from '../store/applicationNoSlice';
import apiInstance from '../services/apiService';


function Header() {
	const applicationNo = useSelector((state) => state.applicationNo.value)
	const location = useLocation()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [showEdit, setShowEdit] = useState(false)
	const [tempApplNo, setTempApplNo] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)

	const auth = useSelector((state) => state.auth)

	const dropdownRef = useRef(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleEdit = async (e = null) => {
		if (e) {
			e.preventDefault()
		}
		if (!tempApplNo) {
			setShowEdit(!showEdit)
		} else {
			setIsLoading(true)
			try {
				const response = await apiInstance.get(`/if_exist`, { params: { appl_no: tempApplNo } })
				if (response.status === 200) {
					setError(null)
					dispatch(setApplicationNo(tempApplNo))
					navigate('/final_review')
				} else {
					setError('Some error occured')
					console.log(response)
				}
			} catch (error) {
				if (!error.response.data.message) {
					setError('Some error occured')
				}
				setError(error.response.data.message)
				console.log(error)
			}
		}
		setIsLoading(false)
	}

	const handleLogout = () => {
		dispatch(setAuth({}))
		dispatch(setApplicationNo(null))
		navigate('/login', { replace: true })
	}

	return (
		<div className='Header'>
			{isLoading && <Loading />}
			{error && <Error message={error} />}
			<div className='header'>
				<div></div>
				<img className='bit-logo' src={bitlogo} alt='Bannari Amman Institute of Technology' />
				<div className='header-data'>
					{auth.token &&
						<div onClick={toggleDropdown} className="header-dropdown-toggle" >
							<span className="header-dropdown-toggle-icon">
								{auth?.name?.[0]?.split(' ').map(word => word.charAt(0)).join('').toUpperCase()}
							</span>
							<span className='header-username'>{auth?.name}</span>
						</div>
					}

					{isDropdownOpen && (
						<div ref={dropdownRef} className="header-dropdown-menu">
							<div className="header-dropdown-username">
								{auth?.name}
							</div>
							<div className="header-dropdown-role">
								{auth.role.toUpperCase()}
							</div>
							<hr></hr>
							<ProtectedComponent users={["admin", "manager"]}>
								<div>
									<button onClick={() => { navigate('/home'); toggleDropdown(); }} className='header-dropdown-menu-btn'>
										<MdOutlineHome className="header-dropdown-menu-icon" />
										Home
									</button>
								</div>
								<div>
									<button onClick={() => { navigate('/incomplete_application'); toggleDropdown(); }} className='header-dropdown-menu-btn'>
										<GoPlus className="header-dropdown-menu-icon" />
										Application
									</button>
								</div>
								<hr></hr>
							</ProtectedComponent>
							<button onClick={handleLogout} className='header-dropdown-menu-btn'>
								<BiLogOut className="header-dropdown-menu-icon" />
								Logout
							</button>
						</div>
					)}
					{/* {applicationNo &&
						<div className='application-no'>Application No Temp : {applicationNo}</div>
					} */}
				</div>
			</div>
			<hr></hr>
		</div>
	)
}

export default Header