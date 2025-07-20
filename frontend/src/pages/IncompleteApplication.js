import React, { useEffect, useState } from 'react'
import Table from '../Components/Table'
import services from '../services/services'
import EditApplicationModal from '../Components/EditApplicationModal'
import { useNavigate } from 'react-router-dom'
import Loading from '../Components/Loading'
import Error from '../Components/Error'
import EditPaymentNotVerifiedApplicationModal from '../Components/EditPaymentNotVerifiedApplicationModal'

function IncompleteApplication() {
    const [submittedApplications, setSubmittedApplications] = useState([])
    const [incompleteApplications, setIncompleteApplications] = useState([])
    const [paymentNotVerifiedApplications, setPaymentNotVerifiedApplications] = useState([])
    const [unfreezedApplications, setUnfreezedApplications] = useState([])
    const [isEditApplicationModalOpen, setIsEditApplicationModalOpen] = useState(false)
    const [isEditPaymentNotVerifiedApplicationModalOpen, setIsEditPaymentNotVerifiedApplicationModalOpen] = useState(false)
    const [applicationData, setApplicationData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const paymentNotVerified = await services.getPaymentNotVerifiedApplications()
                setPaymentNotVerifiedApplications(paymentNotVerified)

                const inc_apl = await services.getIncompleteApplications()
                setIncompleteApplications(inc_apl)

                const sub_apl = await services.getSubmittedApplications()
                setSubmittedApplications(sub_apl)

                const unfreezedApplications = await services.getUnfreezedApplications()
                setUnfreezedApplications(unfreezedApplications)
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

    const handlePaymentNotVerifiedApplicationClick = (rowData) => {
        setIsEditPaymentNotVerifiedApplicationModalOpen(true)
        setApplicationData(rowData)
    }

    return (
        <div className='form-container'>
            {isLoading && <Loading />}
            {error && <Error message={error} />}



            {/* <Table
                tableData={paymentNotVerifiedApplications}
                title={'Payment Not Verified Applications'}
                onRowClick={handlePaymentNotVerifiedApplicationClick}
            // onCreateNew={() => navigate('/')}
            />
            {isEditPaymentNotVerifiedApplicationModalOpen && (
                <EditPaymentNotVerifiedApplicationModal
                    applicationData={applicationData}
                    isOpen={isEditPaymentNotVerifiedApplicationModalOpen}
                    setIsOpen={setIsEditPaymentNotVerifiedApplicationModalOpen}
                />
            )} */}

            <Table
                tableData={incompleteApplications}
                title={'Incomplete Applications'}
                onRowClick={handleApplicationClick}
            // onCreateNew={() => navigate('/')}
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