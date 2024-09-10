// Light/Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Registration Form Submission
document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let registrationData = {
        studentName: document.getElementById('student-name').value,
        parentName: document.getElementById('parent-name').value,
        phoneNumber: document.getElementById('phone-number').value,
        grade: document.getElementById('grade').value,
        class: document.getElementById('class').value,
        gender: document.getElementById('gender').value,
        sibling: document.getElementById('has-siblings').checked ? {
            siblingName: document.getElementById('sibling-name').value,
            siblingGrade: document.getElementById('sibling-grade').value,
            siblingClass: document.getElementById('sibling-class').value
        } : null
    };

    // Save to JSON (simulated here, replace with actual method for file handling)
    console.log('Registration Saved:', registrationData);
    alert('Registration submitted!');
});

// Display Pending Registrations
function displayPendingRegistrations() {
    // Fetch from JSON (for simulation purposes, we use an array)
    const pendingRegistrations = [
        { id: 1, studentName: 'John Doe', parentName: 'Jane Doe', phoneNumber: '123-456' },
        { id: 2, studentName: 'Alice Smith', parentName: 'Robert Smith', phoneNumber: '789-012' }
    ];

    const pendingList = document.getElementById('pending-list');
    pendingList.innerHTML = ''; // Clear existing entries

    pendingRegistrations.forEach(reg => {
        let regBox = document.createElement('div');
        regBox.className = 'pending-box';
        regBox.innerHTML = `
            <h3>#${reg.id} - ${reg.studentName}</h3>
            <p>Parent: ${reg.parentName}</p>
            <p>Phone: ${reg.phoneNumber}</p>
        `;
        pendingList.appendChild(regBox);
    });
}

// Toggle Sibling Form
document.getElementById('has-siblings').addEventListener('change', function() {
    const siblingSection = document.getElementById('sibling-section');
    siblingSection.style.display = this.checked ? 'block' : 'none';
});

// Admin Login
document.getElementById('login-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        alert('Login successful');
        document.getElementById('login-modal').style.display = 'none';
    } else {
        alert('Invalid credentials');
    }
});
