import * as Yup from 'yup';

const PersonalDetails = Yup.object().shape({
    student_name: Yup.string()
        .matches(/^[A-Za-zÀ-ÿ]+([ '-][A-Za-zÀ-ÿ]+)*$/, "Name should contain only characters and spaces")
        .required('Name is required'),

    dob: Yup.string()
        .required("Date of birth is required"),

    age: Yup.number()
        .min(16, "Age must be greater than 16")
        .max(100, "Age must be less than 100")
        .required("Age is required"),

    aadhar_no: Yup.string()
        .length(12, "Must be 12 digits")
        .required('Aadhar Number is required'),

    legend: Yup.string()
        .required("Title is required"),

    gender: Yup.string()
        .required("Gender is required"),

    community_id: Yup.string()
        .nullable()
        .required("Community is required"),

    religion_id: Yup.string()
        .required("Religion is required"),

    nationality_id: Yup.string()
        .required("Nationality is required"),

    seat_cat: Yup.string()
        .required("Seat Category is required"),
})

const ParentDetails = Yup.object().shape({
    father_name: Yup.string()
        .matches(/^[A-Za-zÀ-ÿ]+([ '-][A-Za-zÀ-ÿ]+)*$/, "Name should contain only characters and spaces")
        .required("Father's Name is required"),

    parent_income: Yup.number()
        .min(0, "Income should be positive")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    work_area: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    mother_name: Yup.string()
        .matches(/^[A-Za-zÀ-ÿ]+([ '-][A-Za-zÀ-ÿ]+)*$/, "Name should contain only characters and spaces")
        .required("Mother's Name is required"),

    parent_income_mother: Yup.number()
        .min(0, "Income should be positive")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    work_area_mother: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    gaurdian_name: Yup.string()
        .matches(/^[A-Za-zÀ-ÿ]+([ '-][A-Za-zÀ-ÿ]+)*$/, "Name should contain only characters and spaces"),
})

const ContactDetails = Yup.object().shape({
    stu_mobile_no: Yup.string()
        .length(10, "Phone Number must be 10 digits")
        .required("Student phone number is required"),

    stu_email_id: Yup.string()
        .email("Invalid email")
        .required("Email is required"),

    parent_mobile_no: Yup.string()
        .length(10, "Phone Number must be 10 digits")
        .required("Parent phone number is required"),

    parent_email_id: Yup.string()
        .email("Invalid email")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    nominee_relation: Yup.string()
        .required("Nominee relation is required"),

    nominee_name: Yup.string()
        .matches(/^[A-Za-zÀ-ÿ]+([ '-][A-Za-zÀ-ÿ]+)*$/, "Name should contain only characters and spaces")
        .required("Nominee name is required"),

    nominee_age: Yup.number()
        .min(18, "Age must be greater than 18")
        .max(100, "Age must be less than 100")
        .required("Nominee age is required"),
})

const AddressDetails = Yup.object().shape({
    comm_add_street: Yup.string()
        .required("Street name is required"),

    comm_add_town: Yup.string()
        .required("Town is required"),

    comm_add_city: Yup.string()
        .required("City is required"),

    comm_add_district: Yup.string()
        .required("District is required"),

    comm_add_state: Yup.string()
        .notOneOf([''], 'State is required')
        .required("State is required"),

    comm_add_country: Yup.string()
        .required("Country is required"),

    comm_add_pincode: Yup.string()
        .length(6, "PIN code must be 6 digits")
        .required("PIN code is required"),

    area_location: Yup.string()
        .required("Area location is required"),

    perm_add_street: Yup.string()
        .required("Street name is required"),

    perm_add_town: Yup.string()
        .required("Town is required"),

    perm_add_city: Yup.string()
        .required("City is required"),

    perm_add_district: Yup.string()
        .required("District is required"),

    perm_add_state: Yup.string()
        .required("State is required"),

    perm_add_country: Yup.string()
        .required("Country is required"),

    perm_add_pincode: Yup.string()
        .length(6, "PIN code must be 6 digits")
        .required("PIN code is required"),
})

const TNEADetails = Yup.object().shape({
    quota_id: Yup.string()
        .required("Quota is required"),

    tnea_app_no: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    tnea_adm_no: Yup.number("Must be a number")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    general_rank: Yup.number("Must be a number")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    comm_rank: Yup.number("Must be a number")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    tnea_pay_rec_no: Yup.string()
        .matches(/^[A-Za-z0-9 -]+$/, "Invalid Format")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    tnea_pay_rec_date: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    tnea_pay_rec_amt: Yup.string()
        .matches(/^[0-9 .]+$/, "Invalid amount")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    tnea_pay_bank: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),
})

const ScholarshipDetails = Yup.object().shape({
    adm_sch_amt1: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    adm_sch_amt2: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),
})

const AdditionalDetails = Yup.object().shape({
    father_qual: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    mother_qual: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    sports_int: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    first_gr_appno: Yup.string()
        .matches(/^[A-Za-z0-9]*$/, "Invalid Format")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),
});


const MarkDetails = Yup.object().shape({
    school_name: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .required("School name is reuquired"),

    school_district: Yup.string()
        .required("District is required"),

    school_tc_no: Yup.string()
        .matches(/^[A-Za-z0-9-]+$/, "Invalid TC number")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .required("TC number is required"),

    school_tc_date: Yup.string()
        .required("TC date is required"),

    sch_attempt: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .required("No. of attempts is required"),

    sch_reg1: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    sch_cer1: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    sch_tot_mark1: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    sch_reg2: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    sch_cer2: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    sch_tot_mark2: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    physics_secured: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    physics_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    physics_percentage: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    chemistry_secured: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    chemistry_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    chemistry_percentage: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    maths_secured: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    maths_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    maths_percentage: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    biology_secured: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    biology_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    biology_percentage: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    cs_secured: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    cs_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    cs_percentage: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    pcm_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    pcm_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    pcm_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    phy_che: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    maths: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    cut_off: Yup.number()
        .min(0, "Cutoff cannot be negative")
        .max(200, "Cutoff must be less than 200")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_first_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_first_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_first_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_second_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_second_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_second_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_third_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_third_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_third_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_fourth_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_fourth_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_fourth_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_fifth_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_fifth_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_fifth_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_sixth_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_sixth_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_sixth_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_seventh_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_seventh_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_seventh_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_eighth_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_eighth_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_eighth_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_nineth_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_nineth_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_nineth_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_tenth_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_tenth_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    diploma_tenth_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    ug_mark_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    ug_mark_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    ug_mark_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    I_II: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    III_IV: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    V_VI: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    VII_VIII: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    IX_X: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    entrance_secured: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    entrance_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    entrance_percenteage: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),
})

const AddStudent = Yup.object().shape({
    application_id: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .required("Application ID is required"),

    name: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .required("Name is required"),

    email: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .email("Invalid email format")
        .required("Email is required"),

    mobile: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .length(10, "Mobile number must be 10 digits")
        .required("Mobile number is required"),

    community: Yup.string()
        .required("Community is required"),

    gender: Yup.string()
        .required("Gender is required"),

    student_category: Yup.string()
        .required("Student category is required"),

    degree_level: Yup.string()
        .required("Degree level is required"),

    branch: Yup.string()
        .required("Branch is required"),

})

const PaymentDetails = Yup.object().shape({
    // Token number validation (admin/manager only)
    token_number: Yup
        .number()
        .typeError('Token Number must be a number')
        .positive('Token Number must be positive')
        .nullable(),

    // TFC Initial Payment validation
    tfc_initial_payment: Yup
        .number()
        .typeError('TFC Initial Payment must be a number')
        .min(0, 'TFC Initial Payment cannot be negative')
        .required('TFC Initial Payment is required'),

    // Payment methods array validation
    payment_method: Yup
        .array()
        .of(Yup.string().oneOf(['demand draft', 'card swiping', 'online payment', 'no fees'], 'Invalid payment method'))
        .min(1, 'At least one payment method must be selected')
        .required('Payment method selection is required'),

    // Demand Draft validations - conditional based on payment_method array
    dd_amount: Yup
        .number()
        .typeError('DD Amount must be a number')
        .when('payment_method', (paymentMethods, schema) => {
            if (paymentMethods && paymentMethods.includes('demand draft')) {
                return schema
                    .required('DD Amount is required for demand draft')
                    .min(0.01, 'DD Amount must be greater than 0');
            }
            return schema.nullable();
        }),

    dd_bank_name: Yup
        .string()
        .when('payment_method', (paymentMethods, schema) => {
            if (paymentMethods && paymentMethods.includes('demand draft')) {
                return schema
                    .required('Bank Name is required for demand draft')
                    .min(2, 'Bank Name must be at least 2 characters');
            }
            return schema.nullable();
        }),

    dd_date: Yup
        .date()
        .typeError('Please enter a valid date')
        .when('payment_method', (paymentMethods, schema) => {
            if (paymentMethods && paymentMethods.includes('demand draft')) {
                return schema
                    .required('DD Date is required for demand draft')
                    .max(new Date(), 'DD Date cannot be in the future');
            }
            return schema.nullable();
        }),

    dd_number: Yup
        .number()
        .when('payment_method', (paymentMethods, schema) => {
            if (paymentMethods && paymentMethods.includes('demand draft')) {
                return Yup.number()
                    .typeError('DD Number must be a number')
                    .required('DD Number is required for demand draft')
                    .test('len', 'DD Number must be exactly 6 digits', val => val && val.toString().length === 6);
            }
            return Yup.number().nullable();
        }),

    // Card Swiping validations
    card_swipe_amount: Yup
        .number()
        .typeError('Card Swipe Amount must be a number')
        .when('payment_method', (paymentMethods, schema) => {
            if (paymentMethods && paymentMethods.includes('card swiping')) {
                return schema
                    .required('Card Swipe Amount is required for card swiping')
                    .min(0.01, 'Card Swipe Amount must be greater than 0');
            }
            return schema.nullable();
        }),

    card_swipe_reference_no: Yup
        .string()
        .when('payment_method', (paymentMethods, schema) => {
            if (paymentMethods && paymentMethods.includes('card swiping')) {
                return schema
                    .required('Card Reference Number is required for card swiping')
                    .min(4, 'Card Reference Number must be at least 4 characters')
                    .matches(/^[0-9A-Za-z]+$/, 'Card Reference Number must contain only letters and numbers');
            }
            return schema.nullable();
        }),

    // Online Payment validations
    online_pay_amount: Yup
        .number()
        .typeError('Online Payment Amount must be a number')
        .when('payment_method', (paymentMethods, schema) => {
            if (paymentMethods && paymentMethods.includes('online payment')) {
                return schema
                    .required('Online Payment Amount is required for online payment')
                    .min(0.01, 'Online Payment Amount must be greater than 0');
            }
            return schema.nullable();
        }),

    online_pay_reference_no: Yup
        .string()
        .when('payment_method', (paymentMethods, schema) => {
            if (paymentMethods && paymentMethods.includes('online payment')) {
                return schema
                    .required('Online Reference Number is required for online payment')
                    .min(4, 'Online Reference Number must be at least 4 characters')
                    .matches(/^[0-9A-Za-z]+$/, 'Online Reference Number must contain only letters and numbers');
            }
            return schema.nullable();
        }),

    // Custom validation to ensure total amount is provided when payment methods are selected
    total_amount: Yup
        .number()
        .typeError('Total Amount must be a number')
        .when('payment_method', (paymentMethods, schema) => {
            if (paymentMethods && paymentMethods.length > 0 && !paymentMethods.includes('no fees')) {
                return schema
                    .required('Total Amount is required')
                    .min(0.01, 'Total Amount must be greater than 0');
            }
            return schema.nullable();
        })
}).test('payment-method-validation', 'Payment validation failed', function (values) {
    const { payment_method } = values;

    // If no payment methods selected, fail validation
    if (!payment_method || payment_method.length === 0) {
        return this.createError({
            path: 'payment_method',
            message: 'At least one payment method must be selected'
        });
    }

    // If "no fees" is selected with other methods, fail validation
    if (payment_method.includes('no fees') && payment_method.length > 1) {
        return this.createError({
            path: 'payment_method',
            message: 'No fees cannot be selected with other payment methods'
        });
    }

    // If payment methods are selected (not "no fees"), validate total amount matches sum
    if (!payment_method.includes('no fees')) {
        const ddAmount = parseFloat(values.dd_amount) || 0;
        const cardAmount = parseFloat(values.card_swipe_amount) || 0;
        const onlineAmount = parseFloat(values.online_pay_amount) || 0;
        const calculatedTotal = ddAmount + cardAmount + onlineAmount;

        if (calculatedTotal <= 0) {
            return this.createError({
                path: 'payment_method',
                message: 'At least one payment amount must be provided'
            });
        }

        // Optional: Validate that the total_amount matches the calculated total
        // Uncomment if you want strict total validation
        /*
        const totalAmount = parseFloat(values.total_amount) || 0;
        if (Math.abs(totalAmount - calculatedTotal) > 0.01) {
            return this.createError({
                path: 'total_amount',
                message: 'Total amount does not match the sum of individual payments'
            });
        }
        */
    }

    return true;
});

const schema = {
    PersonalDetails,
    ParentDetails,
    ContactDetails,
    AddressDetails,
    TNEADetails,
    ScholarshipDetails,
    AdditionalDetails,
    MarkDetails,
    AddStudent,
}

export default schema