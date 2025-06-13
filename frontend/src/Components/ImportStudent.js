import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import { AiOutlineCloudUpload } from "react-icons/ai";
import { RiFileExcel2Line } from "react-icons/ri";

import '../css/ImportStudent.css'
import Loading from "./Loading";
import Error from "./Error";
import services from '../services/services';
import { set } from 'react-hook-form';

function ImportStudent() {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [insertionError, setInsertionError] = useState([])

    const [file, setFile] = useState(null);

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
            setError("Please select a file!")
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

                    // Skip the Sl.No. key
                    if (key !== "S.No.") {
                        // Convert keys(coloumn names) to lowercase and replace spaces with underscores
                        const transformedKey = key.toLowerCase().replace(/\s+/g, '_');
                        acc[transformedKey] = row[key];
                    }
                    return acc;
                }, {})
                return modifiedRow;
            });

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
                                        </>
                                    }
                                </div>
                                <input id="dropzone-file" onChange={onFileChange} type="file" accept=".xlsx" className="hidden-input" />
                            </label>
                        </div>
                    </div>
                    <div className='centre-button'>
                        <input className='button' type='submit' value="Upload" onSubmit={handleFileUpload} />
                    </div>
                </form>
            </div>
            {insertionError.length > 0 && (
                <div className='form-container'>
                <div className='form'>
                    <div className='insertion-error-header'>Insertion Errors</div>
                    <ul className='insertion-error-list'>
                        {insertionError.map((error, index) => (
                            <li key={index} className='insertion-error-item'>{error}</li>
                        ))}
                    </ul>
                </div>
                </div>
            )}
        </>
    )
}

export default ImportStudent