const { JWT_SECRET } = require("../config/config")
const { userTable, camps } = require('../utils/connectCAMPS')
const jwt = require('jsonwebtoken')

class AuthController {
    login = async (req, res) => {
        try {
            const { username, password, loginType } = req.body;

            if (loginType === 'google') {
                const { email } = req.body

                if (!email) {
                    return res.status(400).json({ message: "Email is required" });
                }

                let sql = `SELECT * FROM registration_user WHERE username = '${email}' AND status = 1`;
                let result = await userTable.query(sql);

                if (result[0].length === 0) {
                    return res.status(400).json({ message: "Invalid Credentials" });
                }

                const user = result[0][0];

                const token = jwt.sign(
                    { user_id: user.user_id, username: user.username, role: user.role },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );

                const decoded = jwt.verify(token, JWT_SECRET)

                res.json({ token: token, user_id: user.user_id, username: user.username, role: user.role, exp: decoded.exp });
            }

            else if (loginType === 'application_number') {
                if (!username || !password) {
                    return res.status(400).json({ message: "Username and password are required" });
                }

                // Check if user has already registered
                let sql = `SELECT * FROM pre_student_register WHERE tnea_app_no = '${username}'`
                let result = await camps.query(sql);

                // Check if the user has already submitted the application
                if (result?.[0]?.[0]?.application_no) {
                    return res.status(200).json({ message: "Application already submitted!" });
                }

                const userAlreadyExists = result[0].length > 0;

                // Insetion of new user in pre_student_register table if the user logins for the first time
                if (!userAlreadyExists) {
                    sql = `SELECT * FROM registration_user_details WHERE application_id = '${username}' AND mobile = '${atob(password)}'`
                    result = await camps.query(sql);

                    let row = result[0][0];
                    if (!row) {
                        return res.status(400).json({ message: "Invalid Credentials" });
                    }


                    let admissionType, admissionQuota
                    if (username[0] === 'G') {
                        admissionQuota = 'GOVERNMENT'
                    }
                    else if (username[0] === 'M') {
                        admissionQuota = 'MANAGEMENT'
                    }
                    else {
                        return res.status(400).json({ message: "Invalid Credentials" });
                    }

                    if (username[1] == 'L') {
                        admissionType = 'LATERAL'
                    }
                    else {
                        admissionType = 'REGULAR'
                    }

                    // Insert the row into the database
                    let fields = {
                        // "sno": "",
                        // "application_no": "",
                        // "app_date": "",
                        // "legend": "",
                        // "student_name": "",
                        // "initial": "",

                        "gender": row.gender,

                        // "dob": "",
                        // "father_name": "",
                        // "mother_name": "",
                        // "guardian_name": "",
                        // "mother_tongue": "",
                        // "blood_group": "",
                        // "parent_income": "",
                        // "occupation": "",
                        // "work_area": "",
                        // "designation": "",
                        // "parent_income_mother": "",
                        // "occupation_mother": "",
                        // "work_area_mother": "",
                        // "designation_mother": "",

                        "section": "A",

                        // "age": "",
                        // "community_id": "",
                        // "caste_id": "",
                        // "religion_id": "",
                        // "nationality_id": "",
                        // "batch_id": "",
                        // "acad_yr_id": "",
                        // "branch_id": "",
                        // "course_id": "",
                        // "dept_id": "",
                        // "branch_type": "",
                        // "degree_level": "",
                        // "year_of_admission": "",
                        // "year_of_completion": "",
                        // "regulation_id": "",

                        "university_id": "5",

                        // "student_cat_id": "",
                        // "year_of_study": "",
                        // "sem_of_study": "",
                        // "seat_cat": "",
                        // "quota_id": "",
                        // "perm_add_street": "",
                        // "perm_add_town": "",
                        // "perm_add_city": "",
                        // "perm_add_district": "",
                        // "perm_add_pincode": "",
                        // "perm_add_state": "",
                        // "perm_add_country": "",
                        // "comm_add_street": "",
                        // "comm_add_town": "",
                        // "comm_add_city": "",
                        // "comm_add_district": "",
                        // "comm_add_pincode": "",
                        // "comm_add_state": "",
                        // "comm_add_country": "",
                        // "parent_mobile_no": "",
                        // "perm_phone_no": "",
                        // "parent_email_id": "",

                        "stu_mobile_no": row.mobile,

                        // "comm_phone_no": "",

                        "stu_email_id": row.email,

                        // "scholar": "",
                        // "nominee_name": "",
                        // "nominee_relation": "",
                        // "nominee_age": "",
                        // "area_location": "",
                        // "study_medium": "",

                        "tnea_app_no": row.application_id,

                        // "tnea_adm_no": "",
                        // "general_rank": "",
                        // "comm_rank": "",
                        // "tnea_pay_rec_no": "",
                        // "tnea_pay_rec_date": "",
                        // "tnea_pay_rec_amt": "",
                        // "tnea_pay_bank": "",
                        "adm_sch_name1": row.first_graduate.toLowerCase() === "yes" ? "FIRST GRADUATE." : "",
                        // "adm_sch_name2": "",
                        "adm_sch_amt1": row.first_graduate.toLowerCase() === "yes" ? "25000" : "",
                        // "adm_sch_amt2": "",

                        "physics_secured": "0",
                        "physics_max": "0",
                        "physics_percentage": "0",
                        "chemistry_secured": "0",
                        "chemistry_max": "0",
                        "chemistry_percentage": "0",
                        "maths_secured": "0",
                        "maths_max": "0",
                        "maths_percentage": "0",
                        "biology_secured": "0",
                        "biology_max": "0",
                        "biology_percentage": "0",
                        "cs_secured": "0",
                        "cs_max": "0",
                        "cs_percentage": "0",
                        "entrance_secured": "0",
                        "entrance_max": "0",
                        "entrance_percenteage": "0",
                        "diploma_first_sec": "0",
                        "diploma_first_max": "0",
                        "diploma_first_per": "0",
                        "diploma_second_sec": "0",
                        "diploma_second_max": "0",
                        "diploma_second_per": "0",
                        "diploma_third_sec": "0",
                        "diploma_third_max": "0",
                        "diploma_third_per": "0",
                        "diploma_fourth_sec": "0",
                        "diploma_fourth_max": "0",
                        "diploma_fourth_per": "0",
                        "diploma_fifth_sec": "0",
                        "diploma_fifth_max": "0",
                        "diploma_fifth_per": "0",
                        "diploma_sixth_sec": "0",
                        "diploma_sixth_max": "0",
                        "diploma_sixth_per": "0",
                        "diploma_seventh_sec": "0",
                        "diploma_seventh_max": "0",
                        "diploma_seventh_per": "0",
                        "diploma_eighth_sec": "0",
                        "diploma_eighth_max": "0",
                        "diploma_eighth_per": "0",
                        "diploma_ninenth_sec": "0",
                        "diploma_ninenth_max": "0",
                        "diploma_ninenth_per": "0",
                        "diploma_tenth_sec": "0",
                        "diploma_tenth_max": "0",
                        "diploma_tenth_per": "0",
                        "ug_mark_sec": "0",
                        "ug_mark_max": "0",
                        "ug_mark_per": "0",
                        "phy_che": "0",
                        "maths": "0",
                        "cut_off": "0",
                        "I_II": "0",
                        "III_IV": "0",
                        "V_VI": "0",
                        "VII_VIII": "0",
                        "IX_X": "0",

                        // "genrel_note1": "",
                        // "genrel_note2": "",
                        // "sch_qual_id": "",
                        // "sch_yr_pass": "",
                        // "sch_study_state": "",
                        // "sch_attempt": "",

                        "pcm_sec": "0",
                        "pcm_max": "0",
                        "pcm_per": "0",

                        // "sch_reg1": "",
                        // "sch_reg2": "",
                        // "sch_cer1": "",
                        // "sch_cer2": "",

                        "sch_tot_mark1": "0",
                        "sch_tot_mark2": "0",

                        // "school_name": "",
                        // "school_tc_no": "",
                        // "school_tc_date": "",
                        // "school_class": "",
                        // "school_board": "",
                        // "ent_reg_no": "",

                        "photo": "",

                        // "aadhar_no": ""

                        inserted_by: row.application_id,
                        inserted_date: new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ')
                    }


                    if (admissionType == "LATERAL") {
                        fields.student_cat_id = 12;
                    }
                    else {
                        fields.student_cat_id = 11; //REGULAR
                    }

                    if (admissionQuota == "GOVERNMENT") {
                        fields.seat_cat = 'GOVERNMENT';
                    }
                    else {
                        fields.seat_cat = 'MANAGEMENT';
                        fields.quota_id = '42'; // MANAGEMENT
                    }

                    try {
                        // Getting name and initial
                        const { initial, name } = ((p) => ({
                            initial: p.filter(w => /^[A-Z]$/.test(w)).join(' '),
                            name: p.filter(w => !/^[A-Z]$/.test(w)).join(' ')
                        }))(row.name.toUpperCase().trim().split(/\s+/));
                        fields.initial = initial
                        fields.student_name = name

                        // Fetching community_id from community_master
                        try {
                            const community_id = await camps.query(`
                                SELECT community_id FROM community_master WHERE community_name='${row.community}'
                            `)
                            fields.community_id = community_id?.[0]?.[0]?.community_id
                        } catch (error) {
                            console.error(`Error fetching community_id: ${error.message}`);
                            return res.status(500).json({ error: "Unable to fetch community_id" });
                        }

                        const branch_id = await camps.query(`
                                SELECT branch_id FROM branch_master WHERE branch_name='${row.branch.toUpperCase()}' AND degree_level='${row.degree_level.toUpperCase()}'
                            `)
                        fields.branch_id = branch_id?.[0]?.[0]?.branch_id

                        fields.branch_type = fields.branch_id
                        fields.year_of_admission = new Date().getFullYear()

                        if (fields.student_cat_id == 12) {
                            fields.year_of_study = 'II'
                            fields.sem_of_study = 'III'
                            fields.year_of_completion = fields.year_of_admission + 3
                        } else {
                            fields.year_of_study = 'I'
                            fields.sem_of_study = 'I'
                        }

                        // Getting branch details
                        const branch_details = await camps.query(`
                                SELECT course_id, dept_id, branch_type, degree_level, no_of_year
                                FROM branch_master WHERE branch_id=${fields.branch_id}
                            `)
                        fields.course_id = branch_details[0][0].course_id
                        fields.dept_id = branch_details[0][0].dept_id
                        fields.degree_level = branch_details[0][0].degree_level

                        if (!fields.year_of_completion) {
                            fields.year_of_completion = fields.year_of_admission + branch_details[0][0].no_of_year
                        }


                        // Getting regulation_id
                        let year_master_id = ''
                        if (fields.degree_level == 'RS') {
                            year_master_id = '4'
                        }
                        else if (fields.degree_level == 'PG') {
                            year_master_id = '3'
                        }
                        else if (fields.degree_level == 'UG' && fields.student_cat_id == 12) {
                            year_master_id = '2'
                        }
                        else {
                            year_master_id = '1'
                        }
                        const regulation_id = await camps.query(`
                            SELECT regulation FROM year_master WHERE id=${year_master_id}
                        `)
                        fields.regulation_id = regulation_id[0][0].regulation
                        // fields.regulation_id = 24

                        // Getting batch_id
                        if (fields.student_cat_id == 11) {
                            const batch_id = await camps.query(`
                                    SELECT batch_id FROM batch_master WHERE batch=${fields.year_of_admission}
                                `)
                            fields.batch_id = batch_id[0][0].batch_id
                        } else {
                            const batch_id = await camps.query(`
                                SELECT batch_id FROM batch_master WHERE batch=${fields.year_of_admission - 1}
                                `)
                            fields.batch_id = batch_id[0][0].batch_id
                        }

                        const acad_yr_id = await camps.query(`
                            SELECT acc_year_id FROM academic_year_master WHERE acc_year='${fields.year_of_admission}-${fields.year_of_admission + 1}'
                            `)

                        fields.acad_yr_id = acad_yr_id[0][0].acc_year_id

                        try {
                            const keys = Object.keys(fields);
                            const values = Object.values(fields).map(v => v === null || v==="" ? 'NULL' : `'${v}'`);
                            const sql = `
                                INSERT INTO pre_student_register (
                                    ${keys.join(', ')}
                                )
                                VALUES(
                                    ${values.join(', ')}
                                )
                            `

                            const result = await camps.query(sql)
                            const application_no = result[0].insertId

                        } catch (error) {
                            console.error(`Error inserting row: ${JSON.stringify(row)} - ${error.message}`);
                            console.log(error);
                            return res.status(500).json({ error: "Error inserting row" });
                        }
                    } catch (error) {
                        console.error(`Error inserting row: ${JSON.stringify(row)} - ${error.message}`);
                        console.log(error);
                        return res.status(500).json({ error: "Unable to insert row" });
                    }
                }

                sql = `SELECT * FROM pre_student_register WHERE tnea_app_no = '${username}' AND stu_mobile_no = '${atob(password)}'`

                result = await camps.query(sql);
                result = result[0][0];

                // Insert values into admission_payment_details table
                if (!userAlreadyExists) {

                    const admissionPaymentFields = {
                        pre_student_register_sno: result.sno,
                        seat_category: result.seat_cat,
                        application_id: (result.tnea_app_no || '').replace(/\D/g, ''),
                        year: result.year_of_study,
                        branch_id: result.branch_id,
                        course_id: result.course_id,
                        student_name: result.student_name + ' ' + result.initial,
                        mobile_number: result.stu_mobile_no,
                        first_graduate: result.adm_sch_name1 === "FIRST GRADUATE." ? 'yes' : 'no',
                        inserted_by: result.tnea_app_no,
                        inserted_at: new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ')
                    }

                    try {
                        const admissionPaymentSql = `
                        INSERT INTO admission_payment_details (${Object.keys(admissionPaymentFields).join(', ')})
                        VALUES('${Object.values(admissionPaymentFields).join("', '")}')
                    `
                        await camps.query(admissionPaymentSql);
                    } catch (error) {
                        console.error(`Error inserting admission payment details: ${error}`);
                        return res.status(500).json({ error: "Unable to insert admission payment details" });
                    }
                }

                // User details from pre_student_register
                const user = result;

                // Generate JWT token
                if (user) {
                    const token = jwt.sign(
                        { user_id: user.tnea_app_no, username: user.student_name, role: user.seat_cat },
                        JWT_SECRET,
                        { expiresIn: '7d' }
                    );

                    const decoded = jwt.verify(token, JWT_SECRET)

                    res.json({ application_no: user.sno, token: token, user_id: user.tnea_app_no, username: user.student_name, name: user.student_name, role: user.seat_cat, exp: decoded.exp });
                } else {
                    res.status(400).json({ message: "Invalid Credentials" });
                }
            }

            else {

                if (!username || !password) {
                    return res.status(400).json({ message: "Username and password are required" });
                }

                let sql = `SELECT * FROM registration_user WHERE username = '${username}'`
                let result = await userTable.query(sql);

                if (result[0].length === 0) {
                    return res.status(400).json({ message: "Invalid Credentials" });
                }

                const pwdsalt = result[0][0].pwdsalt

                sql = `SELECT * FROM registration_user WHERE username = '${username}' AND password = SHA2(CONCAT('${atob(password)}', '${pwdsalt}'), 256) AND status = 1`

                result = await userTable.query(sql);

                const user = result[0][0];

                if (user) {
                    const token = jwt.sign(
                        { user_id: user.id, username: user.username, role: user.role },
                        JWT_SECRET,
                        { expiresIn: '7d' }
                    );

                    const decoded = jwt.verify(token, JWT_SECRET)

                    res.json({ token: token, user_id: user.id, username: user.username, role: user.role, exp: decoded.exp });
                } else {
                    res.status(400).json({ message: "Invalid Credentials" });
                }
            }
        } catch (error) {
            console.log(error);

            res.status(500).json({ error: "Unable to login", message: error.message });
        }
    };


    addUser = async (req, res) => {
        try {
            const { email, role } = req.body

            let sql = `SELECT * FROM registration_user WHERE username = '${email}'`
            let result = await userTable.query(sql)

            if (result[0][0] && result[0][0].status == 1) {
                return res.status(400).json({ message: "User already exists" })
            }
            else if (result[0][0] && result[0][0].status == 0) {
                sql = `UPDATE registration_user SET status = 1 WHERE username = '${email}'`
                await userTable.query(sql)
            } else {
                sql = `INSERT INTO registration_user (username, role) VALUES ('${email}', '${role}');`
                await userTable.query(sql)
            }

            res.send("User added successfully")
        } catch (error) {
            res.status(500).json({ error: "Unable to add user", message: error.message })
        }
    }

    getUserDetails = async (req, res) => {
        try {
            const sql = `SELECT user_id, username AS email, role FROM registration_user WHERE status = 1`

            const result = await userTable.query(sql)

            res.json(result[0])
        } catch (error) {
            res.status(500).json({ error: "Unable to fetch user details", message: error.message })
        }
    }

    editUser = async (req, res) => {
        try {
            const user_id = req.params.id
            const { email, role } = req.body

            let sql = `UPDATE registration_user SET username = '${email}', role = '${role}' WHERE user_id = ${user_id}`

            await userTable.query(sql)

            res.send("User updated successfully")
        } catch (error) {
            res.status(500).json({ error: "Unable to update user", message: error.message })
        }
    }

    deleteUser = async (req, res) => {
        try {
            const user_id = req.params.id

            let sql = `UPDATE registration_user SET status = 0 WHERE user_id = '${user_id}'`

            await userTable.query(sql)

            res.send("User deleted successfully")
        } catch (error) {
            res.status(500).json({ error: "Unable to delete user", message: error.message })
        }
    }
    // register = async (req, res) => {
    //     try {
    //         const { username, password } = req.body

    //         const salt = (Math.random() + 1).toString(36).substring(2)

    //         const sql = `INSERT INTO registration_user (username, password, pwdsalt) VALUES ('${username}', SHA256(CONCAT('${salt}', '${password}')), '${salt}');`

    //         await userTable.query(sql)

    //         res.send("User created successfully")
    //     } catch (error) {
    //         res.status(500).json({ error: "Unable to register", message: error.message })
    //     }
    // }
}

module.exports = AuthController