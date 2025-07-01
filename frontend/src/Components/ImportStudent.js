import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import { AiOutlineCloudUpload } from "react-icons/ai";
import { RiFileExcel2Line } from "react-icons/ri";

import '../css/ImportStudent.css'
import Select from "react-select";
import Loading from "./Loading";
import Error from "./Error";
import services from '../services/services';

function ImportStudent() {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [insertionError, setInsertionError] = useState([])

    const [file, setFile] = useState(null);
    const [studentCategory, setStudentCategory] = useState(null);
    const [degreeLevel, setDegreeLevel] = useState(null);

    const studentCategoryOptions = [
        { value: 'G', label: 'GOVERNMENT' },
        { value: 'GL', label: 'GOVERNMENT LATERAL' },
        { value: 'M', label: 'MANAGEMENT' },
        { value: 'ML', label: 'MANAGEMENT LATERAL' }
    ];

    const degreeLevelOptions = [
        { value: 'UG', label: 'UG' },
        { value: 'PG', label: 'PG' },
    ]

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }

    }

    const handleFileUpload = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        setError(null)

        if (!file) {
            setError("Please select a file")
            setIsLoading(false)
            return
        }
        if (!studentCategory) {
            setError("Please select a student category")
            setIsLoading(false)
            return
        }
        if (!degreeLevel) {
            setError("Please select degree level")
            setIsLoading(false)
            return
        }

        const reader = new FileReader();

        reader.onload = async (event) => {
            const arrayBuffer = event.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            const sheetName = workbook.SheetNames[0]; // First sheet
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);

            const modifiedData = data.map(row => {
                const modifiedRow = Object.keys(row).reduce((acc, key) => {
                    if (key !== "S.No.") {
                        const transformedKey = key.toLowerCase().replace(/\s+/g, '_');
                        let value = row[key];

                        // Capitalize gender
                        if (transformedKey === 'gender' && typeof value === 'string') {
                            value = value.toUpperCase();
                        }

                        // Prefix application_no with selected studentCategory value
                        if (transformedKey === 'application_id' && studentCategory?.value) {
                            value = `${studentCategory.value}${value}`;
                        }

                        acc[transformedKey] = value;
                    }
                    return acc;
                }, {});
                if (degreeLevel?.value) {
                    modifiedRow['degree_level'] = degreeLevel.value;
                }
                return modifiedRow;
            });

            // Check if the modifiedData has all required fields
            const requiredFields = ['application_id', 'name', 'branch', 'community', 'gender', 'email', 'mobile'];
            const hasAllRequiredFields = (data) => {
                if (!data || data.length === 0) return false;
                const keys = Object.keys(data[0]);
                return requiredFields.every(field => keys.includes(field));
            };
            if (!hasAllRequiredFields(modifiedData)) {
                setError("Some columns are missing");
                return;
            }


            const response = await services.importStudent(modifiedData)

            if (response.status === 200) {
                const insertedCount = response.data.insertedCount
                const skippedCount = response.data.skippedCount
                setInsertionError(response.data.insertionError || []);
                console.log('Errors inserting:\n', response.data.insertionError);

                alert(`Excel data imported successfully\nInserted: ${insertedCount}\nSkipped: ${skippedCount}`)
            }
            else {
                setError("Error importing excel data")
            }
            setFile(null)
        };

        reader.readAsArrayBuffer(file);
        setIsLoading(false)
        setFile(null)
    }

    return (
        <>
            <div className='form-container'>
                {isLoading && <Loading />}
                {error && <Error message={error} />}
                <form className='form' onSubmit={handleFileUpload}>
                    <div className='form-header'>Import Student Data</div>
                    <div className='form-fields'>
                        <div className="file-upload-container">
                            <label htmlFor="dropzone-file" className="file-upload-label">
                                <div className="upload-content">
                                    {file ?
                                        <>
                                            <div className='excel-file-container'>
                                                <div>
                                                    <RiFileExcel2Line className='upload-icon' />
                                                </div>
                                                <div>
                                                    <div className="upload-text">{file.name}</div>
                                                    <div className="upload-text-small">{(file.size / 1024).toFixed(2)}kb</div>
                                                </div>
                                            </div>

                                        </>
                                        :
                                        <>
                                            <AiOutlineCloudUpload className='upload-icon' />
                                            <p className="upload-text"><span className="upload-text-bold">Click to upload</span></p>
                                            <p className="upload-text-small">*File supported - .xlsx</p>
                                            <p className="upload-text-small">*Required Columns - Application Id, Name, Branch, Community, Gender, Email, Mobile</p>
                                        </>
                                    }
                                </div>
                                <input id="dropzone-file" onChange={onFileChange} type="file" accept=".xlsx" className="hidden-input" />
                            </label>

                        </div>
                    </div>
                    <div className='centre-button'>
                        <Select
                            options={degreeLevelOptions}
                            value={degreeLevel}
                            onChange={option => setDegreeLevel(option)}
                            className="dropdown"
                            classNamePrefix="dropdown"
                            isSearchable
                            isClearable={false}
                            placeholder="Degree Level"
                        />
                        <Select
                            options={studentCategoryOptions}
                            value={studentCategory}
                            onChange={option => setStudentCategory(option)}
                            className="dropdown"
                            classNamePrefix="dropdown"
                            isSearchable
                            isClearable={false}
                            placeholder="Student Category"
                        />

                        <input className='button' type='submit' value="Upload" onSubmit={handleFileUpload} />
                    </div>
                </form>
            </div>
            {insertionError.length > 0 && (
                <div className='form-container'>
                    <div className='form'>
                        <div className='insertion-error-header'>Insertion Errors</div>
                        <ol className='insertion-error-list'>
                            {insertionError.map((error, index) => (
                                <li key={index} className='insertion-error-item'>{error}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            )}
        </>
    )
}

export default ImportStudent