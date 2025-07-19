import apiInstance from "./apiService";

const createNewApplication = async (data) => {
    try {
        const response = await apiInstance.post(`student_reg/new`, data)
        return response.data
    } catch (error) {
        console.log("Cannot create a new application in student_register table")
    }
}

const fetchData = async (applicationNo, queryParams) => {
    try {
        const response = await apiInstance.get(`/student_reg/${applicationNo}`, {
            params: {
                fields: queryParams
            }
        })
        return response.data
    } catch (error) {
        console.log("Error fetching details from student_register table")
    }
}

const updateData = async (applicationNo, data) => {
    try {
        const response = await apiInstance.put(`student_reg/${applicationNo}`, data)
        return response
    } catch (error) {
        console.log("Cannot update details in student_register table")
    }
}

const updatePaymentDetails = async (applicationNo, data) => {
    try {
        const response = await apiInstance.post(`payment_details/${applicationNo}`, data)
        return response
    } catch (error) {
        console.log("Cannot update payment details in admission_payment_details table")
    }
}

const getTotalFees = async (applicationNo) => {
    try {
        const response = await apiInstance.get(`/payment_details/total_fee/${applicationNo}`)
        return response.data
    } catch (error) {
        console.log("Cannot fetch total fees from admission_payment_details table")
    }
}

const getPaymentDetails = async (applicationNo, queryParams) => {
    try {
        const response = await apiInstance.get(`/payment_details/${applicationNo}`, {
            params: {
                fields: queryParams
            }
        })
        return response.data
    }
    catch (error) {
        console.log("Cannot fetch payment details from admission_payment_details table")
    }
}

const fetchFromMaster = async (option) => {
    try {
        const response = await apiInstance.get(`/master/${option}`)
        return response.data
    } catch (error) {
        console.log(`Cannont fetch ${option} from master table`)
    }
}

const getValueFromMaster = async (option, id) => {
    try {
        const response = await apiInstance.get(`/master/${option}/${id}`)
        return response.data.value
    } catch (error) {
        console.log(`Error fetching value for ${option} from master table`)
    }
}

const getStudentAdditionalDet = async (applicationNo, queryParams) => {
    try {
        const response = await apiInstance.get(`/student_add_det/${applicationNo}`, {
            params: {
                fields: queryParams
            }
        })
        return response.data
    } catch (error) {
        console.log("Cannot fetch details from student_additional_det table")
    }
}

const insertStudentAdditionalDet = async (data) => {
    try {
        const response = await apiInstance.post(`student_add_det`, data)
        return response
    } catch (error) {
        console.log("Cannot insert into student_additional_det table")
        throw error;
    }
}

const inserIntoCAMPS = async (applicationNo) => {
    try {
        const response = await apiInstance.post(`/insert_into_camps/${applicationNo}`)
        return response.data
    } catch (error) {
        console.log("Cannot insert into CAMPS")
    }
}

const importStudent = async (data, degreeLevel) => {
    try {
        const response = await apiInstance.post(`/student_user_details`, data)
        return response
    } catch (error) {
        console.log("Cannot import excel file")
    }
}

const getStudentDetails = async () => {
    try {
        const response = await apiInstance.get(`/student_user_details`)
        return response.data
    } catch (error) {
        console.log("Cannot fetch student details")
        throw error
    }
}

const addUser = async (data) => {
    try {
        const response = await apiInstance.post(`/user`, data)
        return response
    } catch (error) {
        console.log("Cannot add user")
    }
}

const getUserDetails = async () => {
    try {
        const response = await apiInstance.get(`/user`)
        return response.data
    } catch (error) {
        console.log("Cannot fetch user details")
    }
}

const editUser = async (id, data) => {
    try {
        const response = await apiInstance.put(`/user/${id}`, data)
        return response
    } catch (error) {
        console.log("Cannot edit user details")
    }
}

const deleteUser = async (id) => {
    try {
        const response = await apiInstance.delete(`/user/${id}`)
        return response
    } catch (error) {
        console.log("Cannot delete user")
    }
}

const freezeApplication = async (applicationNo) => {
    try {
        const response = await apiInstance.post(`/student_reg/${applicationNo}/freeze`)
        return response
    } catch (error) {
        console.log("Cannot freeze application")
        throw error
    }
}

const getSubmittedApplications = async () => {
    try {
        const response = await apiInstance.get(`/submitted_application`)
        return response.data
    } catch (error) {
        console.log("Cannot fetch submitted applications")
        throw error
    }
}

const getIncompleteApplications = async () => {
    try {
        const response = await apiInstance.get(`/incomplete_application`)
        return response.data
    } catch (error) {
        console.log("Cannot fetch incomplete applications")
        throw error
    }
}

const getPaymentNotVerifiedApplications = async () => {
    try {
        const response = await apiInstance.get(`/payment_not_verified_applications`)
        return response.data
    } catch (error) {
        console.log("Cannot fetch incomplete applications")
        throw error
    }
}

const getUnfreezedApplications = async () => {
    try {
        const response = await apiInstance.get(`/unfreezed_application`)
        return response.data
    }
    catch (error) {
        console.log("Cannot fetch unfreezed applications")
        throw error
    }
}

const deleteApplication = async (applicationNo) => {
    try {
        const response = await apiInstance.delete(`/incomplete_application/${applicationNo}`)
        return response
    } catch (error) {
        console.log("Cannot delete application")
    }
}

const services = {
    createNewApplication,
    fetchData,
    updateData,
    updatePaymentDetails,
    getTotalFees,
    getPaymentDetails,
    fetchFromMaster,
    getValueFromMaster,
    getStudentAdditionalDet,
    insertStudentAdditionalDet,
    inserIntoCAMPS,
    importStudent,
    getStudentDetails,
    addUser,
    getUserDetails,
    editUser,
    deleteUser,
    freezeApplication,
    getSubmittedApplications,
    getIncompleteApplications,
    getPaymentNotVerifiedApplications,
    getUnfreezedApplications,
    deleteApplication
};

export default services;