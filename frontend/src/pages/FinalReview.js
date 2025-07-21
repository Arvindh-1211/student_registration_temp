import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import "../css/FinalReview.css"

import Loading from "../Components/Loading";
import Error from "../Components/Error";

import { setCampsApplNo } from '../store/applicationNoSlice';
import services from "../services/services";
import ProtectedComponent from '../Components/ProtectedComponent';


function Detail({ label, value, marks }) {
    return (
        <div className='detail'>
            <span className='detail-label'>
                <div>{label}</div><div>:</div>
            </span>
            {value}
            {marks && marks.sec && marks.max && `${parseFloat(marks.sec)} / ${parseFloat(marks.max)}`}
        </div>
    )

}

function FinalReview() {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth)
    const applicationNo = useSelector((state) => state.applicationNo.value)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch();
    // dispatch(setCampsApplNo(1015));

    const [formData, setFormData] = useState({
        // Personal Details
        legend: '',
        student_name: '',
        initial: '',
        dob: '',
        age: '',
        gender: '',
        mother_tongue: '',
        blood_group: '',
        aadhar_no: '',
        community_id: '',
        caste_id: '',
        religion_id: '',
        nationality_id: '',
        seat_cat: '',
        scholar: '',

        // Parent Details
        father_name: '',
        mother_name: '',
        guardian_name: '',
        occupation: '',
        parent_income: '',
        work_area: '',
        designation: '',
        occupation_mother: '',
        parent_income_mother: '',
        work_area_mother: '',
        designation_mother: '',

        // Branch Details
        batch_id: '',
        acad_yr_id: '',
        branch_id: '',
        course_id: '',
        dept_id: '',
        branch_type: '',
        degree_level: '',
        year_of_admission: '',
        year_of_completion: '',
        regulation_id: '',
        university_id: '',
        student_cat_id: '',
        year_of_study: '',
        sem_of_study: '',
        section: '',

        // Address Details
        comm_add_street: '',
        comm_add_town: '',
        comm_add_city: '',
        comm_add_district: '',
        comm_add_state: '',
        comm_add_country: '',
        comm_add_pincode: '',
        perm_add_street: '',
        perm_add_town: '',
        perm_add_city: '',
        perm_add_district: '',
        perm_add_state: '',
        perm_add_country: '',
        perm_add_pincode: '',
        area_location: '',

        // Contact Details
        stu_mobile_no: '',
        stu_email_id: '',
        parent_mobile_no: '',
        parent_email_id: '',
        perm_phone_no: '',
        nominee_relation: '',
        nominee_name: '',
        nominee_age: '',

        // TNEA Details
        quota_id: '',
        tnea_app_no: '',
        tnea_adm_no: '',
        general_rank: '',
        comm_rank: '',
        tnea_pay_rec_no: '',
        tnea_pay_rec_date: '',
        tnea_pay_rec_amt: '',
        tnea_pay_bank: '',

        // Scholarship Details
        adm_sch_name1: '',
        adm_sch_amt1: '',
        adm_sch_name2: '',
        adm_sch_amt2: '',

        // Marks Details
        school_name: '',
        school_tc_no: '',
        school_tc_date: '',
        school_board: '',
        school_class: '',
        sch_qual_id: '',
        sch_yr_pass: '',
        sch_study_state: '',
        study_medium: '',
        sch_attempt: '',
        sch_reg1: '',
        sch_cer1: '',
        sch_tot_mark1: '',
        sch_reg2: '',
        sch_cer2: '',
        sch_tot_mark2: '',
        physics_secured: '',
        physics_max: '',
        physics_percentage: '',
        chemistry_secured: '',
        chemistry_max: '',
        chemistry_percentage: '',
        maths_secured: '',
        maths_max: '',
        maths_percentage: '',
        biology_secured: '',
        biology_max: '',
        biology_percentage: '',
        cs_secured: '',
        cs_max: '',
        cs_percentage: '',
        pcm_sec: '',
        pcm_max: '',
        pcm_per: '',
        phy_che: '',
        maths: '',
        cut_off: '',
        diploma_first_sec: '',
        diploma_first_max: '',
        diploma_first_per: '',
        diploma_second_sec: '',
        diploma_second_max: '',
        diploma_second_per: '',
        diploma_third_sec: '',
        diploma_third_max: '',
        diploma_third_per: '',
        diploma_fourth_sec: '',
        diploma_fourth_max: '',
        diploma_fourth_per: '',
        diploma_fifth_sec: '',
        diploma_fifth_max: '',
        diploma_fifth_per: '',
        diploma_sixth_sec: '',
        diploma_sixth_max: '',
        diploma_sixth_per: '',
        diploma_seventh_sec: '',
        diploma_seventh_max: '',
        diploma_seventh_per: '',
        diploma_eighth_sec: '',
        diploma_eighth_max: '',
        diploma_eighth_per: '',
        diploma_ninenth_sec: '',
        diploma_ninenth_max: '',
        diploma_ninenth_per: '',
        diploma_tenth_sec: '',
        diploma_tenth_max: '',
        diploma_tenth_per: '',
        ug_mark_sec: '',
        ug_mark_max: '',
        ug_mark_per: '',
        I_II: '',
        III_IV: '',
        V_VI: '',
        VII_VIII: '',
        IX_X: '',
        entrance_secured: '',
        entrance_max: '',
        entrance_percenteage: '',
    })

    const [additionalDet, setAdditionalDet] = useState({
        // Additional Details
        father_qual: '',
        mother_qual: '',
        school_type: '',
        college_bus: '',
        boarding_point: '',
        sports_int: '',
        first_gr_appno: '',
        choose_college: '',
    })

    useEffect(() => {
        let fetchedData
        const getDefaultValues = async () => {
            setError(null)
            const queryParams = Object.keys(formData).join(',')
            fetchedData = await services.fetchData(applicationNo, queryParams)
            if (!fetchedData) {
                setError("Error fetching data!")
            }
            setFormData(fetchedData)
            if (fetchedData.dob) {
                let dob = new Date(fetchedData.dob).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
                setFormData((prevFormData) => ({ ...prevFormData, dob: dob }))
            }
            if (fetchedData.tnea_pay_rec_date) {
                let tnea_pay_rec_date = new Date(fetchedData.tnea_pay_rec_date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
                setFormData((prevFormData) => ({ ...prevFormData, tnea_pay_rec_date: tnea_pay_rec_date }))
            }
            if (fetchedData.school_tc_date) {
                let school_tc_date = new Date(fetchedData.school_tc_date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
                setFormData((prevFormData) => ({ ...prevFormData, school_tc_date: school_tc_date }))
            }
        }

        const getAdditionalDet = async () => {
            const queryParams = Object.keys(additionalDet).join(',')
            const response = await services.getStudentAdditionalDet(applicationNo, queryParams)
            setAdditionalDet(response)
        }


        const getValue = async () => {
            if (fetchedData.blood_group) {
                const blood_group = await services.getValueFromMaster('blood_group', fetchedData.blood_group)
                if (!blood_group) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, blood_group: blood_group }))
            }
            if (fetchedData.community_id) {
                const community = await services.getValueFromMaster('community', fetchedData.community_id)
                if (!community) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, community_id: community }))
            }
            if (fetchedData.caste_id) {
                const caste = await services.getValueFromMaster('caste', fetchedData.caste_id)
                if (!caste) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, caste_id: caste }))
            }
            if (fetchedData.religion_id) {
                const religion = await services.getValueFromMaster('religion', fetchedData.religion_id)
                if (!religion) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, religion_id: religion }))
            }
            if (fetchedData.nationality_id) {
                const nationality = await services.getValueFromMaster('nationality', fetchedData.nationality_id)
                if (!nationality) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, nationality_id: nationality }))
            }
            if (fetchedData.occupation) {
                const occupation = await services.getValueFromMaster('occupation', fetchedData.occupation)
                if (!occupation) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, occupation: occupation }))
            }
            if (fetchedData.designation) {
                const designation = await services.getValueFromMaster('designation', fetchedData.designation)
                if (!designation) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, designation: designation }))
            }
            if (fetchedData.occupation_mother) {
                const occupation_mother = await services.getValueFromMaster('occupation', fetchedData.occupation_mother)
                if (!occupation_mother) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, occupation_mother: occupation_mother }))
            }
            if (fetchedData.designation_mother) {
                const designation_mother = await services.getValueFromMaster('designation', fetchedData.designation_mother)
                if (!designation_mother) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, designation_mother: designation_mother }))
            }
            if (fetchedData.batch_id) {
                const batch_id = await services.getValueFromMaster('batch_id', fetchedData.batch_id)
                if (!batch_id) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, batch_id: batch_id }))
            }
            if (fetchedData.acad_yr_id) {
                const acad_yr_id = await services.getValueFromMaster('acad_yr_id', fetchedData.acad_yr_id)
                if (!acad_yr_id) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, acad_yr_id: acad_yr_id }))
            }
            if (fetchedData.branch_id) {
                const branch_id = await services.getValueFromMaster('branch_id', fetchedData.branch_id)
                if (!branch_id) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, branch_id: branch_id }))
            }
            if (fetchedData.branch_type) {
                const branch_type = await services.getValueFromMaster('branch_type', fetchedData.branch_type)
                if (!branch_type) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, branch_type: branch_type }))
            }
            if (fetchedData.course_id) {
                const course_id = await services.getValueFromMaster('course_id', fetchedData.course_id)
                if (!course_id) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, course_id: course_id }))
            }
            if (fetchedData.dept_id) {
                const dept_id = await services.getValueFromMaster('dept_id', fetchedData.dept_id)
                if (!dept_id) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, dept_id: dept_id }))
            }
            if (fetchedData.regulation_id) {
                const regulation_id = await services.getValueFromMaster('regulation_id', fetchedData.regulation_id)
                if (!regulation_id) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, regulation_id: regulation_id }))
            }
            if (fetchedData.university_id) {
                const university_id = await services.getValueFromMaster('university_id', fetchedData.university_id)
                if (!university_id) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, university_id: university_id }))
            }
            if (fetchedData.student_cat_id) {
                const student_cat_id = await services.getValueFromMaster('student_cat_id', fetchedData.student_cat_id)
                if (!student_cat_id) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, student_cat_id: student_cat_id }))
            }
            if (fetchedData.quota_id) {
                const quota_id = await services.getValueFromMaster('quota', fetchedData.quota_id)
                if (!quota_id) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, quota_id: quota_id }))
            }
            if (fetchedData.sch_qual_id) {
                const sch_qual_id = await services.getValueFromMaster('sch_qual_id', fetchedData.sch_qual_id)
                if (!sch_qual_id) {
                    setError("Error fetching some values!")
                }
                setFormData((prevFormData) => ({ ...prevFormData, sch_qual_id: sch_qual_id }))
            }
        }

        const init = async () => {
            setIsLoading(true)
            await getDefaultValues()
            await getValue()
            await getAdditionalDet()
            setIsLoading(false)
        };

        if (applicationNo) {
            init();
        } else {
            navigate('/login')
        }
    }, [])

    const handleSubmit = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await services.inserIntoCAMPS(applicationNo)
            dispatch(setCampsApplNo(response.APPLICATION_NO));
            navigate('/success')
        } catch (error) {
            setError("Error submitting form!")
        }

        setIsLoading(false)
    }

    return (
        <div className='form-container'>
            {isLoading && <Loading />}
            {error && <Error message={error} />}
            <div className='details-card'>
                <div className="detail-header">
                    <div>PERSONAL DETAILS</div>
                    <div><input className='button' type='button' value="Edit" onClick={() => { navigate('/personal_details', { state: { fromFinal: true } }) }} /></div>
                </div>
                <hr className='detail-header-line'></hr>
                <div className='details-container'>
                    <div className='detail-row'>
                        <Detail label="Name" value={formData.legend + ' ' + formData.student_name + (formData.initial ? (' ' + formData.initial) : '')} />
                        <Detail label="Dob" value={formData.dob} />
                        <Detail label="Age" value={formData.age} />
                        <Detail label="Gender" value={formData.gender} />
                        <Detail label="Mother Tongue" value={formData.mother_tongue} />
                        <Detail label="Blood Group" value={formData.blood_group} />
                        <Detail label="Aadhar Number" value={formData.aadhar_no} />
                        <Detail label="Community" value={formData.community_id} />
                        <Detail label="Caste" value={formData.caste_id} />
                        <Detail label="Religion" value={formData.religion_id} />
                        <Detail label="Nationality" value={formData.nationality_id} />
                        <Detail label="Seat Category" value={formData.seat_cat} />
                        <Detail label="Scholar" value={formData.scholar} />
                    </div>
                </div>
            </div>
            <div className='details-card'>
                <div className="detail-header">
                    <div>PARENT DETAILS</div>
                    <div><input className='button' type='button' value="Edit" onClick={() => { navigate('/parent_details', { state: { fromFinal: true } }) }} /></div>
                </div>
                <hr className='detail-header-line'></hr>
                <div className='details-container'>
                    <div className='detail-row'>
                        <Detail label="Father Name" value={formData.father_name} />
                        <Detail label="Mother Name" value={formData.mother_name} />
                        <Detail label="Father's Occupation" value={formData.occupation} />
                        <Detail label="Mother's Occupation" value={formData.occupation_mother} />
                        <Detail label="Father's Income" value={formData.parent_income} />
                        <Detail label="Mother's Income" value={formData.parent_income_mother} />
                        <Detail label="Organisation/Company" value={formData.work_area} />
                        <Detail label="Organisation/Company" value={formData.work_area_mother} />
                        <Detail label="Designation" value={formData.designation} />
                        <Detail label="Designation" value={formData.designation_mother} />
                        <Detail label="Guardian Name" value={formData.guardian_name} />
                    </div>
                </div>
            </div>
            <div className='details-card'>
                <div className="detail-header">BRANCH DETAILS</div>
                <hr className='detail-header-line'></hr>
                <div className='details-container'>
                    <div className='detail-row'>
                        <Detail label="Batch" value={formData.batch_id} />
                        <Detail label="Academic Year" value={formData.acad_yr_id} />
                        <Detail label="Branch" value={formData.branch_id} />
                        <Detail label="Course" value={formData.course_id} />
                        <Detail label="Department" value={formData.dept_id} />
                        <Detail label="Branch Type" value={formData.branch_type} />
                        <Detail label="Degree Level" value={formData.degree_level} />
                        <Detail label="Regulation" value={formData.regulation_id} />
                        <Detail label="Year of Admission" value={formData.year_of_admission} />
                        <Detail label="Year of Completion" value={formData.year_of_completion} />
                        <Detail label="University" value={formData.university_id} />
                        <Detail label="Student Catagory" value={formData.student_cat_id} />
                        <Detail label="Year of Study" value={formData.year_of_study} />
                        <Detail label="Sem of Study" value={formData.sem_of_study} />
                        <Detail label="Section" value={formData.section} />
                    </div>
                </div>
            </div>
            <div className='details-card'>
                <div className="detail-header">
                    <div>ADDRESS DETAILS</div>
                    <div><input className='button' type='button' value="Edit" onClick={() => { navigate('/address_details', { state: { fromFinal: true } }) }} /></div>
                </div>
                <hr className='detail-header-line'></hr>
                <div className='details-container'>
                    <div className='detail-row'>
                        <div className='details-sub-header'>Communication Address</div>
                        <div className='details-sub-header'>Permanent Address</div>
                        <Detail label="Street" value={formData.comm_add_street} />
                        <Detail label="Street" value={formData.perm_add_street} />
                        <Detail label="Town" value={formData.comm_add_town} />
                        <Detail label="Town" value={formData.perm_add_town} />
                        <Detail label="City" value={formData.comm_add_city} />
                        <Detail label="City" value={formData.perm_add_city} />
                        <Detail label="District" value={formData.comm_add_district} />
                        <Detail label="District" value={formData.perm_add_district} />
                        <Detail label="State" value={formData.comm_add_state} />
                        <Detail label="State" value={formData.perm_add_state} />
                        <Detail label="Country" value={formData.comm_add_country} />
                        <Detail label="Country" value={formData.perm_add_country} />
                        <Detail label="Pincode" value={formData.comm_add_pincode} />
                        <Detail label="Pincode" value={formData.perm_add_pincode} />
                        <Detail label="Area Location" value={formData.area_location} />
                    </div>
                </div>
            </div>
            <div className='details-card'>
                <div className="detail-header">
                    <div>CONTACT DETAILS</div>
                    <div><input className='button' type='button' value="Edit" onClick={() => { navigate('/contact_details', { state: { fromFinal: true } }) }} /></div>
                </div>
                <hr className='detail-header-line'></hr>
                <div className='details-container'>
                    <div className='detail-row'>
                        <Detail label="Student's Phone Number" value={formData.stu_mobile_no} />
                        <Detail label="Student's Email ID" value={formData.stu_email_id} />
                        <Detail label="Parent's Phone Number" value={formData.parent_mobile_no} />
                        <Detail label="Parent's Email ID" value={formData.parent_email_id} />
                        <Detail label="Mother Phone Number" value={formData.perm_phone_no} />
                        <div></div>
                        <Detail label="Nominee's Relation" value={formData.nominee_relation} />
                        <Detail label="Nominee's Name" value={formData.nominee_name} />
                        <Detail label="Nominee's Age" value={formData.nominee_age} />
                    </div>
                </div>
            </div>
            <div className='details-card'>
                <div className="detail-header">
                    <div>TNEA DETAILS</div>
                    <div><input className='button' type='button' value="Edit" onClick={() => { navigate('/tnea_details', { state: { fromFinal: true } }) }} /></div>
                </div>
                <hr className='detail-header-line'></hr>
                <div className='details-container'>
                    <div className='detail-row'>
                        <Detail label="Quota" value={formData.quota_id} />
                        <Detail
                            label="TNEA Application No."
                            value={
                                formData.tnea_app_no[0] === 'M'
                                    ? null
                                    : formData.tnea_app_no[0] === 'G'
                                        ? formData.tnea_app_no[1] === 'L'
                                            ? formData.tnea_app_no.substring(2)
                                            : formData.tnea_app_no.substring(1)
                                        : formData.tnea_app_no.substring(1)
                            }
                        />
                        <Detail label="TNEA Admission No." value={formData.tnea_adm_no} />
                        <Detail label="General Rank" value={formData.general_rank} />
                        <Detail label="Community Rank" value={formData.comm_rank} />
                        <div></div>
                        <div className='details-sub-header'>TNEA Payment Details</div>
                        <div></div>
                        <Detail label="Receipt No." value={formData.tnea_pay_rec_no} />
                        <Detail label="Receipt Date" value={formData.tnea_pay_rec_date} />
                        <Detail label="Receipt Amount" value={formData.tnea_pay_rec_amt} />
                        <Detail label="Payment Bank" value={formData.tnea_pay_bank} />
                    </div>
                </div>
            </div>
            <div className='details-card'>
                <div className="detail-header">
                    <div>SCHOLARSHIP DETAILS</div>
                    <div><input className='button' type='button' value="Edit" onClick={() => { navigate('/scholarship_details', { state: { fromFinal: true } }) }} /></div>
                </div>
                <hr className='detail-header-line'></hr>
                <div className='details-container'>
                    <div className='detail-row'>
                        <Detail label="Scholarship-1" value={formData.adm_sch_name1} />
                        <Detail label="Amount-1" value={formData.adm_sch_amt1} />
                        <Detail label="Scholarship-2" value={formData.adm_sch_name2} />
                        <Detail label="Amount-2" value={formData.adm_sch_amt2} />
                    </div>
                </div>
            </div>
            <div className='details-card'>
                <div className="detail-header">
                    <div>MARK DETAILS</div>
                    <div><input className='button' type='button' value="Edit" onClick={() => { navigate('/mark_details', { state: { fromFinal: true } }) }} /></div>
                </div>
                <hr className='detail-header-line'></hr>
                <div className='details-container'>
                    <div className='detail-row'>
                        <Detail label="School Name" value={formData.school_name} />
                        <Detail label="School Board" value={formData.school_board} />
                        <Detail label="School class" value={formData.school_class} />
                        <Detail label="TC Number" value={formData.school_tc_no} />
                        <Detail label="TC Date" value={formData.school_tc_date} />
                        <Detail label="Qualification" value={formData.sch_qual_id} />
                        <Detail label="School Year of Passing" value={formData.sch_yr_pass} />
                        <Detail label="Study state" value={formData.sch_study_state} />
                        <Detail label="Medium of Instruction" value={formData.study_medium} />
                        <Detail label="Number of Attempts" value={formData.sch_attempt} />

                        <div className='details-sub-header'>Marksheet Details</div>
                        <div></div>
                        <Detail label="Register Number 1" value={formData.sch_reg1} />
                        <Detail label="Register Number 2" value={formData.sch_reg2} />
                        <Detail label="Certificate Number" value={formData.sch_cer1} />
                        <Detail label="Certificate Number" value={formData.sch_cer2} />
                        <Detail label="Total Marks" value={formData.sch_tot_mark1} />
                        <Detail label="Total Marks" value={formData.sch_tot_mark2} />

                        <div className='details-sub-header'>HSC Details</div>
                        <div></div>

                        <Detail label="Physics Marks" marks={{ sec: formData.physics_secured, max: formData.physics_max }} />
                        <Detail label="Physics Percentage" value={formData.physics_percentage} />

                        <Detail label="Chemistry Marks" marks={{ sec: formData.chemistry_secured, max: formData.chemistry_max }} />
                        <Detail label="Chemistry Percentage" value={formData.chemistry_percentage} />

                        <Detail label="Maths Marks" marks={{ sec: formData.maths_secured, max: formData.maths_max }} />
                        <Detail label="Maths Percentage" value={formData.maths_percentage} />

                        <Detail label="Biology Marks" marks={{ sec: formData.biology_secured, max: formData.biology_max }} />
                        <Detail label="Biology Percentage" value={formData.biology_percentage} />

                        <Detail label="CS Marks" marks={{ sec: formData.cs_secured, max: formData.cs_max }} />
                        <Detail label="CS Percentage" value={formData.cs_percentage} />

                        <Detail label="Phy+Che+Mat Marks" marks={{ sec: formData.pcm_sec, max: formData.pcm_max }} />
                        <Detail label="Phy+Che+Mat Percentage" value={formData.pcm_per} />

                        <Detail label="Cut Off" marks={{ sec: formData.cut_off, max: "200" }} />
                        <div></div>

                        <div className='details-sub-header'>Diploma/UG/PG Details</div>
                        <div></div>

                        <Detail label="I sem Marks" marks={{ sec: formData.diploma_first_sec, max: formData.diploma_first_max }} />
                        <Detail label="I sem Percentage" value={formData.diploma_first_per} />

                        <Detail label="II sem Marks" marks={{ sec: formData.diploma_second_sec, max: formData.diploma_second_max }} />
                        <Detail label="II sem Percentage" value={formData.diploma_second_per} />

                        <Detail label="III sem Marks" marks={{ sec: formData.diploma_third_sec, max: formData.diploma_third_max }} />
                        <Detail label="III sem Percentage" value={formData.diploma_third_per} />

                        <Detail label="IV sem Marks" marks={{ sec: formData.diploma_fourth_sec, max: formData.diploma_fourth_max }} />
                        <Detail label="IV sem Percentage" value={formData.diploma_fourth_per} />

                        <Detail label="V sem Marks" marks={{ sec: formData.diploma_fifth_sec, max: formData.diploma_fifth_max }} />
                        <Detail label="V sem Percentage" value={formData.diploma_fifth_per} />

                        <Detail label="VI sem Marks" marks={{ sec: formData.diploma_sixth_sec, max: formData.diploma_sixth_max }} />
                        <Detail label="VI sem Percentage" value={formData.diploma_sixth_per} />

                        <Detail label="VII sem Marks" marks={{ sec: formData.diploma_seventh_sec, max: formData.diploma_seventh_max }} />
                        <Detail label="VII sem Percentage" value={formData.diploma_seventh_per} />

                        <Detail label="VIII sem Marks" marks={{ sec: formData.diploma_eighth_sec, max: formData.diploma_eighth_max }} />
                        <Detail label="VIII sem Percentage" value={formData.diploma_eighth_per} />

                        <Detail label="IX sem Marks" marks={{ sec: formData.diploma_ninenth_sec, max: formData.diploma_ninenth_max }} />
                        <Detail label="IX sem Percentage" value={formData.diploma_ninenth_per} />

                        <Detail label="X sem Marks" marks={{ sec: formData.diploma_tenth_sec, max: formData.diploma_tenth_max }} />
                        <Detail label="X sem Percentage" value={formData.diploma_tenth_per} />

                        <Detail label="I + II Marks" value={formData.I_II} />
                        <Detail label="III + IV Marks" value={formData.III_IV} />
                        <Detail label="V + VI Marks" value={formData.V_VI} />
                        <Detail label="VII + VIII Marks" value={formData.VII_VIII} />
                        <Detail label="IX + X Marks" value={formData.IX_X} />
                        <div></div>

                        <Detail label="Entrance Marks" marks={{ sec: formData.entrance_secured, max: formData.entrance_max }} />
                        <Detail label="Entrance Percentage" value={formData.entrance_percenteage} />

                        <Detail label="UG Marks" marks={{ sec: formData.ug_mark_sec, max: formData.ug_mark_max }} />
                        <Detail label="UG Percentage" value={formData.ug_mark_per} />

                    </div>
                </div>
            </div>
            <div className='details-card'>
                <div className="detail-header">
                    <div>ADDITIONAL DETAILS</div>
                    <div><input className='button' type='button' value="Edit" onClick={() => { navigate('/additional_details', { state: { fromFinal: true } }) }} /></div>
                </div>
                <hr className='detail-header-line'></hr>
                <div className='details-container'>
                    <div className='detail-row'>
                        <Detail label="Father Qualification" value={additionalDet.father_qual} />
                        <Detail label="Mother Qualification" value={additionalDet.mother_qual} />
                        <Detail label="College bus needed?" value={additionalDet.college_bus} />
                        <Detail label="Boarding Point" value={additionalDet.boarding_point} />
                        <Detail label="School Type" value={additionalDet.school_type} />
                        <Detail label="Sports Interested" value={additionalDet.sports_int} />
                        <Detail label="First Graduate Application No." value={additionalDet.first_gr_appno} />
                        <Detail label="How did you choose this college?" value={additionalDet.choose_college} />
                    </div>
                </div>
            </div>


            <ProtectedComponent users={['admin', 'manager', 'accounts_manager']}>
                <div>
                    <input className='submit-btn' type='submit' value="Submit" onClick={handleSubmit} />
                </div>

            </ProtectedComponent>
            <ProtectedComponent users={['GOVERNMENT', 'MANAGEMENT']}>
                <div>
                    <input className='submit-btn' type='button' value="Freeze" onClick={async () => {
                        setIsLoading(true)
                        setError(null)
                        try {

                            await services.freezeApplication(applicationNo)
                            navigate('/success')
                            setIsLoading(false)
                        }
                        catch (error) {
                            setIsLoading(false)
                            setError("Error freezing application!")
                        }
                    }} />
                </div>
            </ProtectedComponent>
        </div>
    )
}

export default FinalReview