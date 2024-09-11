// Global registration array to simulate database
let registrations = JSON.parse(localStorage.getItem('registrations')) || [];

// Form submission logic
function generateRandomID() {
  return Math.random().toString(36).substring(2, 7).toUpperCase(); // Generate 5-character random ID
}

// On form submission
document.getElementById('registrationForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const studentName = document.getElementById('studentName').value;
  const parentName = document.getElementById('parentName').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const grade = document.getElementById('grade').value;
  const studentClass = document.getElementById('class').value;
  const gender = document.getElementById('gender').value;
  const hasSibling = document.getElementById('hasSibling').checked;
  const siblingName = document.getElementById('siblingName').value || null;

  const registration = {
    id: Date.now(),
    applicationId: generateRandomID(),
    studentName,
    parentName,
    phoneNumber,
    grade,
    studentClass,
    gender,
    siblingName,
    status: 'pending',
  };

  registrations.push(registration);
  localStorage.setItem('registrations', JSON.stringify(registrations));

  alert("Registration submitted successfully!");
  window.location.href = 'pending.html';
});


// Show pending registrations
function showPendingRegistrations() {
  const pendingRegistrations = registrations.filter(reg => reg.status === 'pending');
  const pendingList = document.getElementById('pendingRegistrations');
  pendingList.innerHTML = '';

  pendingRegistrations.forEach(reg => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div>
        <h3>${reg.studentName} - ${reg.id}</h3>
        <p>Parent: ${reg.parentName}</p>
        <p>Phone: ${reg.phoneNumber}</p>
        <button onclick="approveRegistration(${reg.id})">Approve</button>
        <button onclick="denyRegistration(${reg.id})">Deny</button>
      </div>
    `;
    pendingList.appendChild(div);
  });
}

// Show approved registrations
function showApprovedRegistrations() {
  const approvedRegistrations = registrations.filter(reg => reg.status === 'approved');
  const approvedList = document.getElementById('approvedRegistrations');
  approvedList.innerHTML = '';

  approvedRegistrations.forEach(reg => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div>
        <h3>${reg.studentName} - ${reg.id}</h3>
        <p>Parent: ${reg.parentName}</p>
        <p>Phone: ${reg.phoneNumber}</p>
      </div>
    `;
    approvedList.appendChild(div);
  });
}

// Approve registration
function approveRegistration(id) {
  registrations = registrations.map(reg => {
    if (reg.id === id) reg.status = 'approved';
    return reg;
  });
  localStorage.setItem('registrations', JSON.stringify(registrations));
  showPendingRegistrations();
}

// Deny registration
function denyRegistration(id) {
  registrations = registrations.map(reg => {
    if (reg.id === id) reg.status = 'denied';
    return reg;
  });
  localStorage.setItem('registrations', JSON.stringify(registrations));
  showPendingRegistrations();
}

// Load the appropriate page content
if (window.location.pathname.includes('pending.html')) {
  showPendingRegistrations();
} else if (window.location.pathname.includes('approved.html')) {
  showApprovedRegistrations();
}
