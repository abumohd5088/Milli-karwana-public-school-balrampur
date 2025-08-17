// === DASHBOARD LOGIC ===
let currentUser = null;

// Show loading
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}
function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Load user
function loadUser() {
    const saved = localStorage.getItem('studentData');
    if (!saved) {
        alert("No user data found. Redirecting...");
        window.location.href = "index.html";
        return;
    }
    currentUser = JSON.parse(saved);
    document.getElementById('welcomeText').textContent = `Welcome, ${currentUser.name}!`;
    document.getElementById('classNumber').textContent = getOrdinal(currentUser.class) + " Grade";
    document.getElementById('classText').innerHTML = `Class <span>${currentUser.class}</span>`;
}

// Add ordinal (1 → 1st, 2 → 2nd)
function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Tab Switching
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Triple-click to show Admin FAB
let clicks = 0;
document.body.addEventListener('click', () => {
    clicks++;
    if (clicks === 3) {
        document.getElementById('adminFab').style.display = 'flex';
        setTimeout(() => document.getElementById('adminFab').style.display = 'none', 3000);
        clicks = 0;
    }
    setTimeout(() => { clicks = 0; }, 500);
});

// Logout
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('studentData');
        window.location.href = "index.html";
    }
}

// Refresh Homework
function refreshHomework() {
    showLoading();
    setTimeout(() => {
        loadHomework();
        hideLoading();
    }, 600);
}

// Refresh Notes
function refreshNotes() {
    showLoading();
    setTimeout(() => {
        loadNotes();
        hideLoading();
    }, 600);
}

// Load Homework from localStorage (set in admin.html)
function loadHomework() {
    const hw = JSON.parse(localStorage.getItem('homework') || '[]')
        .filter(h => h.class == currentUser.class || h.class === "All");
    const grid = document.getElementById('homeworkGrid');
    grid.innerHTML = hw.length ? '' : '<div class="empty-state">No homework assigned.</div>';
    hw.forEach(h => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.innerHTML = `
            <div class="card-header">
                <span class="subject-tag">${h.subject}</span>
                <span class="due-date">📅 ${h.due}</span>
            </div>
            <h3>${h.title}</h3>
            <p>${h.desc.substring(0, 100)}${h.desc.length > 100 ? '...' : ''}</p>
        `;
        grid.appendChild(card);
    });
}

// Load Notes
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]')
        .filter(n => n.class == currentUser.class || n.class === "All");
    const grid = document.getElementById('notesGrid');
    grid.innerHTML = notes.length ? '' : '<div class="empty-state">No notes available.</div>';
    notes.forEach(n => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.innerHTML = `
            <div class="card-header">
                <span class="subject-tag">${n.subject}</span>
            </div>
            <h3>${n.title}</h3>
            <p>${n.content.substring(0, 120)}...</p>
        `;
        grid.appendChild(card);
    });
}

// Load Timetable
function loadTimetable() {
    const tt = JSON.parse(localStorage.getItem('timetables') || '{}')[currentUser.class] || [];
    const container = document.getElementById('timetableDisplay');
    if (tt.length === 0) {
        container.innerHTML = '<p class="empty-state">No timetable set.</p>';
        return;
    }
    container.innerHTML = '<table>';
    tt.forEach((subj, i) => {
        if (subj) container.innerHTML += `<tr><td>Period ${i+1}</td><td>${subj}</td></tr>`;
    });
    container.innerHTML += '</table>';
}

// Load Results
function loadResults() {
    const results = JSON.parse(localStorage.getItem('results') || '{}')[currentUser.class] || {};
    const container = document.getElementById('resultsDisplay');
    if (Object.keys(results).length === 0) {
        container.innerHTML = '<p class="empty-state">Results not published yet.</p>';
        return;
    }
    container.innerHTML = '<table>';
    for (const [sub, marks] of Object.entries(results)) {
        const grade = marks >= 90 ? 'A+' : marks >= 80 ? 'A' : marks >= 70 ? 'B' : marks >= 60 ? 'C' : 'F';
        container.innerHTML += `<tr><td>${sub}</td><td>${marks}/100</td><td>Grade: ${grade}</td></tr>`;
    }
    container.innerHTML += '</table>';
}

// Modals
function showFAQ() { document.getElementById('faqModal').style.display = 'flex'; }
function showPrivacy() { document.getElementById('privacyModal').style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// Initialize
window.onload = () => {
    showLoading();
    setTimeout(() => {
        loadUser();
        loadHomework();
        loadNotes();
        loadTimetable();
        loadResults();
        hideLoading();
    }, 1000);
};
