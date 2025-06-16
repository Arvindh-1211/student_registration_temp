// Form-1
import { useForm } from "react-hook-form";
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';

import services from "../services/services";
import schema from "../utils/validation";

import InputField from '../Components/InputField';
import DropDown from '../Components/DropDown';
import Form from '../Components/Form';
import Row from "../Components/Row";
import Loading from "../Components/Loading";
import Error from "../Components/Error";


function PersonalDetails() {
    const navigate = useNavigate()
    const location = useLocation()
    const applicationNo = useSelector((state) => state.applicationNo.value)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const formData = {
        legend: null,
        student_name: null,
        initial: null,
        dob: null,
        age: null,
        gender: null,
        mother_tongue: null,
        blood_group: null,
        aadhar_no: null,
        community_id: "",
        caste_id: null,
        religion_id: null,
        nationality_id: null,
        seat_cat: '',
        scholar: null,
    }

    const [options, setOptions] = useState({
        mother_tongue: {},
        blood_group: {},
        community: {},
        caste: {},
        religion: {},
        nationality: {}
    });

    const { register, control, getValues, setValue, watch, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: formData, resolver: yupResolver(schema.PersonalDetails) });

    useEffect(() => {
        const getDefaultValues = async () => {
            const queryParams = Object.keys(formData).join(',')
            const fetchedData = await services.fetchData(applicationNo, queryParams)
            reset(fetchedData)
            
            if (getValues('dob')) {
                let dob = new Date(getValues('dob')).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
                setValue('dob', dob)
            }
        }

        const getOptions = async () => {
            setError(null)
            const optionsArray = Object.keys(options);
            const fetchedOptions = await Promise.all(
                optionsArray.map((option) => services.fetchFromMaster(option))
            );
            if (!fetchedOptions[0]) {
                setError("Error fetching options!")
            }
            const newOptions = {};
            optionsArray.forEach((option, index) => {
                newOptions[option] = fetchedOptions[index];
            })
            setOptions(newOptions);
        };

        const init = async () => {
            setIsLoading(true)
            await getOptions();
            await getDefaultValues();
            setIsLoading(false)
        };

        if (applicationNo) {
            init();
        } else {
            navigate('/login')
        }
    }, [])

    // Calculate age based on date of birth
    const dob = watch('dob')
    useEffect(() => {
        if (dob) {
            const today = new Date();
            const birthDate = new Date(dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setValue('age', age);
        }
    }, [dob, setValue]);


    const onSubmit = async (data) => {
        setIsLoading(true)
        setError(null)

        const response = await services.updateData(applicationNo, data)

        if (response) {
            if (location.state && location.state.fromFinal) {
                navigate('/final_review')
            } else {
                navigate('/parent_details')
            }
        } else {
            setError("Error submitting form!")

        }
        setIsLoading(false)
    }

    return (
        <div>
            {isLoading && <Loading />}
            {error && <Error message={error} />}
            <Form handleNext={handleSubmit(onSubmit)} heading="Personal Details" >
                <Row>
                    <DropDown
                        label="Title"
                        options={{ "Mr.": "Mr", "Ms.": "Ms" }}
                        fieldname={"legend"}
                        formcontrol={control}
                        error={errors.legend && errors.legend.message}
                        required
                    />
                    <InputField
                        label="Student Name"
                        registerProps={register("student_name")}
                        type="text"
                        error={errors.student_name && errors.student_name.message}
                        required
                    />
                    <InputField
                        label="Initial"
                        registerProps={register("initial")}
                        type="text"
                        error={errors.initial && errors.initial.message}
                    />
                </Row>

                <Row>
                    <DropDown
                        label="Gender"
                        options={{ "MALE": "MALE", "FEMALE": "FEMALE" }}
                        fieldname={"gender"}
                        formcontrol={control}
                        sorted={false}
                        error={errors.gender && errors.gender.message}
                        required
                    />
                    <InputField
                        label="Date of Birth"
                        registerProps={register("dob")}
                        type="date"
                        error={errors.dob && errors.dob.message}
                        required
                    />
                    <InputField
                        label="Age"
                        registerProps={register("age")}
                        type="number"
                        error={errors.age && errors.age.message}
                        required
                    />
                </Row>

                <Row>
                    <DropDown
                        label="Blood Group"
                        options={options['blood_group']}
                        fieldname={"blood_group"}
                        formcontrol={control}
                        value='value'
                        error={errors.blood_group && errors.blood_group.message}
                        />
                    <DropDown
                        label="Mother Tongue"
                        options={options['mother_tongue']}
                        fieldname={"mother_tongue"}
                        formcontrol={control}
                        storeLabel={true}
                    />
                    <InputField
                        label="Aadhar Number"
                        registerProps={register("aadhar_no")}
                        type="number"
                        error={errors.aadhar_no && errors.aadhar_no.message}
                        required
                    />
                </Row>

                <Row>
                    <DropDown
                        label="Community"
                        options={options['community']}
                        fieldname={"community_id"}
                        formcontrol={control}
                        error={errors.community_id && errors.community_id.message}
                        required
                    />
                    <DropDown
                        label="Caste"
                        options={options['caste']}
                        fieldname={"caste_id"}
                        formcontrol={control}
                    />
                    <DropDown
                        label="Religion"
                        options={options['religion']}
                        fieldname={"religion_id"}
                        formcontrol={control}
                        error={errors.religion_id && errors.religion_id.message}
                        required
                    />
                </Row>

                <Row>
                    <DropDown
                        label="Nationality"
                        options={options['nationality']}
                        fieldname={"nationality_id"}
                        formcontrol={control}
                        error={errors.nationality_id && errors.nationality_id.message}
                        required
                    />
                    <DropDown
                        label="Seat Category"
                        options={{ 'GOVERNMENT': 'GOVERNMENT', 'MANAGEMENT': 'MANAGEMENT' }}
                        fieldname={"seat_cat"}
                        formcontrol={control}
                        error={errors.seat_cat && errors.seat_cat.message}
                        required
                    />
                    <DropDown
                        label="Scholar"
                        options={{ DAYSCHOLAR: 'DAYSCHOLAR', HOSTELLER: 'HOSTELLER' }}
                        fieldname={"scholar"}
                        formcontrol={control}
                        sorted={false}
                    />
                </Row>
            </Form>
        </div>
    )
}

export default PersonalDetails