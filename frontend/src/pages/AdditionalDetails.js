// Form-8
import { useForm } from "react-hook-form";
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup';

import services from "../services/services";
import schema from "../utils/validation";

import InputField from '../Components/InputField'
import DropDown from '../Components/DropDown';
import Form from '../Components/Form';
import Row from "../Components/Row";
import Loading from "../Components/Loading";
import Error from "../Components/Error";

function AdditionalDetails() {
    const navigate = useNavigate();
    const location = useLocation()

    const applicationNo = useSelector((state) => state.applicationNo.value)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const [isBoardingPointOpen, setIsBoardingPointOpen] = useState(false);

    const [formData, setFormData] = useState({
        father_qual: '',
        mother_qual: '',
        school_type: '',
        college_bus: '',
        boarding_point: '',
        sports_int: '',
        first_gr_appno: '',
        choose_college: '',
    })

    const [options, setOptions] = useState({
        'boarding_point': {},
    })

    const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: formData, resolver: yupResolver(schema.AdditionalDetails) });

    useEffect(() => {
        const getAdditionalDet = async () => {
            const queryParams = Object.keys(formData).join(',')
            const response = await services.getStudentAdditionalDet(applicationNo, queryParams)
            reset(response)
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
        }

        const init = async () => {
            setIsLoading(true)
            await getOptions();
            await getAdditionalDet();
            setIsLoading(false)
        };

        if (applicationNo) {
            init()
        } else {
            navigate('/login')
        }
    }, [])

    const isBusNeeded = watch("college_bus");
    useEffect(() => {
        if (isBusNeeded === "Yes") {
            setIsBoardingPointOpen(true);
        } else {
            setIsBoardingPointOpen(false);
        }
    }, [isBusNeeded]);

    const onSubmit = async (data) => {
        setIsLoading(true)
        setError(null)
        data = { ...data, appl_no: applicationNo }
        try {
            const response = await services.insertStudentAdditionalDet(data)
            if (response.status === 200) {
                if (location.state && location.state.fromFinal) {
                    navigate('/final_review')
                } else {
                    navigate('/payment_details')
                }
            } else {
                setError("Error submitting form!")
            }
        } catch (error) {
            setError("Error submitting form!")
        } finally {
            setIsLoading(false)
        }


    }

    return (
        <div>
            {isLoading && <Loading />}
            {error && <Error message={error} />}
            <Form handleNext={handleSubmit(onSubmit)} heading="Additional Details" handleBack={() => { navigate('/mark_details') }} >
                <Row>

                    <InputField
                        label="Father Qualification"
                        registerProps={register("father_qual")}
                        type="text"
                        error={errors.father_qual && errors.father_qual.message}
                    />
                    <InputField
                        label="Mother Qualification"
                        registerProps={register("mother_qual")}
                        type="text"
                        error={errors.mother_qual && errors.mother_qual.message}
                    />
                    <DropDown
                        label="School Type"
                        options={{ "Government": "Government", "Private": "Private", "Government Aided": "Government Aided" }}
                        fieldname={"school_type"}
                        formcontrol={control}
                    />
                </Row>
                <Row>
                    <DropDown
                        label="College bus needed?"
                        options={{ "Yes": "Yes", "No": "No" }}
                        fieldname={"college_bus"}
                        formcontrol={control}
                        sorted={false}
                    />
                    {isBoardingPointOpen &&
                        <DropDown
                            label="Boarding Point"
                            options={options['boarding_point']}
                            fieldname={"boarding_point"}
                            formcontrol={control}
                            storeLabel={true}
                        />
                    }
                    <InputField
                        label="Sports Interested"
                        registerProps={register("sports_int")}
                        type="text"
                        error={errors.sports_int && errors.sports_int.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label="First Graduate Application No."
                        registerProps={register("first_gr_appno")}
                        type="text"
                        error={errors.first_gr_appno && errors.first_gr_appno.message}
                    />
                    {/* <InputField
                        label="How did you choose this college?"
                        registerProps={register("choose_college")}
                        type="text"
                        error={errors.choose_college && errors.choose_college.message}
                    /> */}
                    <DropDown
                        label="How did you choose this college?"
                        options={{ "Friends and Relatives": "Friends and Relatives", "Sibling": "Sibling", "Newspaper": "Newspaper", "BIT Alumini": "BIT Alumini", "Social Media": "Social Media", "I did my own research": "I did my own research" }}
                        fieldname={"choose_college"}
                        formcontrol={control}
                        sorted={false}
                    />
                </Row>
            </Form>
        </div>
    )
}

export default AdditionalDetails
