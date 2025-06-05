// Form - 6
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

function ScholarshipDetails() {
    const navigate = useNavigate();
    const location = useLocation()
    const applicationNo = useSelector((state) => state.applicationNo.value)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const [formData, setFormData] = useState({
        adm_sch_name1: '',
        adm_sch_amt1: '',
        adm_sch_name2: '',
        adm_sch_amt2: '',
    })

    const [options, setOptions] = useState({});
    const [scholarship_data, setScholarshipData] = useState({});

    const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({ defaultValues: formData, resolver: yupResolver(schema.ScholarshipDetails) });

    useEffect(() => {
        const getDefaultValues = async () => {
            setIsLoading(true)
            const queryParams = Object.keys(formData).join(',')
            const fetchedData = await services.fetchData(applicationNo, queryParams)
            setFormData(fetchedData)
            reset(fetchedData)
            setIsLoading(false)
        }

        const getOptions = async () => {
            setError(null)
            const result = await services.fetchFromMaster('scholarship')
            setScholarshipData(result);

            let temp = {}
            for (const key in result) {
                temp[result[key].discount_id] = result[key].discount_name;
            }
            setOptions(temp);
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

    const scholarship1 = watch('adm_sch_name1')
    const scholarship2 = watch('adm_sch_name2')

    if (scholarship1) {
        setValue('adm_sch_amt1', scholarship_data[scholarship1].discount_amount)
    }
    if (scholarship2) {
        setValue('adm_sch_amt2', scholarship_data[scholarship2].discount_amount)
    }

    const onSubmit = async (data) => {
        setIsLoading(true)
        setError(null)

        const response = await services.updateData(applicationNo, data)

        if (response) {
            if (location.state && location.state.fromFinal) {
                navigate('/final_review')
            } else {
                navigate('/mark_details')
            }
        } else {
            setError("Error submitting form!")
        }
        setIsLoading(false)
    }

    const handleBack = () => {
        if (location.state && location.state.isManagement) {
            navigate('/contact_details')
        } else {
            navigate('/tnea_details')
        }
    }

    return (
        <div>
            {isLoading && <Loading />}
            {error && <Error message={error} />}
            <Form handleNext={handleSubmit(onSubmit)} heading="Scholarship Details" handleBack={handleBack} >
                <Row>
                    <DropDown
                        label="Scholarship-1"
                        options={options}
                        fieldname={"adm_sch_name1"}
                        formcontrol={control}
                        sorted={false}
                    />
                    <InputField
                        label="Amount-1"
                        registerProps={register("adm_sch_amt1")}
                        type="number"
                        error={errors.adm_sch_amt1 && errors.adm_sch_amt1.message}
                    />
                </Row>
                <Row>
                    <DropDown
                        label="Scholarship-2"
                        options={options}
                        fieldname={"adm_sch_name2"}
                        formcontrol={control}
                        sorted={false}
                    />
                    <InputField
                        label="Amount-2"
                        registerProps={register("adm_sch_amt2")}
                        type="number"
                        error={errors.adm_sch_amt2 && errors.adm_sch_amt2.message}
                    />
                </Row>
            </Form>
        </div>
    )
}

export default ScholarshipDetails
