// === ULTRA HIDDEN ADMIN SYSTEM ===
let adminSequence = '';
let clickCount = 0;
let clickTimer = null;
let isAdminMode = false;

// Triple-click + "Abutalha" trigger
document.addEventListener('click', () => {
    clickCount++;
    
    if (clickTimer) clearTimeout(clickTimer);
    
    clickTimer = setTimeout(() => {
        clickCount = 0;
    }, 1000);
    
    if (clickCount >= 3) {
        document.addEventListener('keydown', adminKeyListener);
        clickTimer = setTimeout(() => {
            document.removeEventListener('keydown', adminKeyListener);
            adminSequence = '';
        }, 3000);
    }
});

function adminKeyListener(e) {
    adminSequence += e.key;
    if (adminSequence.includes('Abutalha')) {
        showAdminLogin();
        adminSequence = '';
        document.removeEventListener('keydown', adminKeyListener);
    }
}

// === DATA STORAGE ===
const db = {
    students: JSON.parse(localStorage.getItem('students')) || {},
    homework: JSON.parse(localStorage.getItem('homework')) || {},
    notes: JSON.parse(localStorage.getItem('notes')) || {},
    timetable: JSON.parse(localStorage.getItem('timetable')) || {},
    results: JSON.parse(localStorage.getItem('results')) || {}
};

// === LOGIN SYSTEM ===
if (window.location.pathname.includes('index.html')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('studentName').value;
        const classNum = document.getElementById('classSelect').value;
        
        if (!name || !classNum) {
            alert('Please enter name and select class');
            return;
        }
        
        localStorage.setItem('studentName', name);
        localStorage.setItem('currentClass', classNum);
        
        window.location.href = 'homework.html';
    });
}

// === DISPLAY USER INFO ===
function updateUserInfo() {
    const name = localStorage.getItem('studentName') || 'Student';
    const classNum = localStorage.getItem('currentClass') || '1';
    
    document.querySelectorAll('#studentNameDisplay').forEach(el => el.textContent = name);
    document.querySelectorAll('#classDisplay').forEach(el => el.textContent = classNum);
}

// === LOAD DATA ===
function loadData() {
    updateUserInfo();
    
    const classNum = localStorage.getItem('currentClass') || '1';
    const name = localStorage.getItem('studentName') || 'Student';
    
    // Initialize student if not exists
    if (!db.students[classNum]) db.students[classNum] = {};
    if (!db.students[classNum][name]) {
        db.students[classNum][name] = {
            created: new Date().toISOString(),
            homework: [],
            notes: []
        };
    }
    
    localStorage.setItem('students', JSON.stringify(db.students));
    
    // Load appropriate data
    const path = window.location.pathname;
    if (path.includes('homework.html')) loadHomework();
    if (path.includes('notes.html')) loadNotes();
    if (path.includes('timetable.html')) loadTimetable();
    if (path.includes('results.html')) loadResults();
}

// === HOMEWORK SYSTEM ===
function loadHomework() {
    const classNum = localStorage.getItem('currentClass');
    const date = document.getElementById('dateFilter')?.value || new Date().toISOString().split('T')[0];
    const subject = document.getElementById('subjectFilter')?.value || 'all';
    
    const homework = db.homework[classNum]?.[date] || [];
    const filtered = subject === 'all' ? homework : homework.filter(hw => hw.subject === subject);
    
    const container = document.getElementById('homeworkList');
    if (!container) return;
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>No Homework Today! 🎉</h3>
                <p>Enjoy your free time</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(hw => `
        <div class="homework-card">
            <div class="card-header">
                <h3>${hw.subject}</h3>
                ${isAdminMode ? `<button class="delete-btn" onclick="deleteHomework('${hw.id}')">
                    <i class="fas fa-trash"></i>
                </button>` : ''}
            </div>
            <p>${hw.description}</p>
            <div class="card-footer">
                <span class="due-date">Due: ${new Date(hw.dueDate).toLocaleDateString()}</span>
                <span class="priority">${hw.priority || 'Normal'}</span>
            </div>
        </div>
    `).join('');
}

// === NOTES SYSTEM ===
function loadNotes() {
    const classNum = localStorage.getItem('currentClass');
    const subject = document.querySelector('.tab-btn.active')?.dataset.subject || 'Math';
    
    const notes = db.notes[classNum]?.[subject] || [];
    const container = document.getElementById('notesList');
    if (!container) return;
    
    if (notes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-sticky-note"></i>
                <h3>No Notes Available</h3>
                <p>Notes will appear here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = notes.map(note => `
        <div class="note-card">
            <div class="card-header">
                <h3>${note.title}</h3>
                ${isAdminMode ? `<button class="delete-btn" onclick="deleteNote('${note.id}')">
                    <i class="fas fa-trash"></i>
                </button>` : ''}
            </div>
            <p>${note.content}</p>
            <small class="date">${new Date(note.dateAdded).toLocaleDateString()}</small>
        </div>
    `).join('');
}

// === TIMETABLE SYSTEM ===
function loadTimetable() {
    const classNum = localStorage.getItem('currentClass');
    const timetable = {
        1: [
            { time: "9:00-9:45", subject: "Math", day: "Mon-Fri" },
            { time: "9:45-10:30", subject: "English", day: "Mon-Fri" },
            { time: "10:30-11:15", subject: "EVS", day: "Mon-Fri" },
            { time: "11:15-11:30", subject: "Break", day: "Mon-Fri" },
            { time: "11:30-12:15", subject: "Hindi", day: "Mon-Fri" },
            { time: "12:15-1:00", subject: "Art", day: "Mon-Wed-Fri" }
        ],
        2: [
            { time: "9:00-9:45", subject: "Math", day: "Mon-Fri" },
            { time: "9:45-10:30", subject: "English", day: "Mon-Fri" },
            { time: "10:30-11:15", subject: "Science", day: "Mon-Fri" },
            { time: "11:15-11:30", subject: "Break", day: "Mon-Fri" },
            { time: "11:30-12:15", subject: "Hindi", day: "Mon-Fri" },
            { time: "12:15-1:00", subject: "Music", day: "Tue-Thu" }
        ],
        // Continue for all classes...
        8: [
            { time: "9:00-9:45", subject: "Math", day: "Mon-Fri" },
            { time: "9:45-10:30", subject: "English", day: "Mon-Fri" },
            { time: "10:30-11:15", subject: "Science", day: "Mon-Fri" },
            { time: "11:15-11:30", subject: "Break", day: "Mon-Fri" },
            { time: "11:30-12:15", subject: "Social Studies", day: "Mon-Fri" },
            { time: "12:15-1:00", subject: "Computer", day: "Mon-Fri" }
        ]
    };
    
    const container = document.getElementById('timetableContent');
    if (!container) return;
    
    const classTimetable = timetable[classNum] || timetable[1];
    container.innerHTML = classTimetable.map(item => `
        <div class="timetable-row">
            <div class="time">${item.time}</div>
            <div class="subject">${item.subject}</div>
            <div class="day">${item.day}</div>
        </div>
    `).join('');
}

// === RESULTS SYSTEM ===
function loadResults() {
    const classNum = localStorage.getItem('currentClass');
    const results = {
        1: [
            { subject: "Math", marks: 95, grade: "A+", percentage: 95 },
            { subject: "English", marks: 92, grade: "A+", percentage: 92 },
            { subject: "EVS", marks: 88, grade: "A", percentage: 88 },
            { subject: "Hindi", marks: 90, grade: "A+", percentage: 90 }
        ],
        // Continue for all classes...
        8: [
            { subject: "Math", marks: 89, grade: "A", percentage: 89 },
            { subject: "English", marks: 91, grade: "A+", percentage: 91 },
            { subject: "Science", marks: 93, grade: "A+", percentage: 93 },
            { subject: "Social Studies", marks: 87, grade: "A", percentage: 87 },
            { subject: "Hindi", marks: 90, grade: "A+", percentage: 90 },
            { subject: "Computer", marks: 94, grade: "A+", percentage: 94 }
        ]
    };
    
    const container = document.getElementById('resultsContent');
    if (!container) return;
    
    const classResults = results[classNum] || results[1];
    container.innerHTML = classResults.map(result => `
        <div class="result-item">
            <div class="subject">${result.subject}</div>
            <div class="marks">${result.marks}/100</div>
            <div class="grade">${result.grade}</div>
        </div>
    `).join('');
}

// === ADMIN CRUD OPERATIONS ===
function showAdminLogin() {
    document.getElementById('adminLogin')?.classList.remove('hidden');
    document.getElementById('adminFab')?.style.display = 'flex';
}

function closeAdmin() {
    document.getElementById('adminLogin')?.classList.add('hidden');
}

function verifyAdmin() {
    const password = document.getElementById('adminPass')?.value;
    if (password === 'Abutalha') {
        isAdminMode = true;
        closeAdmin();
        document.getElementById('adminFab')?.style.display = 'flex';
        alert('🔓 Admin mode activated!');
    } else {
        alert('❌ Invalid password');
    }
}

function toggleAdminForm() {
    document.getElementById('adminForm')?.classList.toggle('hidden');
}

function closeAdminForm() {
    document.getElementById('adminForm')?.classList.add('hidden');
}

function saveHomework() {
    const classNum = localStorage.getItem('currentClass');
    const date = document.getElementById('dateFilter')?.value || new Date().toISOString().split('T')[0];
    const subject = document.getElementById('hwSubject')?.value;
    const description = document.getElementById('hwDescription')?.value;
    const dueDate = document.getElementById('hwDueDate')?.value;
    
    if (!subject || !description || !dueDate) {
        alert('Please fill all fields');
        return;
    }
    
    if (!db.homework[classNum]) db.homework[classNum] = {};
    if (!db.homework[classNum][date]) db.homework[classNum][date] = [];
    
    db.homework[classNum][date].push({
        id: Date.now().toString(),
        subject,
        description,
        dueDate,
        dateAdded: new Date().toISOString()
    });
    
    localStorage.setItem('homework', JSON.stringify(db.homework));
    loadHomework();
    closeAdminForm();
    
    // Clear form
    document.getElementById('hwSubject').value = '';
    document.getElementById('hwDescription').value = '';
}

function saveNotes() {
    const classNum = localStorage.getItem('currentClass');
    const subject = document.querySelector('.tab-btn.active')?.dataset.subject || 'Math';
    const title = document.getElementById('noteTitle')?.value;
    const content = document.getElementById('noteContent')?.value;
    
    if (!title || !content) {
        alert('Please fill all fields');
        return;
    }
    
    if (!db.notes[classNum]) db.notes[classNum] = {};
    if (!db.notes[classNum][subject]) db.notes[classNum][subject] = [];
    
    db.notes[classNum][subject].push({
        id: Date.now().toString(),
        title,
        content,
        dateAdded: new Date().toISOString()
    });
    
    localStorage.setItem('notes', JSON.stringify(db.notes));
    loadNotes();
    closeAdminForm();
    
    // Clear form
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
}

function deleteHomework(id) {
    if (confirm('Delete this homework?')) {
        const classNum = localStorage.getItem('currentClass');
        const date = document.getElementById('dateFilter')?.value || new Date().toISOString().split('T')[0];
        
        db.homework[classNum][date] = db.homework[classNum][date].filter(hw => hw.id !== id);
        if (db.homework[classNum][date].length === 0) {
            delete db.homework[classNum][date];
        }
        
        localStorage.setItem('homework', JSON.stringify(db.homework));
        loadHomework();
    }
}

function deleteNote(id) {
    if (confirm('Delete this note?')) {
        const classNum = localStorage.getItem('currentClass');
        const subject = document.querySelector('.tab-btn.active')?.dataset.subject || 'Math';
        
        db.notes[classNum][subject] = db.notes[classNum][subject].filter(note => note.id !== id);
        if (db.notes[classNum][subject].length === 0) {
            delete db.notes[classNum][subject];
        }
        
        localStorage.setItem('notes', JSON.stringify(db.notes));
        loadNotes();
    }
}

// === NAVIGATION ===
function goToHome() {
    window.location.href = 'index.html';
}

function goBack() {
    history.back();
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    updateUserInfo();
    loadData();
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('#dateFilter');
    dateInputs.forEach(input => input.value = today);
    
    // Setup tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadNotes();
        });
    });
    
    // Setup filters
    document.getElementById('dateFilter')?.addEventListener('change', loadHomework);
    document.getElementById('subjectFilter')?.addEventListener('change', loadHomework);
});
