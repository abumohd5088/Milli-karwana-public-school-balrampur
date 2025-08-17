// === HIDDEN ADMIN SYSTEM ===
let adminMode = false;

// Triple-click + "Abutalha" trigger
let clicks = 0;
let lastClick = 0;

document.addEventListener('click', () => {
    const now = Date.now();
    if (now - lastClick < 300) {
        clicks++;
    } else {
        clicks = 1;
    }
    lastClick = now;
    
    if (clicks >= 3) {
        setTimeout(() => {
            document.addEventListener('keydown', adminListener);
        }, 1000);
        setTimeout(() => {
            document.removeEventListener('keydown', adminListener);
        }, 4000);
    }
});

function adminListener(e) {
    if (e.key === 'a' && e.ctrlKey) {
        adminMode = true;
        showAdminControls();
    }
}

function adminListener(e) {
    let sequence = '';
    sequence += e.key;
    if (sequence.includes('Abutalha')) {
        adminMode = true;
        showAdminControls();
        sequence = '';
    }
}

// === DATA STORAGE ===
const db = {
    homework: JSON.parse(localStorage.getItem('homework')) || {},
    notes: JSON.parse(localStorage.getItem('notes')) || {},
    timetable: JSON.parse(localStorage.getItem('timetable')) || {},
    results: JSON.parse(localStorage.getItem('results')) || {}
};

// === LOGIN SYSTEM ===
if (window.location.pathname.includes('index.html')) {
    document.getElementById('loginForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('studentName').value;
        const classNum = document.getElementById('classSelect').value;
        
        localStorage.setItem('studentName', name);
        localStorage.setItem('currentClass', classNum);
        
        window.location.href = 'dashboard.html';
    });
}

// === DASHBOARD SYSTEM ===
function loadDashboard() {
    const name = localStorage.getItem('studentName') || 'Student';
    const classNum = localStorage.getItem('currentClass') || '1';
    
    document.getElementById('studentNameDisplay').textContent = name;
    document.getElementById('classDisplay').textContent = classNum;
    
    // Initialize class data
    if (!db.homework[classNum]) db.homework[classNum] = {};
    if (!db.notes[classNum]) db.notes[classNum] = {};
    
    loadTabData('homework');
    loadTabData('notes');
    loadTabData('timetable');
    loadTabData('results');
}

// === TAB SWITCHING ===
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    loadTabData(tabName);
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

// === LOAD DATA ===
function loadHomework(classNum) {
    const date = document.getElementById('hwDate')?.value || new Date().toISOString().split('T')[0];
    const subject = document.getElementById('hwSubject')?.value || 'all';
    
    const homework = db.homework[classNum]?.[date] || [];
    let filtered = subject === 'all' ? homework : homework.filter(hw => hw.subject === subject);
    
    const container = document.getElementById('homeworkList');
    if (!container) return;
    
    container.innerHTML = filtered.map(hw => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${hw.subject}</div>
                ${adminMode ? `<button class="delete-btn" onclick="deleteItem('homework', '${hw.id}')">×</button>` : ''}
            </div>
            <div class="item-content">${hw.description}</div>
            <div class="item-footer">
                <span>Due: ${new Date(hw.dueDate).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state">No homework assigned! 🎉</div>';
    }
}

function loadNotes(classNum) {
    const subject = document.getElementById('noteSubject')?.value || 'Math';
    
    const notes = db.notes[classNum]?.[subject] || [];
    
    const container = document.getElementById('notesList');
    if (!container) return;
    
    container.innerHTML = notes.map(note => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${note.title}</div>
                ${adminMode ? `<button class="delete-btn" onclick="deleteItem('notes', '${note.id}')">×</button>` : ''}
            </div>
            <div class="item-content">${note.content}</div>
            <div class="item-footer">
                <span>${new Date(note.dateAdded).toLocaleDateString()}</span>
            </div>
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
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "English"},
            {time: "10:30-11:15", subject: "Science"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Social"}, {time: "12:15-1:00", subject: "Art"}
        ],
        4: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "English"},
            {time: "10:30-11:15", subject: "Science"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Hindi"}, {time: "12:15-1:00", subject: "Computer"}
        ],
        5: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "English"},
            {time: "10:30-11:15", subject: "Science"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Social"}, {time: "12:15-1:00", subject: "Sanskrit"}
        ],
        6: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "Science"},
            {time: "10:30-11:15", subject: "English"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Hindi"}, {time: "12:15-1:00", subject: "Social"}
        ],
        7: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "Science"},
            {time: "10:30-11:15", subject: "English"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Hindi"}, {time: "12:15-1:00", subject: "Computer"}
        ],
        8: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "Science"},
            {time: "10:30-11:15", subject: "English"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Social"}, {time: "12:15-1:00", subject: "Sanskrit"}
        ],
        9: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "Science"},
            {time: "10:30-11:15", subject: "English"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Hindi"}, {time: "12:15-1:00", subject: "Physics"}
        ],
        10: [
            {time: "9:00-9:45", subject: "Math"}, {time: "9:45-10:30", subject: "Science"},
            {time: "10:30-11:15", subject: "English"}, {time: "11:15-11:30", subject: "Break"},
            {time: "11:30-12:15", subject: "Social"}, {time: "12:15-1:00", subject: "Chemistry"}
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
    
    const classTimetable = timetable[classNum] || timetable[1];
    container.innerHTML = classTimetable.map(item => `
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
        3: [
            {subject: "Math", marks: 91, grade: "A"}, {subject: "Science", marks: 93, grade: "A+"},
            {subject: "English", marks: 88, grade: "A"}, {subject: "Social", marks: 90, grade: "A+"}
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

// === ADMIN FUNCTIONS ===
function showAdminControls() {
    document.getElementById('adminControls')?.classList.remove('hidden');
}

function showAddForm(type) {
    document.getElementById('formTitle').textContent = `Add ${type}`;
    document.getElementById('addForm').classList.remove('hidden');
    currentFormType = type;
}

function closeAddForm() {
    document.getElementById('addForm').classList.add('hidden');
}

function saveItem() {
    const classNum = localStorage.getItem('currentClass');
    const title = document.getElementById('itemTitle').value;
    const content = document.getElementById('itemContent').value;
    
    if (!title || !content) {
        alert('Please fill all fields');
        return;
    }
    
    const id = Date.now().toString();
    
    if (currentFormType === 'homework') {
        const date = document.getElementById('itemDate').value || new Date().toISOString().split('T')[0];
        const subject = document.getElementById('hwSubject')?.value || 'General';
        
        if (!db.homework[classNum]) db.homework[classNum] = {};
        if (!db
