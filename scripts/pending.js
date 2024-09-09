document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLogin');
    const applicationList = document.getElementById('applicationList');
    const applications = document.getElementById('applications');
    const searchInput = document.getElementById('searchInput');
    const themeToggle = document.getElementById('themeToggle');

    loginForm.addEventListener('submit', handleLogin);
    searchInput.addEventListener('input', handleSearch);
    themeToggle.addEventListener('click', toggleTheme);

    async function handleLogin(event) {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const loginData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/admin-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                document.getElementById('loginForm').style.display = 'none';
                applicationList.style.display = 'block';
                loadApplications();
            } else {
                alert('Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login. Please try again later.');
        }
    }

    async function loadApplications() {
        try {
            const response = await fetch('/api/pending-applications');
            const pendingApplications = await response.json();
            displayApplications(pendingApplications);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while loading applications. Please try again later.');
        }
    }

    function displayApplications(pendingApplications) {
        applications.innerHTML = '';
        pendingApplications.forEach(app => {
            const appElement = document.createElement('div');
            appElement.className = 'application-box';
            appElement.innerHTML = `
                <h3>${app.studentName} - ${app.parentName}</h3>
                <p>Phone: ${app.phoneNumber}</p>
                <p>Email: ${app.email}</p>
                <p>Class: ${app.class}</p>
                <p>Status: ${app.status}</p>
                <button onclick="approveApplication('${app.id}')">Approve</button>
                <button onclick="denyApplication('${app.id}')">Deny</button>
                <button onclick="editApplication('${app.id}')">Edit</button>
                <input type="checkbox" id="paid-${app.id}" ${app.paid ? 'checked' : ''}>
                <label for="paid-${app.id}">Paid</label>
                <input type="number" id="amount-${app.id}" value="${app.paidAmount || 0}" placeholder="Amount Paid">
                <textarea id="notes-${app.id}" placeholder="Add notes...">${app.notes || ''}</textarea>
                <button onclick="saveNotes('${app.id}')">Save Notes</button>
            `;
            applications.appendChild(appElement);
        });
    }

    async function approveApplication(id) {
        await updateApplicationStatus(id, 'approved');
    }

    async function denyApplication(id) {
        await updateApplicationStatus(id, 'denied');
    }

    async function updateApplicationStatus(id, status) {
        try {
            const response = await fetch(`/api/update-application-status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                loadApplications();
            } else {
                throw new Error('Failed to update application status');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating the application status. Please try again later.');
        }
    }

    async function editApplication(id) {
        // Implement edit functionality
        alert('Edit functionality to be implemented');
    }

    async function saveNotes(id) {
        const notes = document.getElementById(`notes-${id}`).value;
        const paid = document.getElementById(`paid-${id}`).checked;
        const paidAmount = document.getElementById(`amount-${id}`).value;

        try {
            const response = await fetch(`/api/update-application/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notes, paid, paidAmount }),
            });

            if (response.ok) {
                alert('Notes and payment status updated successfully');
            } else {
                throw new Error('Failed to update notes and payment status');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving notes and payment status. Please try again later.');
        }
    }

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const appBoxes = applications.querySelectorAll('.application-box');

        appBoxes.forEach(box => {
            const text = box.textContent.toLowerCase();
            box.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-mode');
    }
});