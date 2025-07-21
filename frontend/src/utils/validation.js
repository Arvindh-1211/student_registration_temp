import * as Yup from 'yup';

const PersonalDetails = Yup.object().shape({
    student_name: Yup.string()
        .matches(/^[A-Za-zÀ-ÿ]+([ '-][A-Za-zÀ-ÿ]+)*$/, "Name should contain only characters and spaces")
        .required('Name is required'),

    initial: Yup.string()
        .required("Initial is required"),

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

    blood_group: Yup.string()
        .required("Blood Group is required"),

    mother_tongue: Yup.string()
        .required("Mother Tongue is required"),

    religion_id: Yup.string()
        .required("Religion is required"),

    caste_id: Yup.string()
        .required("Caste is required"),

    nationality_id: Yup.string()
        .required("Nationality is required"),

    seat_cat: Yup.string()
        .required("Seat Category is required"),

    scholar: Yup.string()
        .required("Scholar is required"),
})

const ParentDetails = Yup.object().shape({
    father_name: Yup.string()
        .matches(/^[A-Za-zÀ-ÿ]+([ '-][A-Za-zÀ-ÿ]+)*$/, "Name should contain only characters and spaces")
        .required("Father's Name is required"),

    occupation: Yup.string()
        .required("Father occupation is required"),

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

    occupation_mother: Yup.string()
        .required("Mother Occupation is required"),

    parent_income_mother: Yup.number()
        .min(0, "Income should be positive")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    work_area_mother: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),
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

    perm_phone_no: Yup.string()
        .length(10, "Phone Number must be 10 digits")
        .required("Mother's phone number is required"),

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

    tnea_adm_no: Yup.string()
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

    school_type: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .required("School type is reuquired"),

    sports_int: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    first_gr_appno: Yup.string()
        .matches(/^[A-Za-z0-9-]*$/, "Invalid Format")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true),

    choose_college: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .required("This is reuquired"),
});


const MarkDetails = Yup.object().shape({
    school_tc_no: Yup.string()
        .matches(/^[A-Za-z0-9-]+$/, "Invalid TC number")
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .required("TC number is required"),

    school_tc_date: Yup.string()
        .required("TC date is required"),

    sch_yr_pass: Yup.string()
        .required("Year of passing is required"),

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
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    physics_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    physics_percentage: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    chemistry_secured: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    chemistry_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    chemistry_percentage: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    maths_secured: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    maths_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    maths_percentage: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    biology_secured: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    biology_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    biology_percentage: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    cs_secured: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    cs_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    cs_percentage: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    pcm_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    pcm_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    pcm_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    phy_che: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    maths: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    cut_off: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_first_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_first_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_first_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_second_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_second_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_second_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_third_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_third_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_third_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_fourth_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_fourth_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_fourth_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_fifth_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_fifth_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_fifth_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_sixth_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_sixth_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_sixth_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_seventh_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_seventh_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_seventh_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_eighth_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_eighth_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_eighth_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_ninenth_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_ninenth_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_ninenth_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_tenth_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_tenth_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    diploma_tenth_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    ug_mark_sec: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    ug_mark_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    ug_mark_per: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    I_II: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    III_IV: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    V_VI: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    VII_VIII: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    IX_X: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    entrance_secured: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    entrance_max: Yup.number()
        .min(0, "Mark cannot be negative")
        .max(200, "The mark is larger than the accepted standards")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),

    entrance_percenteage: Yup.number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot be more than 100")
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return 0;
            }
            return value;
        })
        .default(0),
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
    token_number: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true)
        .positive("Token number must be positive")
        .integer("Token number must be an integer"),

    tfc_initial_payment: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .required("TFC Initial Payment is required"),

    fee_payment_option: Yup.array()
        .of(Yup.string())
        .min(1, "At least one payment method must be selected")
        .required("Payment method is required"),

    // Demand Draft validations - conditional based on payment method selection
    dd_amount: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true)
        .when('fee_payment_option', {
            is: (methods) => methods && methods.includes('demand draft'),
            then: (schema) => schema
                .required("DD amount is required when Demand Draft is selected")
                .positive("DD amount must be positive")
                .min(0.01, "DD amount must be at least 0.01")
                .typeError("DD amount must be a valid number"),
            otherwise: (schema) => schema.nullable(true)
        }),

    dd_bank_name: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true)
        .when('fee_payment_option', {
            is: (methods) => methods && methods.includes('demand draft'),
            then: (schema) => schema
                .required("Bank name is required when Demand Draft is selected"),
            otherwise: (schema) => schema.nullable(true)
        }),

    dd_date: Yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true)
        .when('fee_payment_option', {
            is: (methods) => methods && methods.includes('demand draft'),
            then: (schema) => schema
                .required("DD date is required when Demand Draft is selected")
                .max(new Date(), "DD date cannot be in the future"),
            otherwise: (schema) => schema.nullable(true)
        }),

    dd_number: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true)
        .when('fee_payment_option', {
            is: (methods) => methods && methods.includes('demand draft'),
            then: (schema) => schema
                .required("DD number is required when Demand Draft is selected")
                .matches(/^[0-9]{6}$/, "DD number must be 6 digits"),
            otherwise: (schema) => schema.nullable(true)
        }),

    // Card Swiping validations
    card_swipe_amount: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true)
        .when('fee_payment_option', {
            is: (methods) => methods && methods.includes('card swiping'),
            then: (schema) => schema
                .required("Card swipe amount is required when Card Swiping is selected")
                .positive("Card swipe amount must be positive")
                .min(0.01, "Card swipe amount must be at least 0.01")
                .typeError("Card swipe amount must be a valid number"),
            otherwise: (schema) => schema.nullable(true)
        }),

    card_swipe_reference_no: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true)
        .when('fee_payment_option', {
            is: (methods) => methods && methods.includes('card swiping'),
            then: (schema) => schema
                .required("Card reference number is required when Card Swiping is selected")
                .matches(/^[A-Za-z0-9-]+$/, "Card reference number should contain only letters, numbers, and hyphens"),
            otherwise: (schema) => schema.nullable(true)
        }),

    // Online Payment validations
    online_pay_amount: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true)
        .when('fee_payment_option', {
            is: (methods) => methods && methods.includes('online payment'),
            then: (schema) => schema
                .required("Online payment amount is required when Online Payment is selected")
                .positive("Online payment amount must be positive")
                .min(0.01, "Online payment amount must be at least 0.01")
                .typeError("Online payment amount must be a valid number"),
            otherwise: (schema) => schema.nullable(true)
        }),

    online_pay_reference_no: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true)
        .when('fee_payment_option', {
            is: (methods) => methods && methods.includes('online payment'),
            then: (schema) => schema
                .required("Online reference number is required when Online Payment is selected")
                .matches(/^[A-Za-z0-9-]+$/, "Card reference number should contain only letters, numbers, and hyphens"),
            otherwise: (schema) => schema.nullable(true)
        }),

    // Partial Payment validations
    partial_payment: Yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true)
        .oneOf(['yes', 'no', null], "Please select a valid option for partial payment"),

    partial_payment_date: Yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(true)
        .when('partial_payment', {
            is: 'yes',
            then: (schema) => schema
                .required("Partial payment date is required when partial payment is allowed")
                .min(new Date(), "Partial payment date must be in the future"),
            otherwise: (schema) => schema.nullable(true)
        }),

    // Student details validations (read-only fields should still have basic validation)
    student_name: Yup.string()
        .nullable(true)
        .min(2, "Student name must be at least 2 characters"),

    mobile_number: Yup.string()
        .nullable(true)
        .matches(/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit Indian mobile number"),

    first_graduate: Yup.string()
        .nullable(true)
        .oneOf(['yes', 'no', 'Yes', 'No', null], "First graduate must be Yes or No"),

    bus_route: Yup.string()
        .nullable(true),

    bus_boarding_point: Yup.string()
        .nullable(true),

}).test('payment-method-consistency', 'Payment method validation failed', function (values) {
    const { fee_payment_option } = values;

    // Ensure no conflicting payment methods
    if (fee_payment_option && fee_payment_option.includes('no fees') && fee_payment_option.length > 1) {
        return this.createError({
            path: 'fee_payment_option',
            message: 'No fees option cannot be selected with other payment methods'
        });
    }

    return true;
}).test('minimum-payment-validation', 'Payment validation failed', function (values) {
    const { fee_payment_option, dd_amount, card_swipe_amount, online_pay_amount, tfc_initial_payment, partial_payment } = values;

    // Skip validation if no fees is selected
    if (fee_payment_option && fee_payment_option.includes('no fees')) {
        return true;
    }

    // Skip validation if partial payment is allowed
    if (partial_payment === 'yes') {
        return true;
    }

    // Calculate total amount
    const totalAmount =
        (parseFloat(dd_amount) || 0) +
        (parseFloat(card_swipe_amount) || 0) +
        (parseFloat(online_pay_amount) || 0) +
        (parseFloat(tfc_initial_payment) || 0);

    // Ensure some payment is made if payment methods are selected (excluding no fees)
    if (fee_payment_option && fee_payment_option.length > 0 && !fee_payment_option.includes('no fees') && totalAmount <= 0) {
        return this.createError({
            path: 'fee_payment_option',
            message: 'Total payment amount must be greater than 0 when payment methods are selected'
        });
    }

    return true;
}).test('duplicate-reference-check', 'Reference number validation failed', function (values) {
    const { card_swipe_reference_no, online_pay_reference_no, fee_payment_option } = values;

    // Check if both card and online payment are selected and have same reference number
    if (fee_payment_option &&
        fee_payment_option.includes('card swiping') &&
        fee_payment_option.includes('online payment') &&
        card_swipe_reference_no &&
        online_pay_reference_no &&
        card_swipe_reference_no.toLowerCase() === online_pay_reference_no.toLowerCase()) {

        return this.createError({
            path: 'online_pay_reference_no',
            message: 'Online payment reference number cannot be the same as card swipe reference number'
        });
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
    PaymentDetails,
    AddStudent,
}

export default schema