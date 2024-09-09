document.addEventListener('DOMContentLoaded', () => {
    const studentList = document.getElementById('studentList');
    const searchInput = document.getElementById('searchInput');
    const paidFilter = document.getElementById('paidFilter');
    const themeToggle = document.getElementById('themeToggle');

    searchInput.addEventListener('input', handleSearch);
    paidFilter.addEventListener('change', handleFilter);
    themeToggle.addEventListener('click', toggleTheme);

    loadApprovedStudents();

    async function loadApprovedStudents() {
        try {
            const response = await fetch('/api/approved-students');
            const approvedStudents = await response.json();
            displayStudents(approvedStudents);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while loading approved students. Please try again later.');
        }
    }

    function displayStudents(students) {
        studentList.innerHTML = '';
        students.forEach(student => {
            const studentElement = document.createElement('div');
            studentElement.className = 'student-box';
            studentElement.innerHTML = `
                <h3>${student.studentName}</h3>
                <p>Parent: ${student.parentName}</p>
                <p>Phone: ${student.phoneNumber}</p>
                <p>Email: ${student.email}</p>
                <p>Class: ${student.class}</p>
                <p>Payment Status: ${student.paid ? 'Paid' : 'Unpaid'}</p>
                <p>Amount Paid: $${student.paidAmount || 0}</p>
                <details>
                    <summary>Notes</summary>
                    <p>${student.notes || 'No notes available'}</p>
                </details>
            `;
            studentList.appendChild(studentElement);
        });
    }

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const studentBoxes = studentList.querySelectorAll('.student-box');

        studentBoxes.forEach(box => {
            const text = box.textContent.toLowerCase();
            box.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    }

    function handleFilter() {
        const filterValue = paidFilter.value;
        const studentBoxes = studentList.querySelectorAll('.student-box');

        studentBoxes.forEach(box => {
            const paymentStatus = box.querySelector('p:nth-child(6)').textContent;
            if (filterValue === 'all' || 
                (filterValue === 'paid' && paymentStatus.includes('Paid')) || 
                (filterValue === 'unpaid' && paymentStatus.includes('Unpaid'))) {
                box.style.display = 'block';
            } else {
                box.style.display = 'none';
            }
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