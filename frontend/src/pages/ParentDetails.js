// Form-2
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useEffect, useState } from 'react'
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

function ParentDetails() {
    const navigate = useNavigate();
    const location = useLocation()
    const applicationNo = useSelector((state) => state.applicationNo.value)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const [formData, setFormData] = useState({
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
    })
    const [options, setOptions] = useState({
        'occupation': {},
        'designation': {},
    })

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: formData, resolver: yupResolver(schema.ParentDetails) });

    useEffect(() => {
        const getDefaultValues = async () => {
            const queryParams = Object.keys(formData).join(',')
            const fetchedData = await services.fetchData(applicationNo, queryParams)
            setFormData(fetchedData)
            reset(fetchedData)
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


    const onSubmit = async (data) => {
        setIsLoading(true)
        setError(null)
        const response = await services.updateData(applicationNo, data)

        if (response) {
            if (location.state && location.state.fromFinal) {
                navigate('/final_review')
            } else {
                navigate('/address_details')
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
            <Form handleNext={handleSubmit(onSubmit)} heading="Parent Details" handleBack={() => { navigate('/personal_details') }}>
                <Row>
                    <InputField
                        label="Father's Name"
                        registerProps={register("father_name")}
                        type="text"
                        error={errors.father_name && errors.father_name.message}
                        required
                        />
                    <DropDown
                        label="Father's Occupation"
                        options={options['occupation']}
                        fieldname={"occupation"}
                        formcontrol={control}
                        error={errors.occupation && errors.occupation.message}
                        required
                    />
                    <InputField
                        label="Father's Income"
                        registerProps={register("parent_income")}
                        type="number"
                        error={errors.parent_income && errors.parent_income.message}
                    />
                </Row>

                <Row>
                    <InputField
                        label="Organisation/Company"
                        registerProps={register("work_area")}
                        type="text"
                        error={errors.work_area && errors.work_area.message}
                    />
                    <DropDown
                        label="Designation"
                        options={options['designation']}
                        fieldname={"designation"}
                        formcontrol={control}
                    />
                </Row>
                <Row>

                    <InputField
                        label="Mother's Name"
                        registerProps={register("mother_name")}
                        type="text"
                        error={errors.mother_name && errors.mother_name.message}
                        required
                    />

                    <DropDown
                        label="Mother's Occupation"
                        options={options['occupation']}
                        fieldname={"occupation_mother"}
                        formcontrol={control}
                        error={errors.occupation_mother && errors.occupation_mother.message}
                        required
                    />

                    <InputField
                        label="Mother's Income"
                        registerProps={register("parent_income_mother")}
                        type="number"
                        error={errors.parent_income_mother && errors.parent_income_mother.message}
                    />
                </Row>

                <Row>
                    <InputField
                        label="Organisation/Company"
                        registerProps={register("work_area_mother")}
                        type="text"
                    />
                    <DropDown
                        label="Designation"
                        options={options['designation']}
                        fieldname={"designation_mother"}
                        formcontrol={control}
                    />

                </Row>

                <Row>
                    <InputField
                        label="Guardian Name"
                        registerProps={register("guardian_name")}
                        type="text"
                    />
                </Row>

            </Form>
        </div>
    )
}

export default ParentDetails