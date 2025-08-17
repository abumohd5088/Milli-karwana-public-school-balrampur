// === ULTRA HIDDEN ADMIN SYSTEM ===
let adminSequence = '';
let doubleTapTimer = null;
let isAdminMode = false;

// Secret admin trigger: Double-tap anywhere + type "Abutalha"
document.addEventListener('click', (e) => {
    if (doubleTapTimer) {
        clearTimeout(doubleTapTimer);
        document.addEventListener('keydown', adminKeyListener);
        doubleTapTimer = null;
    } else {
        doubleTapTimer = setTimeout(() => {
            document.removeEventListener('keydown', adminKeyListener);
            adminSequence = '';
        }, 1000);
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
    homework: JSON.parse(localStorage.getItem('homework')) || {},
    notes: JSON.parse(localStorage.getItem('notes')) || {},
    timetable: JSON.parse(localStorage.getItem('timetable')) || {},
    results: JSON.parse(localStorage.getItem('results')) || {}
};

const currentClass = () => localStorage.getItem('currentClass') || '1';

// === CLASS SELECTION ===
if (window.location.pathname.includes('index.html')) {
    document.querySelectorAll('.class-card').forEach(card => {
        card.addEventListener('click', () => {
            const classNum = card.dataset.class;
            localStorage.setItem('currentClass', classNum);
            window.location.href = 'homework.html';
        });
    });
}

// === DYNAMIC CLASS LABELS ===
document.querySelectorAll('.current-class').forEach(el => {
    el.textContent = currentClass();
});

// === HOMEWORK MANAGEMENT ===
function loadHomework() {
    const classNum = currentClass();
    const date = document.getElementById('dateFilter')?.value || new Date().toISOString().split('T')[0];
    const subject = document.getElementById('subjectFilter')?.value || 'all';
    
    const homework = db.homework[classNum]?.[date] || [];
    const filtered = subject === 'all' ? homework : homework.filter(hw => hw.subject === subject);
    
    const container = document.getElementById('homeworkList');
    if (!container) return;
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>No Homework Today!</h3>
                <p>Enjoy your free time 😊</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(hw => `
        <div class="homework-card" data-id="${hw.id}">
            <div class="card-header">
                <h3>${hw.subject}</h3>
                ${isAdminMode ? `<button class="delete-btn" onclick="deleteHomework('${date}', '${hw.id}')">
                    <i class="fas fa-trash"></i>
                </button>` : ''}
            </div>
            <p>${hw.description}</p>
            <div class="card-footer">
                <span class="due-date">Due: ${new Date(hw.dueDate).toLocaleDateString()}</span>
                <span class="subject-tag">${hw.subject}</span>
            </div>
        </div>
    `).join('');
}

// === NOTES MANAGEMENT ===
function loadNotes() {
    const classNum = currentClass();
    const subject = document.querySelector('.tab-btn.active')?.dataset.subject || 'Math';
    
    const notes = db.notes[classNum]?.[subject] || [];
    const container = document.getElementById('notesList');
    if (!container) return;
    
    if (notes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-sticky-note"></i>
                <h3>No Notes Yet</h3>
                <p>Notes will appear here 📚</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = notes.map(note => `
        <div class="note-card" data-id="${note.id}">
            <div class="card-header">
                <h3>${note.title}</h3>
                ${isAdminMode ? `<button class="delete-btn" onclick="deleteNote('${subject}', '${note.id}')">
                    <i class="fas fa-trash"></i>
                </button>` : ''}
            </div>
            <p>${note.content}</p>
            <small>${new Date(note.dateAdded).toLocaleDateString()}</small>
        </div>
    `).join('');
}

// === TIMETABLE ===
function loadTimetable() {
    const classNum = currentClass();
    const timetable = [
        { time: "9:00-9:45", subject: "Math", day: "Mon-Fri" },
        { time: "9:45-10:30", subject: "English", day: "Mon-Fri" },
        { time: "10:30-11:15", subject: "Science", day: "Mon-Fri" },
        { time: "11:15-11:30", subject: "Break", day: "Mon-Fri" },
        { time: "11:30-12:15", subject: "Hindi", day: "Mon-Fri" },
        { time: "12:15-1:00", subject: "EVS", day: "Mon-Fri" },
        { time: "1:00-2:00", subject: "Lunch", day: "Mon-Fri" },
        { time: "2:00-2:45", subject: "Art", day: "Mon-Wed-Fri" },
        { time: "2:00-2:45", subject: "Music", day: "Tue-Thu" }
    ];
    
    const container = document.getElementById('timetableContent');
    if (!container) return;
    
    container.innerHTML = timetable.map(item => `
        <div class="timetable-row">
            <div class="time">${item.time}</div>
            <div class="subject">${item.subject}</div>
            <div class="day">${item.day}</div>
        </div>
    `).join('');
}

// === RESULTS ===
function loadResults() {
    const classNum = currentClass();
    const results = [
        { subject: "Math", marks: 95, grade: "A+" },
        { subject: "English", marks: 92, grade: "A+" },
        { subject: "Science", marks: 88, grade: "A" },
        { subject: "Hindi", marks: 90, grade: "A+" },
        { subject: "EVS", marks: 85, grade: "A" }
    ];
    
    const container = document.getElementById('resultsContent');
    if (!container) return;
    
    container.innerHTML = results.map(result => `
        <div class="result-item">
            <div class="subject">${result.subject}</div>
            <div class="marks">${result.marks}/100</div>
            <div class="grade">${result.grade}</div>
        </div>
    `).join('');
}

// === ADMIN FUNCTIONS ===
function showAdminLogin() {
    document.getElementById('adminLogin')?.classList.remove('hidden');
    document.getElementById('adminFab')?.style.display = 'flex';
}

function closeAdmin() {
    document.getElementById('adminLogin')?.classList.add('hidden');
}

function adminLogin() {
    const password = document.getElementById('adminPass')?.value;
    if (password === 'Abutalha') {
        isAdminMode = true;
        closeAdmin();
        showAdminControls();
        document.getElementById('adminFab')?.style.display = 'flex';
    } else {
        alert('Invalid password');
    }
}

function showAdminControls() {
    // Show floating action button
    const fab = document.getElementById('adminFab');
    if (fab) fab.style.display = 'flex';
    
    // Show delete buttons
    document.body.classList.add('admin-mode');
}

function toggleAdmin() {
    document.getElementById('adminForm')?.classList.toggle('hidden');
}

function closeAdminForm() {
    document.getElementById('adminForm')?.classList.add('hidden');
}

function saveHomework() {
    const classNum = currentClass();
    const subject = document.getElementById('hwSubject')?.value;
    const description = document.getElementById('hwDescription')?.value;
    const dueDate = document.getElementById('hwDueDate')?.value;
    
    if (!subject || !description || !dueDate) {
        alert('Please fill all fields');
        return;
    }
    
    const date = document.getElementById('dateFilter')?.value || new Date().toISOString().split('T')[0];
    
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
    document.getElementById('hwSubject').value = '';
    document.getElementById('hwDescription').value = '';
}

function saveNotes() {
    const classNum = currentClass();
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
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
}

function deleteHomework(date, id) {
    if (confirm('Delete this homework?')) {
        const classNum = currentClass();
        db.homework[classNum][date] = db.homework[classNum][date].filter(hw => hw.id !== id);
        if (db.homework[classNum][date].length === 0) {
            delete db.homework[classNum][date];
        }
        localStorage.setItem('homework', JSON.stringify(db.homework));
        loadHomework();
    }
}

function deleteNote(subject, id) {
    if (confirm('Delete this note?')) {
        const classNum = currentClass();
        db.notes[classNum][subject] = db.notes[classNum][subject].filter(note => note.id !== id);
        if (db.notes[classNum][subject].length === 0) {
            delete db.notes[classNum][subject];
        }
        localStorage.setItem('notes', JSON.stringify(db.notes));
        loadNotes();
    }
}

// === NAVIGATION ===
function goBack() {
    history.back();
}

function goHome() {
    window.location.href = 'index.html';
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('#dateFilter');
    dateInputs.forEach(input => input.value = today);
    
    // Load appropriate data
    const path = window.location.pathname;
    if (path.includes('homework.html')) loadHomework();
    if (path.includes('notes.html')) loadNotes();
    if (path.includes('timetable.html')) loadTimetable();
    if (path.includes('results.html')) loadResults();
    
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
