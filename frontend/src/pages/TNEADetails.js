// Form - 5
import { useForm } from "react-hook-form";
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';

import services from "../services/services";
import schema from "../utils/validation";

import InputField from '../Components/InputField'
import DropDown from '../Components/DropDown';
import Form from '../Components/Form';
import Row from "../Components/Row";
import Loading from "../Components/Loading";
import Error from "../Components/Error";

function TNEADetails() {
    const navigate = useNavigate();
    const location = useLocation()
    const applicationNo = useSelector((state) => state.applicationNo.value)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const [formData, setFormData] = useState({
        seat_cat: '',

        quota_id: '',
        tnea_app_no: '',
        tnea_adm_no: '',
        general_rank: '',
        comm_rank: '',
        tnea_pay_rec_no: '',
        tnea_pay_rec_date: null,
        tnea_pay_rec_amt: '',
        tnea_pay_bank: '',
    })

    const [options, setOptions] = useState({
        quota: {}
    });

    const { register, control, getValues, setValue, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: formData, resolver: yupResolver(schema.TNEADetails) });

    useEffect(() => {
        const getDefaultValues = async () => {
            const queryParams = Object.keys(formData).join(',')
            const fetchedData = await services.fetchData(applicationNo, queryParams)
            if (fetchedData.seat_cat === 'MANAGEMENT') {
                navigate('/scholarship_details', { state: { isManagement: true } })
            }
            setFormData(fetchedData)
            reset(fetchedData)
            if (getValues('tnea_pay_rec_date')) {
                let tnea_pay_rec_date = new Date(getValues('tnea_pay_rec_date')).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
                setValue('tnea_pay_rec_date', tnea_pay_rec_date)
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

    const onSubmit = async (data) => {
        setIsLoading(true)
        setError(null)
        const response = await services.updateData(applicationNo, data)

        if (response) {
            if (location.state && location.state.fromFinal) {
                navigate('/final_review')
            } else {
                navigate('/scholarship_details')
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
            <Form handleNext={handleSubmit(onSubmit)} heading="TNEA Details" handleBack={() => { navigate('/contact_details') }} >
                <Row>
                    <InputField
                        label="TNEA Application No."
                        registerProps={register("tnea_app_no")}
                        type="text"
                        error={errors.tnea_app_no && errors.tnea_app_no.message}
                    />
                    <DropDown
                        label="Quota"
                        options={options['quota']}
                        fieldname={"quota_id"}
                        formcontrol={control}
                        error={errors.quota_id && errors.quota_id.message}
                        required
                    />
                    <InputField
                        label="TNEA Admission No."
                        registerProps={register("tnea_adm_no")}
                        type="number"
                        error={errors.tnea_adm_no && errors.tnea_adm_no.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label="General Rank"
                        registerProps={register("general_rank")}
                        type="number"
                        error={errors.general_rank && errors.general_rank.message}
                    />
                    <InputField
                        label="Community Rank"
                        registerProps={register("comm_rank")}
                        type="number"
                        error={errors.comm_rank && errors.comm_rank.message}
                    />
                </Row>
                <div className="form-sub-header">TNEA Payment Details</div>
                <Row>
                    <InputField
                        label="Receipt No."
                        registerProps={register("tnea_pay_rec_no")}
                        type="text"
                        error={errors.tnea_pay_rec_no && errors.tnea_pay_rec_no.message}
                    />
                    <InputField
                        label="Receipt Date"
                        registerProps={register("tnea_pay_rec_date")}
                        type="date"
                        error={errors.tnea_pay_rec_date && errors.tnea_pay_rec_date.message}
                    />
                    <InputField
                        label="Receipt Amount"
                        registerProps={register("tnea_pay_rec_amt")}
                        type="number"
                        error={errors.tnea_pay_rec_amt && errors.tnea_pay_rec_amt.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label="Payment Bank"
                        placeholder="Bank Name, Place"
                        registerProps={register("tnea_pay_bank")}
                        type="text"
                        error={errors.tnea_pay_bank && errors.tnea_pay_bank.message}
                    />
                </Row>
            </Form>
        </div>
    )
}

export default TNEADetails
