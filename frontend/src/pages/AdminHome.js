import React, { useEffect, useState } from 'react'
import ImportStudent from '../Components/ImportStudent'
import AddUser from '../Components/AddUser'
import ProtectedComponent from '../Components/ProtectedComponent'
import Table from '../Components/Table'
import Loading from '../Components/Loading'
import Error from '../Components/Error'
import services from '../services/services'
import EditUserModal from '../Components/EditUserModal'
import AddStudent from '../Components/AddStudent'
import { set } from 'react-hook-form'
import NewApplicationModal from '../Components/NewApplicationModal'

function AdminHome() {
    const [studentDetails, setStudentDetails] = useState([])
    const [userDetails, setUserDetails] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // State for EditUserModal
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
    const [userData, setUserData] = useState(null)

    // State for NewApplicationModal
    const [isNewApplicationModalOpen, setIsNewApplicationModalOpen] = useState(false)
    const [newApplicationData, setNewApplicationData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const userResponse = await services.getUserDetails()
                setUserDetails(userResponse)
                const studentResponse = await services.getStudentDetails()
                setStudentDetails(studentResponse)
            } catch (error) {
                setError("Failed to fetch students data!")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleUserTableClick = (rowData) => {
        setUserData(rowData)
        setIsEditUserModalOpen(true)
    }

    const handleStudentDetailsTableClick = (rowData) => {
        setNewApplicationData(rowData)
        setIsNewApplicationModalOpen(true)
    }

    return (
        <div>
            {isLoading && <Loading />}
            {error && <Error message={error} />}

            <ProtectedComponent users={['admin']}>
                <AddUser />
                <div className='form-container'>
                    <Table tableData={userDetails} title={'User Details'} onRowClick={handleUserTableClick}/>
                    {isEditUserModalOpen && <EditUserModal userData={userData} isOpen={isEditUserModalOpen} setIsOpen={setIsEditUserModalOpen} />}
                </div>
            </ProtectedComponent>

            <AddStudent />
            <ImportStudent />
            <div className='form-container'>
                <Table tableData={studentDetails} title={'Student Details'} onRowClick={handleStudentDetailsTableClick} />
                {isNewApplicationModalOpen && <NewApplicationModal applicationData={newApplicationData} isOpen={isNewApplicationModalOpen} setIsOpen={setIsNewApplicationModalOpen} />}
            </div>
        </div>
    )
}

export default AdminHome