// Form-5
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

function MarkDetails() {
    const navigate = useNavigate();
    const location = useLocation()
    const applicationNo = useSelector((state) => state.applicationNo.value)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const [formData, setFormData] = useState({
        school_name: null,
        school_tc_no: null,
        school_tc_date: null,
        sch_attempt: null,

        sch_reg1: null,
        sch_cer1: null,
        sch_tot_mark1: 0,
        sch_reg2: null,
        sch_cer2: null,
        sch_tot_mark2: 0,

        physics_secured: 0,
        physics_max: 100,
        physics_percentage: 0,

        chemistry_secured: 0,
        chemistry_max: 100,
        chemistry_percentage: 0,

        maths_secured: 0,
        maths_max: 100,
        maths_percentage: 0,

        biology_secured: 0,
        biology_max: 100,
        biology_percentage: 0,

        cs_secured: 0,
        cs_max: 100,
        cs_percentage: 0,

        pcm_sec: 0,
        pcm_max: 300,
        pcm_per: 0,

        phy_che: 0,
        maths: 0,
        cut_off: 0,

        diploma_first_sec: 0,
        diploma_first_max: 100,
        diploma_first_per: 0,

        diploma_second_sec: 0,
        diploma_second_max: 100,
        diploma_second_per: 0,

        diploma_third_sec: 0,
        diploma_third_max: 100,
        diploma_third_per: 0,

        diploma_fourth_sec: 0,
        diploma_fourth_max: 100,
        diploma_fourth_per: 0,

        diploma_fifth_sec: 0,
        diploma_fifth_max: 100,
        diploma_fifth_per: 0,

        diploma_sixth_sec: 0,
        diploma_sixth_max: 100,
        diploma_sixth_per: 0,

        diploma_seventh_sec: 0,
        diploma_seventh_max: 100,
        diploma_seventh_per: 0,

        diploma_eighth_sec: 0,
        diploma_eighth_max: 100,
        diploma_eighth_per: 0,

        diploma_ninenth_sec: 0,
        diploma_ninenth_max: 100,
        diploma_ninenth_per: 0,

        diploma_tenth_sec: 0,
        diploma_tenth_max: 100,
        diploma_tenth_per: 0,

        ug_mark_sec: 0,
        ug_mark_max: 100,
        ug_mark_per: 0,

        I_II: 0,
        III_IV: 0,
        V_VI: 0,
        VII_VIII: 0,
        IX_X: 0,

        entrance_secured: 0,
        entrance_max: 100,
        entrance_percenteage: 0,

        school_board: null,
        sch_qual_id: null,
        sch_yr_pass: null,
        sch_study_state: null,
        study_medium: null,
        school_class: null,
    })

    const [options, setOptions] = useState({
        'school_name' :{},
        'school_board': {},
        'sch_qual_id': {},
        'sch_yr_pass': {},
        'state': {},
        'study_medium': {},
    })

    const { handleSubmit, reset, register, control, watch, getValues, setValue, formState: { errors } } = useForm({ defaultValues: formData, resolver: yupResolver(schema.MarkDetails) });

    useEffect(() => {
        const getDefaultValues = async () => {
            const queryParams = Object.keys(formData).join(',')
            const fetchedData = await services.fetchData(applicationNo, queryParams)
            const cleanedData = Object.entries(fetchedData).reduce((acc, [key, value]) => {
                acc[key] = value === "0.00" ? 0 : value;
                return acc;
            }, {});
            setFormData(cleanedData)
            reset(cleanedData)
            if (getValues('school_tc_date')) {
                let school_tc_date = new Date(getValues('school_tc_date')).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
                setValue('school_tc_date', school_tc_date)
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

    const schoolQualification = watch('sch_qual_id')

    useEffect(() => {

        const updateSchoolClass = async () => {  
            if(schoolQualification){
                const schoolClass = await services.getValueFromMaster('sch_qual_id', schoolQualification)
                setValue('school_class', schoolClass)
            } 
        }

        updateSchoolClass()
    }, [schoolQualification])

    const calculatePercentage = (sec, max) => {
        return (sec && max) ? ((sec / max) * 100).toFixed(2) : 0
    }

    const calculateAverage = (mark1, mark2) => {
        return (mark1 && mark2) ? ((mark1 + mark2) / 2).toFixed(2) : 0
    }

    const physicsSec = Number(watch('physics_secured'))
    const physicsMax = Number(watch('physics_max'))

    const chemistrySec = Number(watch('chemistry_secured'))
    const chemistryMax = Number(watch('chemistry_max'))

    const mathsSec = Number(watch('maths_secured'))
    const mathsMax = Number(watch('maths_max'))

    const biologySec = Number(watch('biology_secured'))
    const biologyMax = Number(watch('biology_max'))

    const csSec = Number(watch('cs_secured'))
    const csMax = Number(watch('cs_max'))

    const diplomaFirstSec = Number(watch('diploma_first_sec'))
    const diplomaFirstMax = Number(watch('diploma_first_max'))

    const diplomaSecondSec = Number(watch('diploma_second_sec'))
    const diplomaSecondMax = Number(watch('diploma_second_max'))

    const diplomaThirdSec = Number(watch('diploma_third_sec'))
    const diplomaThirdMax = Number(watch('diploma_third_max'))

    const diplomaFourthSec = Number(watch('diploma_fourth_sec'))
    const diplomaFourthMax = Number(watch('diploma_fourth_max'))

    const diplomaFifthSec = Number(watch('diploma_fifth_sec'))
    const diplomaFifthMax = Number(watch('diploma_fifth_max'))

    const diplomaSixthSec = Number(watch('diploma_sixth_sec'))
    const diplomaSixthMax = Number(watch('diploma_sixth_max'))

    const diplomaSeventhSec = Number(watch('diploma_seventh_sec'))
    const diplomaSeventhMax = Number(watch('diploma_seventh_max'))

    const diplomaEighthSec = Number(watch('diploma_eighth_sec'))
    const diplomaEighthMax = Number(watch('diploma_eighth_max'))

    const diplomaNinthSec = Number(watch('diploma_ninenth_sec'))
    const diplomaNinthMax = Number(watch('diploma_ninenth_max'))

    const diplomaTenthSec = Number(watch('diploma_tenth_sec'))
    const diplomaTenthMax = Number(watch('diploma_tenth_max'))

    const ugMarkSec = Number(watch('ug_mark_sec'))
    const ugMarkMax = Number(watch('ug_mark_max'))

    const entranceSec = Number(watch('entrance_secured'))
    const entranceMax = Number(watch('entrance_max'))

    useEffect(() => {
        // Calculate and set all derived values here

        const physicsPer = Number(calculatePercentage(physicsSec, physicsMax));
        setValue('physics_percentage', physicsPer);

        const chemistryPer = Number(calculatePercentage(chemistrySec, chemistryMax));
        setValue('chemistry_percentage', chemistryPer);

        const mathsPer = Number(calculatePercentage(mathsSec, mathsMax));
        setValue('maths_percentage', mathsPer);

        setValue('biology_percentage', calculatePercentage(biologySec, biologyMax));
        setValue('cs_percentage', calculatePercentage(csSec, csMax));

        const pcmSec = Number(physicsSec + chemistrySec + mathsSec);
        setValue('pcm_sec', pcmSec);

        const pcmMax = Number(physicsMax + chemistryMax + mathsMax);
        setValue('pcm_max', pcmMax);

        setValue('pcm_per', calculatePercentage(pcmSec, pcmMax));

        const phy_che = Number(calculateAverage(physicsPer, chemistryPer));
        setValue('phy_che', phy_che);
        setValue('maths', mathsPer);
        setValue('cut_off', phy_che + mathsPer);

        const diplomaFirstPer = Number(calculatePercentage(diplomaFirstSec, diplomaFirstMax));
        setValue('diploma_first_per', diplomaFirstPer);

        const diplomaSecondPer = Number(calculatePercentage(diplomaSecondSec, diplomaSecondMax));
        setValue('diploma_second_per', diplomaSecondPer);

        const diplomaThirdPer = Number(calculatePercentage(diplomaThirdSec, diplomaThirdMax));
        setValue('diploma_third_per', diplomaThirdPer);

        const diplomaFourthPer = Number(calculatePercentage(diplomaFourthSec, diplomaFourthMax));
        setValue('diploma_fourth_per', diplomaFourthPer);

        const diplomaFifthPer = Number(calculatePercentage(diplomaFifthSec, diplomaFifthMax));
        setValue('diploma_fifth_per', diplomaFifthPer);

        const diplomaSixthPer = Number(calculatePercentage(diplomaSixthSec, diplomaSixthMax));
        setValue('diploma_sixth_per', diplomaSixthPer);

        const diplomaSeventhPer = Number(calculatePercentage(diplomaSeventhSec, diplomaSeventhMax));
        setValue('diploma_seventh_per', diplomaSeventhPer);

        const diplomaEighthPer = Number(calculatePercentage(diplomaEighthSec, diplomaEighthMax));
        setValue('diploma_eighth_per', diplomaEighthPer);

        const diplomaNinthPer = Number(calculatePercentage(diplomaNinthSec, diplomaNinthMax));
        setValue('diploma_ninenth_per', diplomaNinthPer);

        const diplomaTenthPer = Number(calculatePercentage(diplomaTenthSec, diplomaTenthMax));
        setValue('diploma_tenth_per', diplomaTenthPer);

        setValue('ug_mark_per', calculatePercentage(ugMarkSec, ugMarkMax));

        setValue('I_II', calculateAverage(diplomaFirstPer, diplomaSecondPer));
        setValue('III_IV', calculateAverage(diplomaThirdPer, diplomaFourthPer));
        setValue('V_VI', calculateAverage(diplomaFifthPer, diplomaSixthPer));
        setValue('VII_VIII', calculateAverage(diplomaSeventhPer, diplomaEighthPer));
        setValue('IX_X', calculateAverage(diplomaNinthPer, diplomaTenthPer));

        setValue('entrance_percenteage', calculatePercentage(entranceSec, entranceMax));
    }, [
        physicsSec, physicsMax,
        chemistrySec, chemistryMax,
        mathsSec, mathsMax,
        biologySec, biologyMax,
        csSec, csMax,
        diplomaFirstSec, diplomaFirstMax,
        diplomaSecondSec, diplomaSecondMax,
        diplomaThirdSec, diplomaThirdMax,
        diplomaFourthSec, diplomaFourthMax,
        diplomaFifthSec, diplomaFifthMax,
        diplomaSixthSec, diplomaSixthMax,
        diplomaSeventhSec, diplomaSeventhMax,
        diplomaEighthSec, diplomaEighthMax,
        diplomaNinthSec, diplomaNinthMax,
        diplomaTenthSec, diplomaTenthMax,
        ugMarkSec, ugMarkMax,
        entranceSec, entranceMax
    ]);


    const onSubmit = async (data) => {
        setIsLoading(true)
        setError(null)

        const response = await services.updateData(applicationNo, data)

        if (response) {
            if (location.state && location.state.fromFinal) {
                navigate('/final_review')
            } else {
                navigate('/additional_details')
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
            <Form handleNext={handleSubmit(onSubmit)} heading="Mark Details" handleBack={() => { navigate('/scholarship_details') }} >
                <Row>
                    {/* <InputField
                        label='School Name'
                        registerProps={register("school_name")}
                        type='text'
                        error={errors.school_name && errors.school_name.message}
                        required
                    /> */}
                    <DropDown
                        label="School Name"
                        options={options['school_name']}
                        fieldname={"school_name"}
                        formcontrol={control}
                        storeLabel={true}
                    // sorted={false}
                    />
                    <DropDown
                        label="School Board"
                        options={options['school_board']}
                        fieldname={"school_board"}
                        formcontrol={control}
                        storeLabel={true}
                    // sorted={false}
                    />
                    <DropDown
                        label="Qualification"
                        options={options['sch_qual_id']}
                        fieldname={"sch_qual_id"}
                        formcontrol={control}
                        sorted={false}
                    />
                </Row>
                <Row>
                    <InputField
                        label='TC Number'
                        registerProps={register("school_tc_no")}
                        type='text'
                        error={errors.school_tc_no && errors.school_tc_no.message}
                        required
                    />
                    <InputField
                        label='TC Date'
                        registerProps={register("school_tc_date")}
                        type='date'
                        error={errors.school_tc_date && errors.school_tc_date.message}
                        required
                    />
                    <InputField
                        label='School class'
                        registerProps={register("school_class")}
                        type='text'
                        readOnly={true}
                        error={errors.school_class && errors.school_class.message}
                    />
                </Row>
                <Row>
                    <DropDown
                        label="School Year of Passing"
                        options={options['sch_yr_pass']}
                        fieldname={"sch_yr_pass"}
                        formcontrol={control}
                        sorted={false}
                        required
                    />
                    <DropDown
                        label="Study state"
                        options={options['state']}
                        fieldname={"sch_study_state"}
                        formcontrol={control}
                        storeLabel={true}
                    />
                    <DropDown
                        label="Medium of Instruction"
                        options={options['study_medium']}
                        fieldname={"study_medium"}
                        storeLabel={true}
                        formcontrol={control}
                    />
                </Row>
                <Row>
                    <InputField
                        label='Number of Attempts'
                        registerProps={register("sch_attempt")}
                        type='number'
                        error={errors.sch_attempt && errors.sch_attempt.message}
                        required
                    />
                </Row>

                <hr></hr>
                <div className="form-sub-header">Marksheet Details</div>
                <Row>
                    <InputField
                        label='Register Number 1'
                        registerProps={register("sch_reg1")}
                        type='text'
                        error={errors.sch_reg1 && errors.sch_reg1.message}
                    />
                    <InputField
                        label='Certificate Number'
                        registerProps={register("sch_cer1")}
                        type='text'
                        error={errors.sch_cer1 && errors.sch_cer1.message}
                    />
                    <InputField
                        label='Total Marks'
                        registerProps={register("sch_tot_mark1")}
                        type='number'
                        error={errors.sch_tot_mark1 && errors.sch_tot_mark1.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='EMIS ID'
                        registerProps={register("sch_reg2")}
                        type='text'
                        error={errors.sch_reg2 && errors.sch_reg2.message}
                    />
                    <InputField
                        label='Certificate Number'
                        registerProps={register("sch_cer2")}
                        type='text'
                        error={errors.sch_cer2 && errors.sch_cer2.message}
                    />
                    <InputField
                        label='Total Marks'
                        registerProps={register("sch_tot_mark2")}
                        type='number'
                        error={errors.sch_tot_mark2 && errors.sch_tot_mark2.message}
                    />
                </Row>

                <hr></hr>
                <div className="form-sub-header">HSC Details</div>
                <Row>
                    <InputField
                        label='Physics Marks Secured'
                        registerProps={register("physics_secured")}
                        type='number'
                        error={errors.physics_secured && errors.physics_secured.message}
                    />
                    <InputField
                        label='Physics Maximum Marks'
                        registerProps={register("physics_max")}
                        type='number'
                        error={errors.physics_max && errors.physics_max.message}
                    />
                    <InputField
                        label='Physics Percentage'
                        registerProps={register("physics_percentage")}
                        type='number'
                        readOnly={true}
                        error={errors.physics_percentage && errors.physics_percentage.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='Chemistry Marks Secured'
                        registerProps={register("chemistry_secured")}
                        type='number'
                        error={errors.chemistry_secured && errors.chemistry_secured.message}
                    />
                    <InputField
                        label='Chemistry Maximum Marks'
                        registerProps={register("chemistry_max")}
                        type='number'
                        error={errors.chemistry_max && errors.chemistry_max.message}
                    />
                    <InputField
                        label='Chemistry Percentage'
                        registerProps={register("chemistry_percentage")}
                        type='number'
                        readOnly={true}
                        error={errors.chemistry_percentage && errors.chemistry_percentage.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='Maths Marks Secured'
                        registerProps={register("maths_secured")}
                        type='number'
                        error={errors.maths_secured && errors.maths_secured.message}
                    />
                    <InputField
                        label='Maths Maximum Marks'
                        registerProps={register("maths_max")}
                        type='number'
                        error={errors.maths_max && errors.maths_max.message}
                    />
                    <InputField
                        label='Maths Percentage'
                        registerProps={register("maths_percentage")}
                        type='number'
                        readOnly={true}
                        error={errors.maths_percentage && errors.maths_percentage.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='Biology Marks Secured'
                        registerProps={register("biology_secured")}
                        type='number'
                        error={errors.biology_secured && errors.biology_secured.message}
                    />
                    <InputField
                        label='Biology Maximum Marks'
                        registerProps={register("biology_max")}
                        type='number'
                        error={errors.biology_max && errors.biology_max.message}
                    />
                    <InputField
                        label='Biology Percentage'
                        registerProps={register("biology_percentage")}
                        type='number'
                        readOnly={true}
                        error={errors.biology_percentage && errors.biology_percentage.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='CS Marks Secured'
                        registerProps={register("cs_secured")}
                        type='number'
                        error={errors.cs_secured && errors.cs_secured.message}
                    />
                    <InputField
                        label='CS Maximum Marks'
                        registerProps={register("cs_max")}
                        type='number'
                        error={errors.cs_max && errors.cs_max.message}
                    />
                    <InputField
                        label='CS Percentage'
                        registerProps={register("cs_percentage")}
                        type='number'
                        readOnly={true}
                        error={errors.cs_percentage && errors.cs_percentage.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='Total Marks Secured'
                        registerProps={register("pcm_sec")}
                        type='number'
                        readOnly={true}
                        error={errors.pcm_sec && errors.pcm_sec.message}
                    />
                    <InputField
                        label='Total Maximum Marks'
                        registerProps={register("pcm_max")}
                        type='number'
                        readOnly={true}
                        error={errors.pcm_max && errors.pcm_max.message}
                    />
                    <InputField
                        label='Total Percentage'
                        registerProps={register("pcm_per")}
                        type='number'
                        readOnly={true}
                        error={errors.pcm_per && errors.pcm_per.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='Physics + Chemistry Percentage'
                        registerProps={register("phy_che")}
                        type='number'
                        readOnly={true}
                        error={errors.phy_che && errors.phy_che.message}
                    />
                    <InputField
                        label='Maths Percentage'
                        registerProps={register("maths")}
                        type='number'
                        readOnly={true}
                        error={errors.maths && errors.maths.message}
                    />
                    <InputField
                        label='Cutoff'
                        registerProps={register("cut_off")}
                        type='number'
                        readOnly={true}
                        error={errors.cut_off && errors.cut_off.message}
                    />
                </Row>

                <hr></hr>
                <div className="form-sub-header">Diploma/UG/PG Details</div>
                <Row>
                    <InputField
                        label='I sem Marks Secured'
                        registerProps={register("diploma_first_sec")}
                        type='number'
                        error={errors.diploma_first_sec && errors.diploma_first_sec.message}
                    />
                    <InputField
                        label='I sem Maximum Marks'
                        registerProps={register("diploma_first_max")}
                        type='number'
                        error={errors.diploma_first_sec && errors.diploma_first_sec.message}
                    />
                    <InputField
                        label='I sem percentage'
                        registerProps={register("diploma_first_per")}
                        type='number'
                        readOnly={true}
                        error={errors.diploma_first_per && errors.diploma_first_per.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='II sem Marks Secured'
                        registerProps={register("diploma_second_sec")}
                        type='number'
                        error={errors.diploma_second_sec && errors.diploma_second_sec.message}
                    />
                    <InputField
                        label='II sem Maximum Marks'
                        registerProps={register("diploma_second_max")}
                        type='number'
                        error={errors.diploma_second_max && errors.diploma_second_max.message}
                    />
                    <InputField
                        label='II sem percentage'
                        registerProps={register("diploma_second_per")}
                        type='number'
                        readOnly={true}
                        error={errors.diploma_second_per && errors.diploma_second_per.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='III sem Marks Secured'
                        registerProps={register("diploma_third_sec")}
                        type='number'
                        error={errors.diploma_third_sec && errors.diploma_third_sec.message}
                    />
                    <InputField
                        label='III sem Maximum Marks'
                        registerProps={register("diploma_third_max")}
                        type='number'
                        error={errors.diploma_third_max && errors.diploma_third_max.message}
                    />
                    <InputField
                        label='III sem percentage'
                        registerProps={register("diploma_third_per")}
                        type='number'
                        readOnly={true}
                        error={errors.diploma_third_per && errors.diploma_third_per.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='IV sem Marks Secured'
                        registerProps={register("diploma_fourth_sec")}
                        type='number'
                        error={errors.diploma_fourth_sec && errors.diploma_fourth_sec.message}
                    />
                    <InputField
                        label='IV sem Maximum Marks'
                        registerProps={register("diploma_fourth_max")}
                        type='number'
                        error={errors.diploma_fourth_max && errors.diploma_fourth_max.message}
                    />
                    <InputField
                        label='IV sem percentage'
                        registerProps={register("diploma_fourth_per")}
                        type='number'
                        readOnly={true}
                        error={errors.diploma_fourth_per && errors.diploma_fourth_per.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='V sem Marks Secured'
                        registerProps={register("diploma_fifth_sec")}
                        type='number'
                        error={errors.diploma_fifth_sec && errors.diploma_fifth_sec.message}
                    />
                    <InputField
                        label='V sem Maximum Marks'
                        registerProps={register("diploma_fifth_max")}
                        type='number'
                        error={errors.diploma_fifth_max && errors.diploma_fifth_max.message}
                    />
                    <InputField
                        label='V sem percentage'
                        registerProps={register("diploma_fifth_per")}
                        type='number'
                        readOnly={true}
                        error={errors.diploma_fifth_per && errors.diploma_fifth_per.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='VI sem Marks Secured'
                        registerProps={register("diploma_sixth_sec")}
                        type='number'
                        error={errors.diploma_sixth_sec && errors.diploma_sixth_sec.message}
                    />
                    <InputField
                        label='VI sem Maximum Marks'
                        registerProps={register("diploma_sixth_max")}
                        type='number'
                        error={errors.diploma_sixth_max && errors.diploma_sixth_max.message}
                    />
                    <InputField
                        label='VI sem percentage'
                        registerProps={register("diploma_sixth_per")}
                        type='number'
                        readOnly={true}
                        error={errors.diploma_sixth_per && errors.diploma_sixth_per.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='VII sem Marks Secured'
                        registerProps={register("diploma_seventh_sec")}
                        type='number'
                        error={errors.diploma_seventh_sec && errors.diploma_seventh_sec.message}
                    />
                    <InputField
                        label='VII sem Maximum Marks'
                        registerProps={register("diploma_seventh_max")}
                        type='number'
                        error={errors.diploma_seventh_max && errors.diploma_seventh_max.message}
                    />
                    <InputField
                        label='VII sem percentage'
                        registerProps={register("diploma_seventh_per")}
                        type='number'
                        readOnly={true}
                        error={errors.diploma_seventh_per && errors.diploma_seventh_per.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='VIII sem Marks Secured'
                        registerProps={register("diploma_eighth_sec")}
                        type='number'
                        error={errors.diploma_eighth_sec && errors.diploma_eighth_sec.message}
                    />
                    <InputField
                        label='VIII sem Maximum Marks'
                        registerProps={register("diploma_eighth_max")}
                        type='number'
                        error={errors.diploma_eighth_max && errors.diploma_eighth_max.message}
                    />
                    <InputField
                        label='VIII sem percentage'
                        registerProps={register("diploma_eighth_per")}
                        type='number'
                        readOnly={true}
                        error={errors.diploma_eighth_per && errors.diploma_eighth_per.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='IX sem Marks Secured'
                        registerProps={register("diploma_ninenth_sec")}
                        type='number'
                        error={errors.diploma_ninenth_sec && errors.diploma_ninenth_sec.message}
                    />
                    <InputField
                        label='IX sem Maximum Marks'
                        registerProps={register("diploma_ninenth_max")}
                        type='number'
                        error={errors.diploma_ninenth_max && errors.diploma_ninenth_max.message}
                    />
                    <InputField
                        label='IX sem percentage'
                        registerProps={register("diploma_ninenth_per")}
                        type='number'
                        readOnly={true}
                        error={errors.diploma_ninenth_per && errors.diploma_ninenth_per.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='X sem Marks Secured'
                        registerProps={register("diploma_tenth_sec")}
                        type='number'
                        error={errors.diploma_tenth_sec && errors.diploma_tenth_sec.message}
                    />
                    <InputField
                        label='X sem Maximum Marks'
                        registerProps={register("diploma_tenth_max")}
                        type='number'
                    />
                    <InputField
                        label='X sem percentage'
                        registerProps={register("diploma_tenth_per")}
                        type='number'
                        readOnly={true}
                        error={errors.diploma_tenth_per && errors.diploma_tenth_per.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='UG sem Marks Secured'
                        registerProps={register("ug_mark_sec")}
                        type='number'
                        error={errors.ug_mark_sec && errors.ug_mark_sec.message}
                    />
                    <InputField
                        label='UG sem Maximum Marks'
                        registerProps={register("ug_mark_max")}
                        type='number'
                        error={errors.ug_mark_max && errors.ug_mark_max.message}
                    />
                    <InputField
                        label='UG sem percentage'
                        registerProps={register("ug_mark_per")}
                        type='number'
                        readOnly={true}
                        error={errors.ug_mark_per && errors.ug_mark_per.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='I + II Percentage'
                        registerProps={register("I_II")}
                        type='number'
                        readOnly={true}
                        error={errors.I_II && errors.I_II.message}
                    />
                    <InputField
                        label='III + IV Percentage'
                        registerProps={register("III_IV")}
                        type='number'
                        readOnly={true}
                        error={errors.III_IV && errors.III_IV.message}
                    />
                    <InputField
                        label='V + VI Percentage'
                        registerProps={register("V_VI")}
                        type='number'
                        readOnly={true}
                        error={errors.V_VI && errors.V_VI.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='VII + VIII Percentage'
                        registerProps={register("VII_VIII")}
                        type='number'
                        readOnly={true}
                        error={errors.VII_VIII && errors.VII_VIII.message}
                    />
                    <InputField
                        label='IX + X Percentage'
                        registerProps={register("IX_X")}
                        type='number'
                        readOnly={true}
                        error={errors.IX_X && errors.IX_X.message}
                    />
                </Row>
                <Row>
                    <InputField
                        label='Entrance Marks Secured'
                        registerProps={register("entrance_secured")}
                        type='number'
                        error={errors.entrance_secured && errors.entrance_secured.message}
                    />
                    <InputField
                        label='Entrance Maximum Marks'
                        registerProps={register("entrance_max")}
                        type='number'
                        error={errors.entrance_max && errors.entrance_max.message}
                    />
                    <InputField
                        label='Entrance percentage'
                        registerProps={register("entrance_percenteage")}
                        type='number'
                        readOnly={true}
                        error={errors.entrance_percenteage && errors.entrance_percenteage.message}
                    />
                </Row>
            </Form>
        </div>
    )
}

export default MarkDetails