// Passwords
const PASSWORDS = {
    student: 'class123',
    admin: 'Abutalha123'
};

// Secret admin trigger
let adminKeySequence = '';
document.addEventListener('keydown', (e) => {
    adminKeySequence += e.key;
    if (adminKeySequence.includes(PASSWORDS.admin)) {
        sessionStorage.setItem('isAdmin', 'true');
        showAdminControls();
        adminKeySequence = '';
    }
});

// Login handler
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const studentClass = document.getElementById('classSelect').value;
    const password = document.getElementById('password').value;
    
    if (password === PASSWORDS.student || password === PASSWORDS.admin) {
        sessionStorage.setItem('studentClass', studentClass);
        sessionStorage.setItem('isAdmin', password === PASSWORDS.admin ? 'true' : 'false');
        sessionStorage.setItem('loggedIn', 'true');
        
        window.location.href = 'dashboard.html';
    } else {
        showError('Invalid password');
    }
});

function showError(message) {
    const errorDiv = document.getElementById('errorMsg');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 3000);
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'index.html';
});

// Check authentication
if (!window.location.pathname.includes('index.html') && !sessionStorage.getItem('loggedIn')) {
    window.location.href = 'index.html';
}
