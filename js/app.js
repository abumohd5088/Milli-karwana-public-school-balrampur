// === GLOBAL DATA ===
const db = {
    homework: JSON.parse(localStorage.getItem('homework')) || {},
    notes: JSON.parse(localStorage.getItem('notes')) || {},
    timetable: JSON.parse(localStorage.getItem('timetable')) || {},
    results: JSON.parse(localStorage.getItem('results')) || {}
};

// === LOGIN SYSTEM ===
function login(e) {
    e.preventDefault();
    const name = document.getElementById('studentName').value;
    const classNum = document.getElementById('classSelect').value;
    
    if (!name || !classNum) {
        alert('Please enter name and select class');
        return;
    }
    
    localStorage.setItem('studentName', name);
    localStorage.setItem('currentClass', classNum);
    window.location.href = 'dashboard.html';
}

function showAdminLogin() {
    document.getElementById('adminModal').classList.remove('hidden');
}

function closeAdmin() {
    document.getElementById('adminModal').classList.add('hidden');
}

function verifyAdmin() {
    const pass = document.getElementById('adminPass').value;
    if (pass === 'Abutalha') {
        window.location.href = 'admin.html';
    } else {
        alert('Wrong password!');
    }
}

// === DASHBOARD SYSTEM ===
function loadDashboard() {
    const name = localStorage.getItem('studentName') || 'Student';
    const classNum = localStorage.getItem('currentClass') || '1';
    
    document.getElementById('studentNameDisplay').textContent = name;
    document.getElementById('currentClass').textContent = classNum;
    
    // Initialize data
    if (!db.homework[classNum]) db.homework[classNum] = {};
    if (!db.notes[classNum]) db.notes[classNum] = {};
    
    loadTabData('homework');
    loadTabData('notes');
    loadTabData('timetable');
    loadTabData('results');
}

function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tab + 'Tab').classList.add('active');
    document.querySelector(`[onclick="showTab('${tab}')"]`).classList.add('active');
    
    loadTabData(tab);
}

function loadTabData(type) {
    const classNum = localStorage.getItem('currentClass') || '1';
    
    switch(type) {
        case 'homework':
            loadHomework(classNum);
            break;
        case 'notes':
            loadNotes(classNum);
            break;
        case 'timetable':
            loadTimetable(classNum);
            break;
        case 'results':
            loadResults(classNum);
            break;
    }
}

// === LOAD DATA FUNCTIONS ===
function loadHomework(classNum) {
    const date = document.getElementById('hwDate')?.value || new Date().toISOString().split('T')[0];
    const subject = document.getElementById('hwSubject')?.value || 'all';
    
    const homework = db.homework[classNum]?.[date] || [];
    let filtered = subject === 'all' ? homework : homework.filter(hw => hw.subject === subject);
    
    const container = document.getElementById('homeworkList');
    if (!container) return;
    
    container.innerHTML = filtered.map(hw => `
        <div class="item-card">
            <h3>${hw.subject}</h3>
            <p>${hw.description}</p>
            <small>Due: ${new Date(hw.dueDate).toLocaleDateString()}</small>
        </div>
    `).join('');
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state">No homework today! 🎉</div>';
    }
}

function loadNotes(classNum) {
    const subject = document.getElementById('noteSubject')?.value || 'Math';
    
    const notes = db.notes[classNum]?.[subject] || [];
    
    const container = document.getElementById('notesList');
    if (!container) return;
    
    container.innerHTML = notes.map(note => `
        <div class="item-card">
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <small>${new Date(note.dateAdded).toLocaleDateString()}</small>
        </div>
    `).join('');
    
    if (notes.length === 0) {
        container.innerHTML = '<div class="empty-state">No notes available 📚</div>';
    }
}

function loadTimetable(classNum) {
    const timetable = {
        1: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "English"},
            {time: "10:30-11:15", subject: "EVS"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Hindi"}, {time: "12:15-1:00", subject: "Art"}
        ],
        2: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "English"},
            {time: "10:30-11:15", subject: "Science"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Hindi"}, {time: "12:15-1:00", subject: "Music"}
        ],
        3: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "Science"},
            {time: "10:30-11:15", subject: "English"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Social"}, {time: "12:15-1:00", subject: "Art"}
        ],
        4: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "Science"},
            {time: "10:30-11:15", subject: "English"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Hindi"}, {time: "12:15-1:00", subject: "Computer"}
        ],
        5: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "Science"},
            {time: "10:30-11:15", subject: "English"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Social"}, {time: "12:15-1:00", subject: "Sanskrit"}
        ],
        6: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "Science"},
            {time: "10:30-11:15", subject: "English"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Hindi"}, {time: "12:15-1:00", subject: "Computer"}
        ],
        7: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "Science"},
            {time: "10:30-11:15", subject: "English"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Social"}, {time: "12:15-1:00", subject: "Computer"}
        ],
        8: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "Science"},
            {time: "10:30-11:15", subject: "English"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Social"}, {time: "12:15-1:00", subject: "Sanskrit"}
        ],
        9: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "Physics"},
            {time: "10:30-11:15", subject: "Chemistry"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "English"}, {time: "12:15-1:00", subject: "Biology"}
        ],
        10: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "Physics"},
            {time: "10:30-11:15", subject: "Chemistry"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "English"}, {time: "12:15-1:00", subject: "Social"}
        ],
        11: [
            {time: "9:00-9:45", subject: "Physics"}, {time: "9:45-10:30", subject: "Chemistry"},
            {time: "10:30-11:15", subject: "Math"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "English"}, {time: "12:15-1:00", subject: "Biology"}
        ],
        12: [
            {time: "9:00-9:45", subject: "Physics"}, {time: "9:45-10:30", subject: "Chemistry"},
            {time: "10:30-11:15", subject: "Math"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "English"}, {time: "12:15-1:00", subject: "Computer"}
        ]
    };
    
    const container = document.getElementById('timetableContent');
    if (!container) return;
    
    container.innerHTML = timetable[classNum].map(item => `
        <div class="timetable-row">
            <div class="time">${item.time}</div>
            <div class="subject">${item.subject}</div>
        </div>
    `).join('');
}

function loadResults(classNum) {
    const results = {
        1: [
            {subject: "Math", marks: 95, grade: "A+"}, {subject: "English", marks: 92, grade: "A+"},
            {subject: "EVS", marks: 88, grade: "A"}, {subject: "Hindi", marks: 90, grade: "A+"}
        ],
        2: [
            {subject: "Math", marks: 93, grade: "A+"}, {subject: "English", marks: 91, grade: "A+"},
            {subject: "Science", marks: 89, grade: "A"}, {subject: "Hindi", marks: 94, grade: "A+"}
        ],
        // Continue for all classes...
        12: [
            {subject: "Physics", marks: 92, grade: "A+"}, {subject: "Chemistry", marks: 94, grade: "A+"},
            {subject: "Math", marks: 91, grade: "A"}, {subject: "English", marks: 93, grade: "A+"}
        ]
    };
    
    const container = document.getElementById('resultsContent');
    if (!container) return;
    
    const classResults = results[classNum] || results[1];
    container.innerHTML = classResults.map(result => `
        <div class="results-row">
            <div class="subject">${result.subject}</div>
            <div class="marks">${result.marks}/100</div>
            <div class="grade">${result.grade}</div>
        </div>
    `).join('');
}

// === ADD FUNCTIONS ===
function addHomework() {
    const classNum = localStorage.getItem('currentClass');
    const subject = document.getElementById('hwSubject')?.value || 'Math';
    const title = prompt('Enter homework title:');
    const content = prompt('Enter homework description:');
    const date = document.getElementById('hwDate')?.value || new Date().toISOString().split('T')[0];
    
    if (!title || !content) return;
    
    if (!db.homework[classNum]) db.homework[classNum] = {};
    if (!db.homework[classNum][date]) db.homework[classNum][date] = [];
    
    db.homework[classNum][date].push({
        id: Date.now(),
        subject,
        title,
        description: content,
        dueDate: date
    });
    
    localStorage.setItem('homework', JSON.stringify(db.homework));
    loadHomework(classNum);
}

function addNotes() {
    const classNum = localStorage.getItem('currentClass');
    const subject = document.getElementById('noteSubject')?.value || 'Math';
    const title = prompt('Enter note title:');
    const content = prompt('Enter note content:');
    
    if (!title || !content) return;
    
    if (!db.notes[classNum]) db.notes[classNum] = {};
    if (!db.notes[classNum][subject]) db.notes[classNum][subject] = [];
    
    db.notes[classNum][subject].push({
        id: Date.now(),
        title,
        content,
        dateAdded: new Date
