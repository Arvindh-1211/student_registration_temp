import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';

import services from "../services/services";
import schema from "../utils/validation";

import Row from './Row'
import InputField from './InputField'
import DropDown from '../Components/DropDown';
import Loading from './Loading'
import Error from './Error'

function AddStudent() {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isDegreeLevelSelected, setIsDegreeLevelSelected] = useState(false);

    const { register, control, watch, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema.AddStudent) });

    const [branchOptions, setBranchOptions] = useState({});
    const [options, setOptions] = useState({
        community: {},
        branch: {},
    });
    useEffect(() => {
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

            // Transform branch options to { id: name }
            if (newOptions.branch) {
                const branchObj = {};
                Object.values(newOptions.branch).forEach(branch => {
                    branchObj[branch.branch_id] = branch.branch_name;
                });
                setBranchOptions(branchObj);
            }
        };
        getOptions();

    }, []);

    const degreeLevel = watch("degree_level");
    useEffect(() => {
        if (degreeLevel) {
            const level = {
                "UG": [1, 9, 15],
                "PG": [10, 11, 12, 13, 14],
            }
            const filteredBranches = Object.values(options.branch || {}).filter(branch =>
                level[degreeLevel].includes(branch.course_id)
            );
            const branchObj = {};
            filteredBranches.forEach(branch => {
                branchObj[branch.branch_id] = branch.branch_name;
            });
            setBranchOptions(branchObj);
            setIsDegreeLevelSelected(true);
        } else {
            setIsDegreeLevelSelected(false);
        }
    }, [degreeLevel]);


    const studentCategoryOptions = {
        "G": "GOVERNMENT",
        "GL": "GOVERNMENT LATERAL",
        "M": "MANAGEMENT",
        "ML": "MANAGEMENT LATERAL"
    }

    const degreeLevelOptions = {
        "UG": "UG",
        "PG": "PG"
    }

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const modifiedData = {
                application_id: `${data.student_category}${data.application_id}`,
                name: data.name,
                email: data.email,
                mobile: data.mobile,
                community: data.community,
                gender: data.gender.toUpperCase(),
                degree_level: data.degree_level,
                branch: data.branch
            };

            const response = await services.importStudent([modifiedData])
            if (response.status === 200) {
                if(response.data.skippedCount === 0){
                    alert("Student added successfully!");
                    window.location.reload(); // Reload the page to see the new student
                }
                else{
                    alert(`Error adding student: ${response.data.insertionError[0] || "Unknown error"}`);
                }
            } else {
                setError("Unable to add student");
            }
        } catch (err) {
            setError("Unable to add student!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='form-container'>
            {isLoading && <Loading />}
            {error && <Error message={error} />}
            <form className='form' onSubmit={handleSubmit(onSubmit)}>
                <div className='form-header'>Add Student</div>
                <div className='form-fields'>
                    <Row>
                        <InputField
                            label="Application Id"
                            registerProps={register("application_id")}
                            type="number"
                            error={errors.application_id && errors.application_id.message}
                            required
                        />
                        <InputField
                            label="Name"
                            type="text"
                            registerProps={register("name")}
                            error={errors.name && errors.name.message}
                            required
                        />
                        <InputField
                            label="Email"
                            type="email"
                            registerProps={register("email")}
                            error={errors.email && errors.email.message}
                            required
                        />
                    </Row>
                    <Row>
                        <InputField
                            label="Mobile"
                            type="number"
                            registerProps={register("mobile")}
                            error={errors.mobile && errors.mobile.message}
                            required
                        />
                        <DropDown
                            label="Community"
                            options={options['community']}
                            fieldname={"community"}
                            formcontrol={control}
                            error={errors.community && errors.community.message}
                            storeLabel={true}
                            required
                        />
                        <DropDown
                            label="Gender"
                            options={{ "Male": "Male", "Female": "Female" }}
                            fieldname={"gender"}
                            formcontrol={control}
                            sorted={false}
                            error={errors.gender && errors.gender.message}
                            required
                        />
                    </Row>
                    <Row>
                        <DropDown
                            label="Student Category"
                            options={studentCategoryOptions}
                            fieldname={"student_category"}
                            formcontrol={control}
                            sorted={false}
                            error={errors.student_category && errors.student_category.message}
                            required
                        />
                        <DropDown
                            label="Degree Level"
                            options={degreeLevelOptions}
                            fieldname={"degree_level"}
                            formcontrol={control}
                            sorted={false}
                            error={errors.degree_level && errors.degree_level.message}
                            required
                        />
                        {isDegreeLevelSelected &&
                            <DropDown
                                label="Branch"
                                options={branchOptions}
                                fieldname={"branch"}
                                formcontrol={control}
                                error={errors.branch && errors.branch.message}
                                storeLabel={true}
                                required
                            />
                        }
                    </Row>
                </div>
                <div className='centre-button'>
                    <input className='button' type='submit' value="Add" onSubmit={handleSubmit(onSubmit)} />
                </div>
            </form>
        </div>
    )
}

export default AddStudent
