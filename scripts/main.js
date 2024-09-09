document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const addStudentButton = document.getElementById('addStudent');
    const studentForms = document.getElementById('studentForms');
    const themeToggle = document.getElementById('themeToggle');

    let applicationCount = 0;
    const maxApplications = 5;
    const rateLimitDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    addStudentButton.addEventListener('click', addStudentForm);
    form.addEventListener('submit', handleSubmit);
    themeToggle.addEventListener('click', toggleTheme);

    function addStudentForm() {
        const newStudentForm = document.querySelector('.student-form').cloneNode(true);
        newStudentForm.querySelectorAll('input, select').forEach(input => {
            input.value = '';
            input.name = input.name + Date.now();
        });
        studentForms.appendChild(newStudentForm);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (applicationCount >= maxApplications) {
            alert('You have reached the maximum number of applications allowed within the time limit.');
            return;
        }

        const formData = new FormData(form);

        try {
            const response = await fetch('https://formspree.io/f/your-form-id', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                applicationCount++;
                setTimeout(() => applicationCount--, rateLimitDuration);
                alert('Application submitted successfully!');
                form.reset();
                // Note: QR code generation is removed as we don't have an application ID
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`An error occurred while submitting the application: ${error.message}`);
        }
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
