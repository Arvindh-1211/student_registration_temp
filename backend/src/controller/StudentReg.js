const { response } = require("express");
const { camps, transport } = require("../utils/connectCAMPS");

class StudentRegController {
    getSubmittedApplication = async (req, res) => {
        try {
            const sql = `
                SELECT psr.sno, psr.application_no, psr.student_name, psr.initial, psr.stu_mobile_no, psr.tnea_app_no, psr.scholar,
                    (SELECT bm.branch_name FROM branch_master bm WHERE bm.branch_id=psr.branch_id) AS branch,
                    (SELECT cm.course_code FROM course_master cm WHERE cm.course_id=psr.course_id) AS course,
                    (SELECT sc.stu_cat FROM student_category sc WHERE sc.stu_cat_id=psr.student_cat_id) AS student_cat
                FROM pre_student_register psr WHERE psr.application_no IS NOT NULL ORDER BY psr.application_no DESC
            `;
            const result = await camps.query(sql)
            res.json(result[0]);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching incomplete applications', message: error.message });
        }
    }

    getUnfreezedApplications = async (req, res) => {
        try {
            const sql = `
                SELECT psr.sno, psr.student_name, psr.initial, psr.stu_mobile_no, psr.tnea_app_no, psr.scholar,
                    (SELECT bm.branch_name FROM branch_master bm WHERE bm.branch_id=psr.branch_id) AS branch,
                    (SELECT cm.course_code FROM course_master cm WHERE cm.course_id=psr.course_id) AS course,
                    (SELECT sc.stu_cat FROM student_category sc WHERE sc.stu_cat_id=psr.student_cat_id) AS student_cat
                FROM pre_student_register psr 
                WHERE psr.application_no IS NULL
                ORDER BY psr.sno DESC
            `;
            const result = await camps.query(sql)
            res.json(result[0]);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching unfreezed applications', message: error.message });
        }
    }

    getIncompleteApplication = async (req, res) => {
        try {
            const sql = `
                SELECT psr.sno, psr.student_name, psr.initial, psr.stu_mobile_no, psr.tnea_app_no, psr.scholar,
                    (SELECT bm.branch_name FROM branch_master bm WHERE bm.branch_id=psr.branch_id) AS branch,
                    (SELECT cm.course_code FROM course_master cm WHERE cm.course_id=psr.course_id) AS course,
                    (SELECT sc.stu_cat FROM student_category sc WHERE sc.stu_cat_id=psr.student_cat_id) AS student_cat
                FROM pre_student_register psr 
                INNER JOIN admission_payment_details apd ON apd.pre_student_register_sno = psr.sno
                WHERE (psr.application_no = 0 OR psr.application_no IS NULL)
                    AND apd.approved_by IS NOT NULL
                ORDER BY psr.sno DESC
            `;
            const result = await camps.query(sql)
            res.json(result[0]);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching incomplete applications', message: error.message });
        }
    }

    getPaymentNotVerifiedApplications = async (req, res) => {
        try {
            const sql = `
                SELECT psr.sno, psr.student_name, psr.initial, psr.stu_mobile_no, psr.tnea_app_no, psr.scholar,
                    (SELECT bm.branch_name FROM branch_master bm WHERE bm.branch_id=psr.branch_id) AS branch,
                    (SELECT cm.course_code FROM course_master cm WHERE cm.course_id=psr.course_id) AS course,
                    (SELECT sc.stu_cat FROM student_category sc WHERE sc.stu_cat_id=psr.student_cat_id) AS student_cat
                FROM pre_student_register psr 
                INNER JOIN admission_payment_details apd ON apd.pre_student_register_sno = psr.sno
                WHERE psr.application_no IS NULL 
                    AND apd.approved_by IS NULL
                ORDER BY psr.sno DESC
            `;
            const result = await camps.query(sql)
            res.json(result[0]);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching incomplete applications', message: error.message });
        }
    }


    deleteIncompleteApplication = async (req, res) => {
        try {
            const applicationNo = req.params.application_no;
            const sql = `DELETE FROM pre_student_register WHERE sno = ${applicationNo}`;
            await camps.query(sql)
            res.json({ message: `Application: ${applicationNo} deleted successfully` });
        } catch (error) {
            res.status(500).send({ error: 'Error fetching data from registration_user_details', message: error.message });
        }
    }

    getStudentUserDetails = async (req, res) => {
        try {
            const sql = `SELECT application_id, name, branch, community, gender, email, mobile, degree_level, first_graduate FROM registration_user_details ORDER BY inserted_on DESC`;
            const result = await camps.query(sql)
            res.json(result[0]);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching data from registration_user_details', message: error.message });
        }
    }

    insertStudentUserDetails = async (req, res) => {
        try {
            const data = req.body;
            let insertedCount = 0;
            let skippedCount = 0;
            let insertionError = [];

            // const fields = Object.keys(data[0]).join(', '); // Extract column names

            for (let row of data) {
                try {
                    // Filter out required fields
                    const requiredFields = ['application_id', 'name', 'branch', 'community', 'gender', 'email', 'mobile', 'degree_level', 'first_graduate'];
                    row = Object.fromEntries(
                        Object.entries(row).filter(([key]) => requiredFields.includes(key))
                    );

                    row.inserted_on = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' '); // Set current timestamp
                    row.inserted_by = `${req.user.user_id}`; // Assuming req.user.user_id contains the ID of the user performing the insertion

                    if (!(row?.application_id?.[0] === 'M' || row?.application_id?.[0] === 'G')) {
                        console.log(`Application ID invalid: ${row}`);
                        insertionError.push(`Application ID invalid: Should be prefixed with 'G' or 'M'  application_id: ${row.application_id}`);
                        skippedCount++;
                        continue;
                    }

                    if(row?.first_graduate){
                        row.first_graduate.toLowerCase()
                    }

                    // Check if the row already exists in the database
                    let checkSql = `SELECT COUNT(*) as count FROM registration_user_details WHERE application_id = '${row.application_id}'`;
                    let checkResult = await camps.query(checkSql);

                    if (checkResult[0][0].count > 0) {
                        insertionError.push(`Application number already exists: ${row.application_id}`);
                        skippedCount++;
                        continue; // Skip this row if it already exists
                    }

                    // Check if branch_id is present in the branch_master table
                    checkSql = `SELECT COUNT(*) as count FROM branch_master WHERE branch_name = '${row.branch.toUpperCase()}' AND degree_level = '${row.degree_level.toUpperCase()}'`;
                    checkResult = await camps.query(checkSql);
                    if (checkResult[0][0].count === 0) {
                        console.log(`Branch not found: ${row.branch}`);
                        insertionError.push(`Branch not found: ${row.branch}, application_id: ${row.application_id}`);
                        skippedCount++;
                        continue; // Skip this row if branch_id is not found
                    }

                    // Check if community_id is present in the community_master table
                    checkSql = `SELECT COUNT(*) as count FROM community_master WHERE community_name = '${row.community.toUpperCase()}'`;
                    checkResult = await camps.query(checkSql);
                    if (checkResult[0][0].count === 0) {
                        console.log(`Community not found: ${row.community}`);
                        insertionError.push(`Community not found: ${row.community}, application_id: ${row.application_id}`);
                        skippedCount++;
                        continue; // Skip this row if community_id is not found
                    }

                    const sql = `
                        INSERT INTO registration_user_details (
                            ${Object.keys(row).join(', ')}
                        )
                        VALUES(
                            ${Object.values(row).map(value => value === null ? 'NULL' : `'${value}'`).join(', ')}
                        )
                    `;

                    await camps.query(sql);
                    insertedCount++;
                } catch (error) {
                    console.error(`Error inserting row: ${JSON.stringify(row)} - ${error.message}`);
                    skippedCount++;
                }
            }

            res.json({
                message: "Insertion completed",
                insertedCount,
                skippedCount,
                insertionError,
            });
        } catch (error) {
            res.status(500).json({ error: 'Error inserting data', message: error.message });
        }
    }

    getData = async (req, res) => {
        try {
            const fields = req.query.fields;
            const applicationNo = req.params.application_no;

            const sql = `
            SELECT ${fields}
            FROM pre_student_register
            WHERE sno = ${applicationNo}
            `;

            const result = await camps.query(sql)
            res.send(result[0][0]);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching data from student_register', message: error.message });
        }
    }

    insertNew = async (req, res) => {
        const { username, password } = req.body;
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


        // Insetion of new user in pre_student_register table if the user logins for the first time
        if (result[0].length === 0) {
            sql = `SELECT * FROM registration_user_details WHERE application_id = '${username}' AND mobile = '${password}'`
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
                // "adm_sch_name1": "",
                // "adm_sch_name2": "",
                // "adm_sch_amt1": "",
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
                    const values = Object.values(fields).map(v => v === null || v === "" ? 'NULL' : `'${v}'`);
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

        sql = `SELECT * FROM pre_student_register WHERE tnea_app_no = '${username}' AND stu_mobile_no = '${password}'`

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

        if (user) {
            res.json({ application_no: user.sno })
        } else {
            res.status(500).json({ message: "Unable to create new application" });
        }
    }

    // insertNew = async (req, res) => {
    //     let fields = {
    //         batch_id: '',
    //         acad_yr_id: '',
    //         branch_id: '',
    //         course_id: '',
    //         dept_id: '',
    //         branch_type: '',
    //         degree_level: '',
    //         year_of_admission: '',
    //         year_of_completion: '',
    //         regulation_id: '',
    //         university_id: '5',
    //         student_cat_id: '',
    //         year_of_study: '',
    //         sem_of_study: '',
    //         section: 'A',
    //     }

    //     try {
    //         fields.branch_id = req.body.branch_id
    //         fields.branch_type = fields.branch_id
    //         fields.student_cat_id = req.body.student_cat_id
    //         fields.year_of_admission = new Date().getFullYear()

    //         if (fields.student_cat_id == 12) {
    //             fields.year_of_study = 'II'
    //             fields.sem_of_study = 'III'
    //             fields.year_of_completion = fields.year_of_admission + 3
    //         } else {
    //             fields.year_of_study = 'I'
    //             fields.sem_of_study = 'I'
    //         }

    //         // Getting branch details
    //         const branch_details = await camps.query(`
    //                 SELECT course_id, dept_id, branch_type, degree_level, no_of_year
    //                 FROM branch_master WHERE branch_id=${fields.branch_id}
    //             `)
    //         fields.course_id = branch_details[0][0].course_id
    //         fields.dept_id = branch_details[0][0].dept_id
    //         fields.degree_level = branch_details[0][0].degree_level

    //         if (fields.year_of_completion === '') {
    //             fields.year_of_completion = fields.year_of_admission + branch_details[0][0].no_of_year
    //         }

    //         // Getting regulation_id
    //         let year_master_id = ''
    //         if (fields.degree_level == 'RS') {
    //             year_master_id = '4'
    //         }
    //         else if (fields.degree_level == 'PG') {
    //             year_master_id = '3'
    //         }
    //         else if (fields.degree_level == 'UG' && fields.student_cat_id == 12) {
    //             year_master_id = '2'
    //         }
    //         else {
    //             year_master_id = '1'
    //         }
    //         const regulation_id = await camps.query(`
    //             SELECT regulation FROM year_master WHERE id=${year_master_id}
    //         `)
    //         fields.regulation_id = regulation_id[0][0].regulation

    //         // Getting batch_id
    //         if (fields.student_cat_id == 11) {
    //             const batch_id = await camps.query(`
    //                     SELECT batch_id FROM batch_master WHERE batch=${fields.year_of_admission}
    //                 `)
    //             fields.batch_id = batch_id[0][0].batch_id
    //         } else {
    //             const batch_id = await camps.query(`
    //                 SELECT batch_id FROM batch_master WHERE batch=${fields.year_of_admission - 1}
    //                 `)
    //             fields.batch_id = batch_id[0][0].batch_id
    //         }

    //         const acad_yr_id = await camps.query(`
    //             SELECT acc_year_id FROM academic_year_master WHERE acc_year='${fields.year_of_admission}-${fields.year_of_admission + 1}'
    //             `)

    //         fields.acad_yr_id = acad_yr_id[0][0].acc_year_id
    //         try {
    //             const sql = `
    //                 INSERT INTO pre_student_register (
    //                 ${Object.keys(fields).join(', ')}
    //                 )
    //                 VALUES(
    //                 '${Object.values(fields).join("', '")}'
    //                 )
    //             `
    //             const result = await camps.query(sql)
    //             const application_no = result[0].insertId
    //             res.send({ application_no: application_no })
    //         } catch (error) {
    //             res.status(500).send({ error: 'Error inserting data into student_register', message: error.message });
    //         }
    //     } catch (error) {
    //         res.status(500).send({ error: 'Error fetching data from master tables', message: error.message });
    //     }

    // }

    updateStudentReg = async (req, res) => {
        try {
            const sql = `
            UPDATE pre_student_register
            SET ${Object.entries(req.body)
                    .map(([key, value]) => `${key} = ${value === null || value === '' ? null : `'${value}'`} `)
                    .join(', ')
                },
                modified_date = '${new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ')}',
                modified_by = '${req.user.user_id}'
            WHERE sno = ${req.params.application_no}
        `;

            const result = await camps.query(sql)
            res.send(result);
        } catch (error) {
            res.status(500).send({ error: 'Error updating student_register', message: error });
        }
    }

    freezeApplication = async (req, res) => {
        try {
            const applicationNo = req.params.application_no;
            const sql = `UPDATE pre_student_register SET application_no = '0' WHERE sno = ${applicationNo}`;
            await camps.query(sql)
            res.json({ message: `Application: ${applicationNo} frozen successfully` });
        } catch (error) {
            res.status(500).send({ error: 'Error freezing application', message: error.message });
        }
    }

    insertStudentAdditionalDet = async (req, res) => {
        try {

            let sql = `SELECT appl_no FROM pre_student_additional_det WHERE appl_no=${req.body.appl_no}`

            const isPresent = await camps.query(sql)
            if (!isPresent[0][0]) {

                req.body.inserted_by = req.user.user_id
                req.body.inserted_date = new Date().toISOString().slice(0, 19)

                const fields = Object.keys(req.body).join(', ');
                const values = Object.values(req.body).map(value => {
                    if (value === undefined || value === null || value === '') {
                        return 'NULL';
                    }
                    if (typeof value === 'string') {
                        return `'${value.replace(/'/g, "''")}'`;
                    }
                    return value;
                }).join(', ');

                sql = `INSERT INTO pre_student_additional_det (${fields}) VALUES (${values})`

            } else {

                req.body.updated_by = req.user.user_id
                req.body.updated_date = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ')

                sql = `
                    UPDATE pre_student_additional_det
                    SET ${Object.entries(req.body)
                        .map(([key, value]) => `${key} = ${value === null ? value : `'${value}'`} `)
                        .join(', ')
                    }
                    WHERE appl_no = ${req.body.appl_no}
                `;

            }
            const result = await camps.query(sql)
            res.json({ message: "Row inserted" })
        } catch (error) {
            res.status(500).send({ error: 'Error inserting student_additional_det', message: error })
        }
    }

    getStudentAdditionalDet = async (req, res) => {
        try {
            const fields = req.query.fields;
            const applicationNo = req.params.application_no;

            const sql = `
                SELECT ${fields}
                FROM pre_student_additional_det
                WHERE appl_no = ${applicationNo}
            `;

            const result = await camps.query(sql)

            res.send(result[0][0]);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching data from student_register', message: error.message });
        }
    }

    updatePaymentDetails = async (req, res) => {
        try {
            const application_no = req.params.application_no; // Get from route params

            // Update existing record
            req.body.modified_by = req.user.user_id;
            req.body.modified_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

            req.body.dd_date ? req.body.dd_date = new Date(req.body.dd_date).toISOString().slice(0, 19).replace('T', ' ') : req.body.dd_date = null;
            req.body.partial_payment_date ? req.body.partial_payment_date = new Date(req.body.partial_payment_date).toISOString().slice(0, 19).replace('T', ' ') : req.body.partial_payment_date = null;

            if (req.body.boarding_point) {
                const boardingPointResults = await transport.query(
                    `SELECT 
                        bpm.boarding_point_id,
                        rbm.route_id
                    FROM 
                        tr_boardingpoint_master AS bpm
                    JOIN 
                        Transport.tr_rt_br_mapping AS rbm 
                        ON bpm.boarding_point_id = rbm.boarding_point_id
                    WHERE 
                        bpm.boarding_point = '${req.body.boarding_point}' AND bpm.status = 1;
                    `
                );
                req.body.bus_boarding_point = boardingPointResults[0][0]?.boarding_point_id || null;
                req.body.bus_route = boardingPointResults[0][0]?.route_id || null;
                delete req.body.boarding_point;
                
            }
            if (req.body.bus_boarding_point) {
                const boardingPointResults = await transport.query(
                    `SELECT 
                        bpm.boarding_point_id,
                        rbm.route_id
                    FROM 
                        tr_boardingpoint_master AS bpm
                    JOIN 
                        Transport.tr_rt_br_mapping AS rbm 
                        ON bpm.boarding_point_id = rbm.boarding_point_id
                    WHERE 
                        bpm.boarding_point_id = '${req.body.bus_boarding_point}' AND bpm.status = 1;
                    `
                );
                req.body.bus_boarding_point = boardingPointResults[0][0]?.boarding_point_id || null;
                req.body.bus_route = boardingPointResults[0][0]?.route_id || null;
            }
            

            // Remove fields that shouldn't be updated
            const { inserted_at, inserted_by, ...updateData } = req.body;

            const updateFields = Object.keys(updateData);
            const updateValues = Object.values(updateData).map(value => {
                if (value === undefined || value === null || value === '') {
                    return null;
                }
                return value;
            });

            const setClause = updateFields.map(field => `${field} = ?`).join(', ');

            const sql = `UPDATE admission_payment_details SET ${setClause} WHERE pre_student_register_sno = ?`;
            await camps.query(sql, [...updateValues, application_no]);

            res.json({ message: "Payment details saved successfully" });

        } catch (error) {
            console.error('Error saving admission payment details:', error);
            res.status(500).json({
                error: 'Error saving admission payment details',
                message: error.message
            });
        }
    };

    getPaymentDetails = async (req, res) => {
        try {
            const fields = req.query.fields;
            const applicationNo = req.params.application_no;

            const sql = `
            SELECT ${fields}
            FROM admission_payment_details
            WHERE pre_student_register_sno = ${applicationNo}
        `;

            const result = await camps.query(sql)

            res.send(result[0][0]);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching data from admission_payment_details', message: error.message });
        }
    }

    getTotalFees = async (req, res) => {
        try {
            const applicationNo = req.params.application_no;
            let sql = `SELECT * FROM admission_payment_details WHERE pre_student_register_sno = ${applicationNo}`;
            const payment_details = await camps.query(sql);

            const seatCategoryPascal = payment_details[0][0].seat_category
                ? payment_details[0][0].seat_category.charAt(0).toUpperCase() + payment_details[0][0].seat_category.slice(1).toLowerCase()
                : '';
            const scholarPascal = payment_details[0][0].scholar
                ? payment_details[0][0].scholar.charAt(0).toUpperCase() + payment_details[0][0].scholar.slice(1).toLowerCase()
                : '';
            sql = `SELECT college_fee, hostel_lunch, total_fee FROM admission_fee_demand WHERE branch_id = ${payment_details[0][0].branch_id} AND seat_category = '${seatCategoryPascal}' AND scholar = '${scholarPascal}'`;
            const fee_details = await camps.query(sql);
            if (fee_details[0].length === 0) {
                return res.status(404).json({ message: "No fee details found for the given branch and seat category" });
            }
            const total_fee = Number(fee_details[0][0].total_fee) || 0;
            const college_fee = Number(fee_details[0][0].college_fee) || 0;
            const hostel_lunch = Number(fee_details[0][0].hostel_lunch) || 0;
            const first_graduate = payment_details[0][0].first_graduate.toLowerCase() === 'yes' ? 25000 : 0;

            let bus_fee = 0;
            if (payment_details[0][0].bus_boarding_point) {
                sql = `SELECT amount FROM Transport.tr_boardingpoint_master WHERE boarding_point_id = ${payment_details[0][0].bus_boarding_point}`;
                const bus_fee_result = await camps.query(sql);
                if (bus_fee_result[0].length > 0) {
                    bus_fee = Number(bus_fee_result[0][0].amount) || 0;
                }
            }

            const response = {
                to_be_paid: total_fee + bus_fee - first_graduate,
                total_fee: total_fee,
            };
            if (bus_fee !== 0) {
                response.bus_fee = bus_fee;
            }
            if (first_graduate !== 0) {
                response.first_graduate = first_graduate;
            }

            res.json(response);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching total fees', message: error.message });
        }
    }

    insertIntoCAMPS = async (req, res) => {
        try {
            // Getting application number from student_reg_temp
            let sql = `INSERT INTO student_reg_temp (ip) VALUES (NULL);`

            const application_no = await camps.query(sql)

            const APPLICATION_NO = application_no[0].insertId

            const applicationNo = req.params.application_no;

            // Inserting into student_register table
            sql = `SELECT * FROM pre_student_register WHERE sno = ${applicationNo}`;

            let student_reg = await camps.query(sql)
            student_reg = student_reg[0][0]
            delete student_reg['sno']
            student_reg['application_no'] = APPLICATION_NO
            if (student_reg['dob']) {
                student_reg['dob'] = new Date(student_reg['dob']).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
            }
            if (student_reg['tnea_pay_rec_date']) {
                student_reg['tnea_pay_rec_date'] = new Date(student_reg['tnea_pay_rec_date']).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
            }
            if (student_reg['school_tc_date']) {
                student_reg['school_tc_date'] = new Date(student_reg['school_tc_date']).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
            }
            if (student_reg['tnea_app_no']) {
                if (student_reg['tnea_app_no'][0] === 'M') {
                    student_reg['tnea_app_no'] = null
                }
                else if (student_reg['tnea_app_no'][0] === 'G') {
                    student_reg['tnea_app_no'] = student_reg['tnea_app_no'].substring(1)
                    if (student_reg['tnea_app_no'][0] === 'L') {
                        student_reg['tnea_app_no'] = student_reg['tnea_app_no'].substring(1)
                    }
                }
            }

            student_reg['app_date'] = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
            student_reg['inserted_by'] = req.user.user_id
            student_reg['inserted_date'] = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ')
            student_reg['modified_by'] = req.user.user_id
            student_reg['modified_date'] = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ')
            let fields = Object.keys(student_reg).join(', ')
            let values = Object.entries(student_reg).map(([key, value]) => {
                if (key === 'photo') {
                    return `''`; // force empty string for photo column
                } else if (value === null || value === undefined || value === '') {
                    return 'null';
                } else if (typeof value === 'string') {
                    return `'${value.replace(/'/g, "''")}'`;
                }
                return value;
            }).join(', ');

            sql = `INSERT INTO student_register (${fields}) VALUES (${values})`
            let result = await camps.query(sql)


            // Inserting into student_additional_det table
            sql = `SELECT * FROM pre_student_additional_det WHERE appl_no = ${applicationNo}`

            let student_additional_det = await camps.query(sql)
            student_additional_det = student_additional_det[0][0]
            student_additional_det['appl_no'] = APPLICATION_NO
            student_additional_det['enroll_no'] = '0'

            student_additional_det['inserted_by'] = req.user.user_id
            student_additional_det['inserted_date'] = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ')
            student_additional_det['updated_by'] = req.user.user_id
            student_additional_det['updated_date'] = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ')

            fields = Object.keys(student_additional_det).join(', ')
            values = Object.values(student_additional_det).map(value => {
                if (typeof value === 'string') {
                    return `'${value.replace(/'/g, "''")}'`
                } else if (value === null) {
                    return 'null'
                }
                return value
            }).join(', ')

            sql = `INSERT INTO student_additional_det (${fields}) VALUES (${values})`
            result = await camps.query(sql)

            // Insert into student_produced_certificates_reg table
            sql = `
                INSERT INTO student_produced_certificates_reg 
                (application_no, other_certificates, created_date, inserted_by) VALUES 
                (${APPLICATION_NO}, '', '${new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ')}', '${req.user.user_id}')
            `
            result = await camps.query(sql)

            // Insert into student_notproduced_certificates_reg table
            sql = `
                INSERT INTO student_notproduced_certificates_reg (application_no, enrollment_no, other_certificates, created_date, inserted_by) VALUES
                (${APPLICATION_NO}, 'null', '', '${new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ')}', '${req.user.user_id}')
            `
            result = await camps.query(sql)

            // Updating application number in student_register and student_additional_det
            sql = `UPDATE pre_student_register SET 
                    application_no = ${APPLICATION_NO}, 
                    modified_by = '${req.user.user_id}', 
                    modified_date = '${new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ')}'
                    WHERE sno = ${applicationNo}`
            result = await camps.query(sql)

            sql = `UPDATE pre_student_additional_det SET 
                    appl_no = ${APPLICATION_NO},
                    updated_by = '${req.user.user_id}', 
                    updated_date = '${new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ')}'
                    WHERE appl_no = ${applicationNo}`
            result = await camps.query(sql)

            res.json({ APPLICATION_NO: APPLICATION_NO })

        } catch (error) {
            res.status(500).send({ error: 'Error inserting into CAMPS', message: error });
        }

    }
    ifExist = async (req, res) => {
        try {
            const temp_appl_no = req.query.appl_no

            const sql = `SELECT sno, application_no FROM pre_student_register WHERE sno=${temp_appl_no}`
            const result = await camps.query(sql)

            if (result[0].length === 0) {
                return res.status(422).json({ message: "Application not found" })
            } else if (result[0][0].application_no) {
                return res.status(422).json({ message: "Application already submitted" })
            }

            res.status(200).json({ message: "Application found" })

        } catch (error) {
            res.status(500).send({ error: 'Some error occurred', message: error.message });
        }
    }
}

module.exports = StudentRegController;