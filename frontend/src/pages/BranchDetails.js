import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import "../css/BranchDetails.css";

import services from '../services/services';
import { setApplicationNo } from '../store/applicationNoSlice';
import Loading from "../Components/Loading";
import Error from "../Components/Error";
import { IoIosSearch } from "react-icons/io"

function BranchCard(props) {
    return (
        <div className='branchCard'>
            <div className='branch-degree'>{props.degree}</div>
            <div>{props.branch}</div>
            {(props.degree === "B.E." || props.degree === "B.Tech.") ? (
                <div className='button-container'>
                    <input className='button' type='button' value="Regular" onClick={props.regular} />
                    <input className='button' type='button' value="Lateral" onClick={props.lateral} />
                </div>
            ) : (
                <div className='button-container'>
                    <input className='button' type='button' value="Apply Now!" onClick={props.regular} />
                </div>
            )}
        </div>
    );
}

function BranchDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [courses, setCourses] = useState([])
    const [filteredCourses, setFilteredCourses] = useState([])
    const [branchDet, setBranchDet] = useState()
    const [filter, setFilter] = useState({ degree: null, course: null })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true)
            setError(null)
            dispatch(setApplicationNo(null));
            const result = await services.fetchFromMaster('branch');
            if (result && typeof result === 'object') {
                const coursesArray = Object.values(result).map(course => ({
                    course_id: course.course_id,
                    branch_id: course.branch_id,
                    branch_name: course.branch_name,
                }));

                const sortedBranches = coursesArray.sort((a, b) => a.branch_name.localeCompare(b.branch_name))
                const sortedCourses = sortedBranches.sort((a, b) => a.course_id - b.course_id)

                setCourses(sortedCourses);
                setFilteredCourses(sortedCourses)
            } else {
                setError("Error fetching branch details!")
            }
            setIsLoading(false)
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        let filteredBranches = courses

        if (filter.degree) {
            filteredBranches = filteredBranches.filter(course => course.course_id === filter.degree);
        }

        if (filter.course) {
            filteredBranches = filteredBranches.filter(course =>
                course.branch_name.toLowerCase().includes(filter.course.toLowerCase())
            );
        }

        // setFilteredCourses(filteredBranches.length ? filteredBranches : courses)
        setFilteredCourses(filteredBranches)
    }, [filter, courses])

    useEffect(() => {
        if (branchDet) {
            handleSubmit();
        }
    }, [branchDet]);

    const degree = {
        1: "B.E.",
        9: "B.Tech.",
        10: "M.E.",
        11: "M.Tech.",
        13: "M.B.A.",
        16: "Ph.D.",
    };

    const level = {
        "UG": [1, 9, 15],
        "PG": [10, 11, 12, 13, 14],
        "Ph.D": [16],
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        setError(null)
        const response = await services.createNewApplication(branchDet);
        if (response) {
            dispatch(setApplicationNo(response.application_no));
            navigate('/personal_details');
        } else {
            setError("Error generating application number!")
        }
        setIsLoading(false)
    };

    return (
        <div className='BranchDetails'>
            {isLoading && <Loading />}
            {error && <Error message={error} />}
            <div className='course-card'>
                <div className="form-header">DEPARTMENTS</div>
                <div className='filters-container'>

                    <input className='filter-search' placeholder='Branch Name' type='text' onChange={(e) => { setFilter((prevFilter) => ({ ...prevFilter, course: e.target.value })) }} />
                    <IoIosSearch className='search-icon' />

                    <select className='filter-dropdown' onChange={(e) => { setFilter((prevFilter) => ({ ...prevFilter, degree: Number(e.target.value) })) }}>
                        <option value="null">--</option>
                        {degree &&
                            Object.entries(degree).map(element => (
                                <option key={element[0]} value={element[0]}>
                                    {element[1]}
                                </option>
                            ))
                        }
                    </select>

                </div>
                <div className='course-list'>

                    {filteredCourses.map((course, index) => (
                        <BranchCard
                            key={index}
                            degree={degree[course.course_id]}
                            branch={course.branch_name}
                            regular={() => {
                                setBranchDet({ branch_id: course.branch_id, student_cat_id: 11 });
                            }}
                            lateral={() => {
                                setBranchDet({ branch_id: course.branch_id, student_cat_id: 12 });
                            }}
                        />
                    ))}

                </div>
            </div>
        </div>
    );
}

export default BranchDetails;