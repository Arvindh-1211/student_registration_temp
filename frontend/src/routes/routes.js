import BranchDetails from "../pages/BranchDetails";
import PersonalDetails from "../pages/PersonalDetails";
import ParentDetails from "../pages/ParentDetails";
import AddressDetails from "../pages/AddressDetails";
import ContactDetails from "../pages/ContactDetails";
import TNEADetails from "../pages/TNEADetails";
import ScholarshipDetails from "../pages/ScholarshipDetails";
import AdditionalDetails from "../pages/AdditionalDetails";
import MarkDetails from "../pages/MarkDetails";
import FinalReview from "../pages/FinalReview";
import Success from "../pages/Success";
import AdminHome from "../pages/AdminHome";
import ProtectedRoute from "../Components/ProtectedRoute";
import IncompleteApplication from "../pages/IncompleteApplication";
import GoBack from "../Components/GoBack";
import PaymentDetails from "../pages/PaymentDetails";

const routes = [
    {
        path: '/home',
        element: <ProtectedRoute users={['admin', 'manager', 'accounts_manager']}><AdminHome /></ProtectedRoute>
    },
    {
        path: '/',
        element: <GoBack />
    },
    // {
    //     path: '/',
    //     element: <BranchDetails />
    // },
    {
        path: '/incomplete_application',
        element: <ProtectedRoute users={['admin', 'manager', 'accounts_manager']}><IncompleteApplication /></ProtectedRoute>
    },
    {
        path: '/personal_details',
        element: <PersonalDetails />
    },
    {
        path: '/parent_details',
        element: <ParentDetails />
    },
    {
        path: '/address_details',
        element: <AddressDetails />
    },
    {
        path: '/contact_details',
        element: <ContactDetails />
    },
    {
        path: '/tnea_details',
        element: <TNEADetails />
    },
    {
        path: '/scholarship_details',
        element: <ScholarshipDetails />
    },
    {
        path: '/mark_details',
        element: <MarkDetails />
    },
    {
        path: '/additional_details',
        element: <AdditionalDetails />
    },
    {
        path: '/payment_details',
        element: <PaymentDetails />
    },
    {
        path: '/final_review',
        element: <FinalReview />
    },
    {
        path: '/success',
        element: <Success />
    },
]

export default routes;