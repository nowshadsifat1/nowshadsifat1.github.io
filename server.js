const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const APPLICATIONS_FILE = path.join(__dirname, 'data', 'applications.json');
const APPROVED_STUDENTS_FILE = path.join(__dirname, 'data', 'approved_students.json');
const ADMIN_CREDENTIALS_FILE = path.join(__dirname, 'data', 'admin_credentials.json');

async function readJSONFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, return an empty array
            return [];
        }
        console.error(`Error reading file ${filePath}:`, error);
        throw error;
    }
}

async function writeJSONFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
        throw error;
    }
}

app.post('/api/submit-application', async (req, res) => {
    try {
        const applications = await readJSONFile(APPLICATIONS_FILE);
        const newApplication = {
            id: Date.now().toString(),
            ...req.body,
            status: 'pending',
            submissionDate: new Date().toISOString()
        };
        applications.push(newApplication);
        await writeJSONFile(APPLICATIONS_FILE, applications);
        res.status(201).json({ applicationId: newApplication.id });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ error: 'Failed to submit application' });
    }
});


app.post('/api/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminCredentials = await readJSONFile(ADMIN_CREDENTIALS_FILE);
        const admin = adminCredentials.find(cred => cred.email === email);
        if (admin && await bcrypt.compare(password, admin.passwordHash)) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/pending-applications', async (req, res) => {
    try {
        const applications = await readJSONFile(APPLICATIONS_FILE);
        const pendingApplications = applications.filter(app => app.status === 'pending');
        res.json(pendingApplications);
    } catch (error) {
        console.error('Error fetching pending applications:', error);
        res.status(500).json({ error: 'Failed to fetch pending applications' });
    }
});

app.put('/api/update-application-status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const applications = await readJSONFile(APPLICATIONS_FILE);
        const approvedStudents = await readJSONFile(APPROVED_STUDENTS_FILE);

        const applicationIndex = applications.findIndex(app => app.id === id);
        if (applicationIndex === -1) {
            return res.status(404).json({ error: 'Application not found' });
        }

        applications[applicationIndex].status = status;
        await writeJSONFile(APPLICATIONS_FILE, applications);

        if (status === 'approved') {
            approvedStudents.push(applications[applicationIndex]);
            await writeJSONFile(APPROVED_STUDENTS_FILE, approvedStudents);
        }

        res.json({ message: 'Application status updated successfully' });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ error: 'Failed to update application status' });
    }
});

app.put('/api/update-application/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { notes, paid, paidAmount } = req.body;
        const applications = await readJSONFile(APPLICATIONS_FILE);
        const approvedStudents = await readJSONFile(APPROVED_STUDENTS_FILE);

        const applicationIndex = applications.findIndex(app => app.id === id);
        if (applicationIndex === -1) {
            return res.status(404).json({ error: 'Application not found' });
        }

        applications[applicationIndex].notes = notes;
        applications[applicationIndex].paid = paid;
        applications[applicationIndex].paidAmount = paidAmount;

        await writeJSONFile(APPLICATIONS_FILE, applications);

        const approvedStudentIndex = approvedStudents.findIndex(student => student.id === id);
        if (approvedStudentIndex !== -1) {
            approvedStudents[approvedStudentIndex] = applications[applicationIndex];
            await writeJSONFile(APPROVED_STUDENTS_FILE, approvedStudents);
        }

        res.json({ message: 'Application updated successfully' });
    } catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({ error: 'Failed to update application' });
    }
});

app.get('/api/approved-students', async (req, res) => {
    try {
        const approvedStudents = await readJSONFile(APPROVED_STUDENTS_FILE);
        res.json(approvedStudents);
    } catch (error) {
        console.error('Error fetching approved students:', error);
        res.status(500).json({ error: 'Failed to fetch approved students' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
