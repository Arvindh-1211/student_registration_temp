// Form-4
import { useForm } from "react-hook-form";
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup';

import services from "../services/services";
import schema from "../utils/validation";

import InputField from '../Components/InputField'
import DropDown from '../Components/DropDown';
import CheckBox from '../Components/CheckBox'
import Form from '../Components/Form';
import Row from "../Components/Row";
import Loading from "../Components/Loading";
import Error from "../Components/Error";


function AddressDetails() {
    const navigate = useNavigate();
    const location = useLocation()
    const applicationNo = useSelector((state) => state.applicationNo.value)
    const [isAddressSame, setIsAddressSame] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const [formData, setFormData] = useState({
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
    })

    const [options, setOptions] = useState({
        'city': {},
        'district': {},
        'state': {},
        'country': {},
    })

    const { register, control, getValues, setValue, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: formData, resolver: yupResolver(schema.AddressDetails) });

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

        if(applicationNo){
            init();
        } else {
            navigate('/login')
        }
    }, [])



    useEffect(() => {
        if (isAddressSame) {
            setValue('perm_add_street', getValues('comm_add_street'));
            setValue('perm_add_town', getValues('comm_add_town'));
            setValue('perm_add_city', getValues('comm_add_city'));
            setValue('perm_add_district', getValues('comm_add_district'));
            setValue('perm_add_state', getValues('comm_add_state'));
            setValue('perm_add_country', getValues('comm_add_country'));
            setValue('perm_add_pincode', getValues('comm_add_pincode'));
        }
    }, [isAddressSame, getValues, setValue]);


    const onSubmit = async (data) => {
        setIsLoading(true)
        setError(null)
        const response = await services.updateData(applicationNo, data)

        if (response) {
            if (location.state && location.state.fromFinal) {
                navigate('/final_review')
            } else {
                navigate('/contact_details')
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
            <Form handleNext={handleSubmit(onSubmit)} heading="Address Details" handleBack={() => { navigate('/parent_details') }} >
                <div className="form-sub-header">Communication Address</div>
                <Row>
                    <InputField
                        label='Street'
                        registerProps={register("comm_add_street")}
                        type='text'
                        error={errors.comm_add_street && errors.comm_add_street.message}
                        required
                    />
                    <InputField
                        label='Town'
                        registerProps={register("comm_add_town")}
                        type='text'
                        error={errors.comm_add_town && errors.comm_add_town.message}
                        required
                    />
                    <DropDown
                        label="City"
                        options={options['city']}
                        fieldname={"comm_add_city"}
                        formcontrol={control}
                        storeLabel={true}
                        error={errors.comm_add_city && errors.comm_add_city.message}
                        required
                    />
                </Row>

                <Row>
                    <DropDown
                        label="District"
                        options={options['district']}
                        fieldname={"comm_add_district"}
                        formcontrol={control}
                        storeLabel={true}
                        error={errors.comm_add_district && errors.comm_add_district.message}
                        required
                    />
                    <DropDown
                        label="State"
                        options={options['state']}
                        fieldname={"comm_add_state"}
                        formcontrol={control}
                        storeLabel={true}
                        error={errors.comm_add_state && errors.comm_add_state.message}
                        required
                    />
                    <DropDown
                        label="Country"
                        options={options['country']}
                        fieldname={"comm_add_country"}
                        formcontrol={control}
                        storeLabel={true}
                        error={errors.comm_add_country && errors.comm_add_country.message}
                        required
                    />
                </Row>

                <Row>
                    <InputField
                        label='Pincode'
                        registerProps={register("comm_add_pincode")}
                        type='number'
                        error={errors.comm_add_pincode && errors.comm_add_pincode.message}
                        required
                    />
                    <DropDown
                        label="Area Location"
                        options={{ "RURAL": "RURAL", "URBAN": "Urban" }}
                        fieldname={"area_location"}
                        formcontrol={control}
                        required
                    />
                </Row>

                <div className="form-sub-header">Permanent Address</div>
                <Row>
                    <CheckBox
                        label='Same as Communication Address'
                        onClick={() => {
                            setIsAddressSame(!isAddressSame)
                        }} />
                </Row>

                <Row>
                    <InputField
                        label='Street'
                        registerProps={register("perm_add_street")}
                        type='text'
                        readOnly={isAddressSame}
                        error={errors.perm_add_street && errors.perm_add_street.message}
                        required
                    />
                    <InputField
                        label='Town'
                        registerProps={register("perm_add_town")}
                        type='text'
                        readOnly={isAddressSame}
                        error={errors.perm_add_town && errors.perm_add_town.message}
                        required
                    />
                    <DropDown
                        label="City"
                        options={options['city']}
                        fieldname={"perm_add_city"}
                        formcontrol={control}
                        storeLabel={true}
                        error={errors.perm_add_city && errors.perm_add_city.message}
                        required
                    />
                </Row>

                <Row>
                    <DropDown
                        label="District"
                        options={options['district']}
                        fieldname={"perm_add_district"}
                        formcontrol={control}
                        storeLabel={true}
                        error={errors.perm_add_district && errors.perm_add_district.message}
                        required
                    />
                    <DropDown
                        label="State"
                        options={options['state']}
                        fieldname={"perm_add_state"}
                        formcontrol={control}
                        storeLabel={true}
                        required
                    />
                    <DropDown
                        label="Country"
                        options={options['country']}
                        fieldname={"perm_add_country"}
                        formcontrol={control}
                        storeLabel={true}
                        error={errors.perm_add_country && errors.perm_add_country.message}
                        required
                    />
                </Row>

                <Row>
                    <InputField
                        label='Pincode'
                        registerProps={register("perm_add_pincode")}
                        type='number'
                        readOnly={isAddressSame}
                        error={errors.perm_add_pincode && errors.perm_add_pincode.message}
                        required
                    />
                </Row>
            </Form>
        </div>
    )
}

export default AddressDetails