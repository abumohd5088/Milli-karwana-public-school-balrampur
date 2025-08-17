// === GLOBAL DATA ===
let db = {
    homework: JSON.parse(localStorage.getItem('homework')) || {},
    notes: JSON.parse(localStorage.getItem('notes')) || {},
    notices: JSON.parse(localStorage.getItem('notices')) || [],
    timetable: JSON.parse(localStorage.getItem('timetable')) || {},
    results: JSON.parse(localStorage.getItem('results')) || {}
};

// === UTILITY FUNCTIONS ===
function saveDB() {
    localStorage.setItem('homework', JSON.stringify(db.homework));
    localStorage.setItem('notes', JSON.stringify(db.notes));
    localStorage.setItem('notices', JSON.stringify(db.notices));
    localStorage.setItem('timetable', JSON.stringify(db.timetable));
    localStorage.setItem('results', JSON.stringify(db.results));
}

function getCurrentClass() {
    return sessionStorage.getItem('studentClass') || '1';
}

function isAdmin() {
    return sessionStorage.getItem('isAdmin') === 'true';
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function() {
    // Set current class
    const classElements = document.querySelectorAll('#currentClass, #hwClass, #notesClass');
    classElements.forEach(el => el.textContent = getCurrentClass());
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('#dateSelect, #hwDueDate');
    dateInputs.forEach(input => input.value = today);
    
    // Load data based on page
    loadPageData();
    
    // Show admin controls if admin
    if (isAdmin()) {
        showAdminControls();
    }
    
    // Setup admin triggers
    setupAdminTriggers();
});

// === LOAD PAGE DATA ===
function loadPageData() {
    const currentClass = getCurrentClass();
    
    // Dashboard badges
    if (window.location.pathname.includes('class.html')) {
        updateBadges(currentClass);
    }
    
    // Homework
    if (window.location.pathname.includes('homework.html')) {
        loadHomework(currentClass);
    }
    
    // Notes
    if (window.location.pathname.includes('notes.html')) {
        loadNotes(currentClass);
        setupTabs();
    }
    
    // Timetable
    if (window.location.pathname.includes('timetable.html')) {
        loadTimetable(currentClass);
    }
    
    // Results
    if (window.location.pathname.includes('results.html')) {
        loadResults(currentClass);
    }
}

// === DASHBOARD ===
function updateBadges(currentClass) {
    const today = new Date().toISOString().split('T')[0];
    
    // Homework count
    const hwCount = (db.homework[currentClass]?.[today] || []).length;
    document.getElementById('hwCount').textContent = hwCount;
    
    // Notes count
    const noteCount = Object.keys(db.notes[currentClass] || {}).length;
    document.getElementById('noteCount').textContent = noteCount;
    
    // Notice count
    document.getElementById('noticeCount').textContent = db.notices.length;
}

// === CLASS SELECTION ===
if (window.location.pathname.includes('dashboard.html')) {
    document.querySelectorAll('.class-card').forEach(card => {
        card.addEventListener('click', () => {
            const classNum = card.dataset.class;
            sessionStorage.setItem('currentClass', classNum);
            window.location.href = 'class.html';
        });
    });
}

// === HOMEWORK ===
function loadHomework(currentClass) {
    const date = document.getElementById('dateSelect')?.value || new Date().toISOString().split('T')[0];
    const subject = document.getElementById('subjectFilter')?.value || 'all';
    
    const homeworkList = document.getElementById('homeworkList');
    if (!homeworkList) return;
    
    const classHomework = db.homework[currentClass]?.[date] || [];
    let filtered = classHomework;
    
    if (subject !== 'all') {
        filtered = classHomework.filter(hw => hw.subject === subject);
    }
    
    if (filtered.length === 0) {
        homeworkList.innerHTML = `
            <div class="no-homework">
                <i class="fas fa-smile" style="font-size: 3rem; color: #cbd5e1;"></i>
                <p>No homework assigned! 🎉</p>
            </div>
        `;
        return;
    }
    
    homeworkList.innerHTML = filtered.map(hw => `
        <div class="homework-card">
            <div class="homework-header">
                <h3>${hw.subject}</h3>
                ${isAdmin() ? `<button onclick="deleteHomework('${date}', '${hw.id}')" class="btn-delete">
                    <i class="fas fa-trash"></i>
                </button>` : ''}
            </div>
            <p>${hw.description}</p>
            <small>Due: ${new Date(hw.dueDate).toLocaleDateString()}</small>
        </div>
    `).join('');
}

// === NOTES ===
function loadNotes(currentClass) {
    const subject = document.querySelector('.tab-btn.active')?.dataset.subject || 'Math';
    
    const notesList = document.getElementById('notesList');
    if (!notesList) return;
    
    const classNotes = db.notes[currentClass]?.[subject] || [];
    
    if (classNotes.length === 0) {
        notesList.innerHTML = `
            <div class="no-notes">
                <i class="fas fa-book-open" style="font-size: 3rem; color: #cbd5e1;"></i>
                <p>No notes available yet</p>
            </div>
        `;
        return;
    }
    
    notesList.innerHTML = classNotes.map(note => `
        <div class="note-card">
            <div class="note-header">
                <h3>${note.title}</h3>
                ${isAdmin() ? `<button onclick="deleteNote('${subject}', '${note.id}')" class="btn-delete">
                    <i class="fas fa-trash"></i>
                </button>` : ''}
            </div>
            <p>${note.content}</p>
            <small>${new Date(note.dateAdded).toLocaleDateString()}</small>
        </div>
    `).join('');
}

// === TIMETABLE ===
function loadTimetable(currentClass) {
    const timetable = db.timetable[currentClass] || [
        { time: "9:00-10:00", subject: "Math" },
        { time: "10:00-11:00", subject: "English" },
        { time: "11:00-11:30", subject: "Break" },
        { time: "11:30-12:30", subject: "Science" },
        { time: "12:30-1:30", subject: "Hindi" },
        { time: "1:30-2:00", subject: "Lunch" },
        { time: "2:00-3:00", subject: "Social Studies" }
    ];
    
    const timetableDiv = document.querySelector('.timetable');
    if (!timetableDiv) return;
    
    timetableDiv.innerHTML = `
        <div class="timetable-header">
            <h3>Class ${currentClass} Timetable</h3>
        </div>
        ${timetable.map(item => `
            <div class="timetable-row">
                <div class="timetable-time">${item.time}</div>
                <div class="timetable-subject">${item.subject}</div>
            </div>
        `).join('')}
    `;
}

// === ADMIN FUNCTIONS ===
function showAdminControls() {
    // Show admin forms
    const adminForms = document.querySelectorAll('.admin-form');
    adminForms.forEach(form => form.style.display = 'block');
    
    // Add edit buttons
    document.body.classList.add('admin-mode');
}

function setupAdminTriggers() {
    if (!isAdmin()) return;
    
    // Add floating add button
    const addBtn = document.createElement('button');
    addBtn.innerHTML = '<i class="fas fa-plus"></i>';
    addBtn.className = 'floating-add-btn';
    addBtn.onclick = showAddForm;
    document.body.appendChild(addBtn);
    
    // Add CSS for floating button
    const style = document.createElement('style');
    style.textContent = `
        .floating-add-btn {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
        }
        
        .admin-mode .homework-card,
        .admin-mode .note-card {
            position: relative;
        }
        
        .btn-delete {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: var(--error);
            color: white;
            border: none;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}

function showAddForm() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('homework.html')) {
        document.getElementById('addHomeworkForm').style.display = 'block';
    } else if (currentPath.includes('notes.html')) {
        document.getElementById('addNotesForm').style.display = 'block';
    }
}

function hideAdminForm() {
    document.querySelectorAll('.admin-form').forEach(form => form.style.display = 'none');
}

// === ADMIN CRUD OPERATIONS ===
function saveHomework() {
    const currentClass = getCurrentClass();
    const date = document.getElementById('dateSelect').value;
    const subject = document.getElementById('hwSubject').value;
    const description = document.getElementById('hwDescription').value;
    const dueDate = document.getElementById('hwDueDate').value;
    
    if (!db.homework[currentClass]) db.homework[currentClass] = {};
    if (!db.homework[currentClass][date]) db.homework[currentClass][date] = [];
    
    db.homework[currentClass][date].push({
        id: Date.now().toString(),
        subject,
        description,
        dueDate,
        dateAdded: new Date().toISOString()
    });
    
    saveDB();
    loadHomework(currentClass);
    hideAdminForm();
}

function saveNotes() {
    const currentClass = getCurrentClass();
    const subject = document.getElementById('noteSubject').value;
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    
    if (!db.notes[currentClass]) db.notes[currentClass] = {};
    if (!db.notes[currentClass][subject]) db.notes[currentClass][subject] = [];
    
    db.notes[currentClass][subject].push({
        id: Date.now().toString(),
        title,
        content,
        dateAdded: new Date().toISOString()
    });
    
    saveDB();
    loadNotes(currentClass);
    hideAdminForm();
}

function deleteHomework(date, id) {
    const currentClass = getCurrentClass();
    db.homework[currentClass][date] = db.homework[currentClass][date].filter(hw => hw.id !== id);
    if (db.homework[currentClass][date].length === 0) {
        delete db.homework[currentClass][date];
    }
    saveDB();
    loadHomework(currentClass);
}

function deleteNote(subject, id) {
    const currentClass = getCurrentClass();
    db.notes[currentClass][subject] = db.notes[currentClass][subject].filter(note => note.id !== id);
    if (db.notes[currentClass][subject].length === 0) {
        delete db.notes[currentClass][subject];
    }
    saveDB();
    loadNotes(currentClass);
}

// === TAB SYSTEM ===
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadNotes(getCurrentClass());
        });
    });
}

// === DASHBOARD ===
if (window.location.pathname.includes('class.html')) {
    const currentClass = getCurrentClass();
    updateBadges(currentClass);
}
