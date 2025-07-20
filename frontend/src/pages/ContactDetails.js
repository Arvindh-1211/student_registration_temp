// Form-5
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

//TODO Mother phone number from address in camps
function ContactDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const applicationNo = useSelector((state) => state.applicationNo.value)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const [formData, setFormData] = useState({
        stu_mobile_no: '',
        stu_email_id: '',
        parent_mobile_no: '',
        parent_email_id: '',
        perm_phone_no: '',
        nominee_name: '',
        nominee_age: '',
        nominee_relation: '',
    })

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: formData, resolver: yupResolver(schema.ContactDetails) });

    useEffect(() => {
        const getDefaultValues = async () => {
            const queryParams = Object.keys(formData).join(',')
            const fetchedData = await services.fetchData(applicationNo, queryParams)
            setFormData(fetchedData)
            reset(fetchedData)
        }


        const init = async () => {
            setIsLoading(true)
            await getDefaultValues();
            setIsLoading(false)
        };

        if (applicationNo) {
            init();
        } else {
            navigate('/login')
        }
    }, [])

    const onSubmit = async (data) => {
        setIsLoading(true)
        setError(null)
        const response = await services.updateData(applicationNo, data)

        if (response) {
            if (location.state && location.state.fromFinal) {
                navigate('/final_review')
            } else {
                navigate('/tnea_details')
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
            <Form handleNext={handleSubmit(onSubmit)} heading="Contact & Insurance Details" handleBack={() => { navigate('/address_details') }} >
                <div className="form-sub-header">Contact Details</div>
                <Row>
                    <InputField
                        label="Student's Phone Number"
                        registerProps={register("stu_mobile_no")}
                        type='number' 
                        error={errors.stu_mobile_no && errors.stu_mobile_no.message}
                        required
                    />
                    <InputField
                        label="Student's Email ID"
                        registerProps={register("stu_email_id")}
                        type='email'
                        error={errors.stu_email_id && errors.stu_email_id.message}
                        required
                    />
                </Row>

                <Row>
                    <InputField
                        label="Parent's Phone Number"
                        registerProps={register("parent_mobile_no")}
                        type='number'
                        error={errors.parent_mobile_no && errors.parent_mobile_no.message}
                        required
                    />
                    <InputField
                        label="Parent's Email ID"
                        registerProps={register("parent_email_id")}
                        type='email'
                        error={errors.parent_email_id && errors.parent_email_id.message}
                    />
                </Row>

                <Row>
                    <InputField
                        label="Mother's Phone Number"
                        registerProps={register("perm_phone_no")}
                        type='number'
                        error={errors.perm_phone_no && errors.perm_phone_no.message}
                        required
                    />
                </Row>

                <div className="form-sub-header">Insurance Details</div>
                <Row>
                    <DropDown
                        label="Nominee's Relation"
                        options={{ FATHER: 'FATHER', MOTHER: 'MOTHER', GUARDIAN: 'GUARDIAN', BROTHER: 'BROTHER', SISTER: 'SISTER', SPOUSE: 'SPOUSE' }}
                        fieldname={'nominee_relation'}
                        formcontrol={control}
                        sorted={false}
                        error={errors.nominee_relation && errors.nominee_relation.message}
                        required
                    />
                    <InputField
                        label="Nominee's Name"
                        registerProps={register("nominee_name")}
                        type='text'
                        error={errors.nominee_name && errors.nominee_name.message}
                        required
                    />
                    <InputField
                        label="Nominee's Age"
                        registerProps={register("nominee_age")}
                        type='number'
                        error={errors.nominee_age && errors.nominee_age.message}
                        required
                    />
                </Row>
            </Form>
        </div>
    )
}

export default ContactDetails