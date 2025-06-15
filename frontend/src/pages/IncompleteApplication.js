import React, { useEffect, useState } from 'react'
import Table from '../Components/Table'
import services from '../services/services'
import EditApplicationModal from '../Components/EditApplicationModal'
import { useNavigate } from 'react-router-dom'
import Loading from '../Components/Loading'
import Error from '../Components/Error'

function IncompleteApplication() {
    const [submittedApplications, setSubmittedApplications] = useState([])
    const [incompleteApplications, setIncompleteApplications] = useState([])
    const [isEditApplicationModalOpen, setIsEditApplicationModalOpen] = useState(false)
    const [applicationData, setApplicationData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const inc_apl = await services.getIncompleteApplications()
                setIncompleteApplications(inc_apl)

                const sub_apl = await services.getSubmittedApplications()
                setSubmittedApplications(sub_apl)
            } catch (error) {
                setError("Failed to fetch applications!")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleApplicationClick = (rowData) => {
        setIsEditApplicationModalOpen(true)
        setApplicationData(rowData)
    }

    return (
        <div className='form-container'>
            {isLoading && <Loading />}
            {error && <Error message={error} />}

            <Table
                tableData={incompleteApplications}
                title={'Incomplete Applications'}
                onRowClick={handleApplicationClick}
                onCreateNew={() => navigate('/')}
            />
            {isEditApplicationModalOpen && (
                <EditApplicationModal
                    applicationData={applicationData}
                    isOpen={isEditApplicationModalOpen}
                    setIsOpen={setIsEditApplicationModalOpen}
                />
            )}

            <Table
                tableData={submittedApplications}
                title={'Submitted Applications'}
            />

        </div>
    )
}

export default IncompleteApplication