const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const { assignSecretSanta, hasMatchingAssignments } = require('../utils/assignSecretSanta');

const secretSantaResult = async (req, res) => {
    try {
        const employeeWorkbook = xlsx.readFile(req.files.employeeList[0].path);
        const lastYearWorkbook = xlsx.readFile(req.files.lastYearList[0].path);

        const employeeSheet = employeeWorkbook.Sheets[employeeWorkbook.SheetNames[0]];
        const lastYearSheet = lastYearWorkbook.Sheets[lastYearWorkbook.SheetNames[0]];

        const employeeData = xlsx.utils.sheet_to_json(employeeSheet);
        const lastYearData = xlsx.utils.sheet_to_json(lastYearSheet);

        let newAssignments;
        let hasMatches = true;
        let attempts = 0;
        const MAX_ATTEMPTS = 100;

        while (hasMatches && attempts < MAX_ATTEMPTS) {
            newAssignments = assignSecretSanta(employeeData);
            hasMatches = hasMatchingAssignments(lastYearData, newAssignments);
            attempts++;
        }

        if (hasMatches) {
            throw new Error('Could not generate unique assignments after maximum attempts');
        }

        const workbook = xlsx.utils.book_new();
        const formattedData = newAssignments.map(assignment => ({
            'Santa Name': assignment.Employee_Name,
            'Santa Email': assignment.Employee_EmailID,
            'Secret Child Name': assignment.Secret_Child_Name,
            'Secret Child Email': assignment.Secret_Child_EmailID
        }));

        const worksheet = xlsx.utils.json_to_sheet(formattedData, {
            header: ['Santa Name', 'Santa Email', 'Secret Child Name', 'Secret Child Email']
        });

        // Set column widths
        worksheet['!cols'] = [
            { wch: 20 },
            { wch: 25 },
            { wch: 20 },
            { wch: 25 },
        ];

        xlsx.utils.book_append_sheet(workbook, worksheet, 'Secret Santa Assignments');
        const tempFilePath = path.join(__dirname, '../temp', `secret_santa_${Date.now()}.xlsx`);

        const tempDir = path.dirname(tempFilePath);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        xlsx.writeFile(workbook, tempFilePath);

        fs.unlinkSync(req.files.employeeList[0].path);
        fs.unlinkSync(req.files.lastYearList[0].path);

        res.download(tempFilePath, 'secret_santa_assignments.xlsx', (err) => {
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            if (err) {
                console.error('Error sending file:', err);
            }
        });

    } catch (error) {
        console.error('Error processing files:', error);
        if (req.files?.employeeList?.[0]?.path && fs.existsSync(req.files.employeeList[0].path)) {
            fs.unlinkSync(req.files.employeeList[0].path);
        }
        if (req.files?.lastYearList?.[0]?.path && fs.existsSync(req.files.lastYearList[0].path)) {
            fs.unlinkSync(req.files.lastYearList[0].path);
        }

        res.status(500).json({
            error: 'Error processing files',
            message: error.message,
        });
    }
};

const hello = (req, res) => {
    res.send('Hello from Secret Santa!');
};

module.exports = { secretSantaResult, hello };
