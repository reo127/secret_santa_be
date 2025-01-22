const xlsx = require('xlsx');

/**
 * Assigns Secret Santa pairs while ensuring no one gets themselves
 * and trying to avoid assigning to people with the same name base
 * @param {Array} employeeData Array of employee objects with name and email
 * @returns {Array} Array of employee objects with assigned Secret Santa children
 */
function assignSecretSanta(employeeData) {
    const employees = JSON.parse(JSON.stringify(employeeData));
    const getBaseName = (name) => name.split('.')[0];

    const getValidRecipients = (santa, remainingRecipients) => {
        return remainingRecipients.filter(recipient => {
            if (recipient.Employee_EmailID === santa.Employee_EmailID) return false;
            
            const santaBaseName = getBaseName(santa.Employee_EmailID);
            const recipientBaseName = getBaseName(recipient.Employee_EmailID);
            
            if (remainingRecipients.length > 1 && santaBaseName === recipientBaseName) {
                return false;
            }
            return true;
        });
    };

    const tryAssignments = () => {
        const assignments = [];
        const remainingRecipients = [...employees];
        
        for (const santa of employees) {
            const validRecipients = getValidRecipients(santa, remainingRecipients);
            
            if (validRecipients.length === 0) {
                return null;
            }
            
            const recipientIndex = Math.floor(Math.random() * validRecipients.length);
            const recipient = validRecipients[recipientIndex];
            
            const recipientIndexInRemaining = remainingRecipients.findIndex(
                r => r.Employee_EmailID === recipient.Employee_EmailID
            );
            remainingRecipients.splice(recipientIndexInRemaining, 1);
            
            assignments.push({
                ...santa,
                Secret_Child_Name: recipient.Employee_Name,
                Secret_Child_EmailID: recipient.Employee_EmailID
            });
        }
        
        return assignments;
    };

    let attempts = 0;
    let assignments = null;
    const MAX_ATTEMPTS = 100;

    while (!assignments && attempts < MAX_ATTEMPTS) {
        assignments = tryAssignments();
        attempts++;
    }

    if (!assignments) {
        throw new Error("Could not find valid Secret Santa assignments after maximum attempts");
    }

    return assignments;
}

/**
 * checks if new generated assignments match last years
 * @param {Array, Array} employeeData, lastYearData Array of employee objects with name and email
 * @returns {Boolean} true if assignments match
 */
function hasMatchingAssignments(lastYearList, newList) {
    if (!lastYearList?.length || !newList?.length) {
        return false;
    }

    const lastYearMap = new Map();
    lastYearList.forEach(assignment => {
        lastYearMap.set(assignment.Employee_EmailID, assignment.Secret_Child_EmailID);
    });

    for (const newAssignment of newList) {
        const lastYearRecipient = lastYearMap.get(newAssignment.Employee_EmailID);
        if (lastYearRecipient === newAssignment.Secret_Child_EmailID) {
            return true;
        }
    }
    return false;
}

/**
 * converts assignments from json to xlsx
 * @param {Json, String} newGeneratedAssignments, outputPath Array of employee objects with name and email
 * @returns {Boolean} true if assignments match
 */
async function convertToXLSX(assignments, outputPath) {
    try {
        // Format the data for Excel
        const formattedData = assignments.map(assignment => ({
            'Santa Name': assignment.Employee_Name,
            'Santa Email': assignment.Employee_EmailID,
            'Secret Child Name': assignment.Secret_Child_Name,
            'Secret Child Email': assignment.Secret_Child_EmailID
        }));

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(formattedData, {
            header: ['Santa Name', 'Santa Email', 'Secret Child Name', 'Secret Child Email']
        });

        // Add column widths for better readability
        const colWidths = [
            { wch: 20 }, 
            { wch: 25 }, 
            { wch: 20 }, 
            { wch: 25 }  
        ];
        worksheet['!cols'] = colWidths;
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Secret Santa Assignments');
        xlsx.writeFile(workbook, outputPath);

        return {
            success: true,
            message: `XLSX file successfully created at ${outputPath}`
        };
    } catch (error) {
        throw new Error(`Failed to convert to XLSX: ${error.message}`);
    }
}


module.exports = { assignSecretSanta, hasMatchingAssignments, convertToXLSX };