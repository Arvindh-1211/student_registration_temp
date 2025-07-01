const { camps } = require("../utils/connectCAMPS");

class StudentRegController {
    getSubmittedApplication = async (req, res) => {
        try {
            const sql = `
                SELECT psr.sno, psr.application_no, psr.student_name, psr.initial, psr.father_name, psr.mother_name, psr.tnea_app_no,
                    (SELECT bm.branch_name FROM branch_master bm WHERE bm.branch_id=psr.branch_id) AS branch,
                    (SELECT cm.course_code FROM course_master cm WHERE cm.course_id=psr.course_id) AS course,
                    (SELECT sc.stu_cat FROM student_category sc WHERE sc.stu_cat_id=psr.student_cat_id) AS student_cat
                FROM pre_student_register psr WHERE psr.application_no IS NOT NULL ORDER BY psr.sno DESC
            `;
            const result = await camps.query(sql)
            res.json(result[0]);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching incomplete applications', message: error.message });
        }
    }

    getIncompleteApplication = async (req, res) => {
        try {
            const sql = `
                SELECT psr.sno, psr.student_name, psr.initial, psr.father_name, psr.mother_name, psr.tnea_app_no,
                    (SELECT bm.branch_name FROM branch_master bm WHERE bm.branch_id=psr.branch_id) AS branch,
                    (SELECT cm.course_code FROM course_master cm WHERE cm.course_id=psr.course_id) AS course,
                    (SELECT sc.stu_cat FROM student_category sc WHERE sc.stu_cat_id=psr.student_cat_id) AS student_cat
                FROM pre_student_register psr WHERE psr.application_no IS NULL ORDER BY psr.sno DESC
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
            const sql = `SELECT application_id, name, branch, community, gender, email, mobile, degree_level FROM registration_user_details`;
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
                    const requiredFields = ['application_id', 'name', 'branch', 'community', 'gender', 'email', 'mobile', 'degree_level'];
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
        let fields = {
            batch_id: '',
            acad_yr_id: '',
            branch_id: '',
            course_id: '',
            dept_id: '',
            branch_type: '',
            degree_level: '',
            year_of_admission: '',
            year_of_completion: '',
            regulation_id: '',
            university_id: '5',
            student_cat_id: '',
            year_of_study: '',
            sem_of_study: '',
            section: 'A',
        }

        try {
            fields.branch_id = req.body.branch_id
            fields.branch_type = fields.branch_id
            fields.student_cat_id = req.body.student_cat_id
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

            if (fields.year_of_completion === '') {
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
                const sql = `
                    INSERT INTO pre_student_register (
                    ${Object.keys(fields).join(', ')}
                    )
                    VALUES(
                    '${Object.values(fields).join("', '")}'
                    )
                `
                const result = await camps.query(sql)
                const application_no = result[0].insertId
                res.send({ application_no: application_no })
            } catch (error) {
                res.status(500).send({ error: 'Error inserting data into student_register', message: error.message });
            }
        } catch (error) {
            res.status(500).send({ error: 'Error fetching data from master tables', message: error.message });
        }

    }

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