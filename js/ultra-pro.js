// School Manager - Complete System
class SpringfieldIndia {
    constructor() {
        this.currentPage = window.location.pathname.split('/').pop();
        this.init();
    }

    init() {
        // Initialize based on current page
        switch(this.currentPage) {
            case 'index.html':
            case '':
                this.initLogin();
                break;
            case 'dashboard.html':
                this.initDashboard();
                break;
            case 'admin.html':
                this.initAdmin();
                break;
        }

        // Add sample data if first time
        this.initializeSampleData();
    }

    // LocalStorage Helpers
    getData(key, defaultValue = []) {
        try {
            return JSON.parse(localStorage.getItem(key)) || defaultValue;
        } catch {
            return defaultValue;
        }
    }

    setData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // LOGIN PAGE
    initLogin() {
        const loginForm = document.getElementById('loginForm');
        const adminLink = document.getElementById('adminLink');

        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        adminLink?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'admin.html';
        });

        // Hide splash after load
        setTimeout(() => {
            document.getElementById('splashScreen')?.remove();
        }, 2000);
    }

    handleLogin() {
        const name = document.getElementById('studentName').value.trim();
        const classNum = document.getElementById('classSelect').value;

        if (!name || !classNum) {
            this.showToast('Please fill in all fields');
            return;
        }

        // Store user session
        const user = {
            name: name,
            class: classNum,
            loginTime: new Date().toISOString()
        };
        
        this.setData('currentUser', user);

        // Show loading
        const btn = document.getElementById('loginBtn');
        const btnText = btn.querySelector('.btn-text');
        const loading = btn.querySelector('.loading-dots');
        
        btnText.style.display = 'none';
        loading.style.display = 'flex';
        btn.disabled = true;

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    // DASHBOARD
    initDashboard() {
        const user = this.getData('currentUser');
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        // Set welcome message
        document.getElementById('welcomeText').textContent = `Welcome, ${user.name}`;
        document.getElementById('classText').textContent = `Class ${user.class}`;

        this.initTabs();
        this.loadDashboardData(user.class);

        // Show admin button for admin
        if (user.name.toLowerCase() === 'admin') {
            document.querySelector('.admin-fab').style.display = 'flex';
        }
    }

    initTabs() {
        const navItems = document.querySelectorAll('.nav-item');
        const tabContents = document.querySelectorAll('.tab-content');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabName = item.dataset.tab;
                
                // Update active states
                navItems.forEach(i => i.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                item.classList.add('active');
                document.getElementById(tabName).classList.add('active');
                
                // Load tab data
                this.loadTabData(tabName);
            });
        });
    }

    loadDashboardData(classNum) {
        this.loadHomework(classNum);
        this.loadNotes(classNum);
        this.loadTimetable(classNum);
        this.loadResults(classNum);
    }

    loadTabData(tabName) {
        const user = this.getData('currentUser');
        switch(tabName) {
            case 'homework':
                this.loadHomework(user.class);
                break;
            case 'notes':
                this.loadNotes(user.class);
                break;
            case 'timetable':
                this.loadTimetable(user.class);
                break;
            case 'results':
                this.loadResults(user.class);
                break;
        }
    }

    loadHomework(classNum) {
        const homework = this.getData('homework').filter(h => h.class === classNum);
        const container = document.getElementById('homeworkGrid');
        
        container.innerHTML = '';
        
        if (homework.length === 0) {
            container.innerHTML = '<div class="empty-state">📚 No homework assigned</div>';
            return;
        }

        homework.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .forEach(hw => {
                const card = this.createHomeworkCard(hw);
                container.appendChild(card);
            });
    }

    createHomeworkCard(hw) {
        const card = document.createElement('div');
        card.className = 'card';
        
        const dueDate = new Date(hw.dueDate);
        const today = new Date();
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${hw.subject}</h3>
                    <p class="card-subject">Class ${hw.class}</p>
                </div>
                <span class="card-date">${daysLeft} days left</span>
            </div>
            <p class="card-content">${hw.description}</p>
        `;
        
        return card;
    }

    loadNotes(classNum) {
        const notes = this.getData('notes').filter(n => n.class === classNum);
        const container = document.getElementById('notesGrid');
        
        container.innerHTML = '';
        
        if (notes.length === 0) {
            container.innerHTML = '<div class="empty-state">📖 No notes available</div>';
            return;
        }

        notes.forEach(note => {
            const card = this.createNoteCard(note);
            container.appendChild(card);
        });
    }

    createNoteCard(note) {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${note.title}</h3>
                    <p class="card-subject">${note.subject} • Class ${note.class}</p>
                </div>
            </div>
            <p class="card-content">${note.content}</p>
        `;
        
        return card;
    }

    loadTimetable(classNum) {
        const timetables = this.getData('timetables');
        const timetable = timetables.find(t => t.class === classNum);
        const container = document.getElementById('timetableDisplay');
        
        container.innerHTML = '';
        
        if (!timetable) {
            container.innerHTML = '<div class="empty-state">⏰ Timetable not available</div>';
            return;
        }

        const periods = [
            '9:00 - 9:45', '9:45 - 10:30', '10:30 - 11:15', 
            '11:30 - 12:15', '12:15 - 1:00', '1:00 - 1:45'
        ];

        const grid = document.createElement('div');
        grid.className = 'timetable-grid';
        
        periods.forEach((time, index) => {
            const period = document.createElement('div');
            period.className = 'period-card';
            period.innerHTML = `
                <div class="period-time">${time}</div>
                <div class="period-subject">${timetable[`period${index + 1}`] || 'Free'}</div>
            `;
            grid.appendChild(period);
        });
        
        container.appendChild(grid);
    }

    loadResults(classNum) {
        const user = this.getData('currentUser');
        const results = this.getData('results').filter(r => 
            r.class === classNum && r.studentName === user.name
        );
        const container = document.getElementById('resultsDisplay');
        
        container.innerHTML = '';
        
        if (results.length === 0) {
            container.innerHTML = '<div class="empty-state">📊 No results available</div>';
            return;
        }

        results.forEach(result => {
            const card = this.createResultCard(result);
            container.appendChild(card);
        });
    }

    createResultCard(result) {
        const card = document.createElement('div');
        card.className = 'result-card';
        
        const subjects = [
            { name: 'Math', score: result.math },
            { name: 'English', score: result.english },
            { name: 'Science', score: result.science },
            { name: 'Hindi', score: result.hindi }
        ];
        
        const total = subjects.reduce((sum, s) => sum + s.score, 0);
        const percentage = Math.round(total / 4);
        
        card.innerHTML = `
            <div class="result-header">
                <h3 class="result-name">${result.studentName}</h3>
                <div class="result-percentage">${percentage}%</div>
            </div>
            <div class="result-subjects">
                ${subjects.map(s => `
                    <div class="subject-score">
                        <span>${s.name}</span>
                        <span>${s.score}/100</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        return card;
    }

    // ADMIN PANEL
    initAdmin() {
        const loginForm = document.getElementById('adminLoginForm');
        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('adminPassword').value;
            
            if (password === 'Abutalha') {
                document.getElementById('adminLogin').style.display = 'none';
                document.getElementById('adminDashboard').style.display = 'block';
                this.initAdminPanel();
            } else {
                this.showToast('❌ Invalid password');
            }
        });
    }

    initAdminPanel() {
        this.updateAdminStats();
        this.initAdminTabs();
        this.initAdminForms();
        this.loadAdminData();
    }

    initAdminTabs() {
        const tabs = document.querySelectorAll('.admin-tab');
        const sections = document.querySelectorAll('.admin-section');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                tabs.forEach(t => t.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(tabName).classList.add('active');
                
                this.loadAdminSection(tabName);
            });
        });
    }

    initAdminForms() {
        // Add Homework
        document.getElementById('addHomeworkForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAdminHomework();
        });

        // Add Notes
        document.getElementById('addNotesForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAdminNotes();
        });

        // Update Timetable
        document.getElementById('timetableForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateAdminTimetable();
        });

        // Add Results
        document.getElementById('resultsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAdminResult();
        });
    }

    updateAdminStats() {
        const homework = this.getData('homework').length;
        const notes = this.getData('notes').length;
        const students = this.getData('results').length || 1; // Simplified
        
        document.getElementById('totalStudents').textContent = students;
        document.getElementById('totalHomework').textContent = homework;
        document.getElementById('totalNotes').textContent = notes;
    }

    loadAdminData() {
        this.loadAdminHomework();
        this.loadAdminNotes();
    }

    loadAdminSection(section) {
        switch(section) {
            case 'manage-homework':
                this.loadAdminHomework();
                break;
            case 'manage-notes':
                this.loadAdminNotes();
                break;
            case 'manage-timetable':
                this.loadAdminTimetable();
                break;
            case 'manage-results':
                this.loadAdminResults();
                break;
        }
    }

    addAdminHomework() {
        const homework = {
            id: this.generateId(),
            class: document.getElementById('hwClass').value,
            subject: document.getElementById('hwSubject').value,
            description: document.getElementById('hwDescription').value,
            dueDate: document.getElementById('hwDueDate').value,
            createdAt: new Date().toISOString()
        };

        const homeworkList = this.getData('homework');
        homeworkList.push(homework);
        this.setData('homework', homeworkList);

        document.getElementById('addHomeworkForm').reset();
        this.loadAdminHomework();
        this.updateAdminStats();
        this.showToast('✅ Homework added successfully!');
    }

    loadAdminHomework() {
        const homework = this.getData('homework');
        const container = document.getElementById('homeworkList');
        
        container.innerHTML = '';
        
        if (homework.length === 0) {
            container.innerHTML = '<div class="empty-state">No homework found</div>';
            return;
        }

        homework.forEach(hw => {
            const item = this.createAdminItem(hw, 'homework');
            container.appendChild(item);
        });
    }

    addAdminNotes() {
        const note = {
            id: this.generateId(),
            class: document.getElementById('notesClass').value,
            subject: document.getElementById('notesSubject').value,
            title: document.getElementById('notesTitle').value,
            content: document.getElementById('notesContent').value,
            createdAt: new Date().toISOString()
        };

        const notes = this.getData('notes');
        notes.push(note);
        this.setData('notes', notes);

        document.getElementById('addNotesForm').reset();
        this.loadAdminNotes();
        this.updateAdminStats();
        this.showToast('✅ Notes added successfully!');
    }

    loadAdminNotes() {
        const notes = this.getData('notes');
        const container = document.getElementById('notesList');
        
        container.innerHTML = '';
        
        if (notes.length === 0) {
            container.innerHTML = '<div class="empty-state">No notes found</div>';
            return;
        }

        notes.forEach(note => {
            const item = this.createAdminItem(note, 'notes');
            container.appendChild(item);
        });
    }

    updateAdminTimetable() {
        const classNum = document.getElementById('ttClass').value;
        const timetable = {
            class: classNum,
            period1: document.getElementById('period1').value || 'Free',
            period2: document.getElementById('period2').value || 'Free',
            period3: document.getElementById('period3').value || 'Free',
            period4: document.getElementById('period4').value || 'Free',
            period5: document.getElementById('period5').value || 'Free',
            period6: document.getElementById('period6').value || 'Free',
            updatedAt: new Date().toISOString()
        };

        const timetables = this.getData('timetables');
        const existingIndex = timetables.findIndex(t => t.class === classNum);
        
        if (existingIndex >= 0) {
            timetables[existingIndex] = timetable;
        } else {
            timetables.push(timetable);
        }
        
        this.setData('timetables', timetables);
        this.showToast('✅ Timetable updated successfully!');
    }

    loadAdminTimetable() {
        // Load existing timetable for editing
    }

    addAdminResult() {
        const result = {
            id: this.generateId(),
            class: document.getElementById('resultClass').value,
            studentName: document.getElementById('studentName').value,
            math: parseInt(document.getElementById('mathMarks').value) || 0,
            english: parseInt(document.getElementById('englishMarks').value) || 0,
            science: parseInt(document.getElementById('scienceMarks').value) || 0,
            hindi: parseInt(document.getElementById('hindiMarks').value) || 0,
            createdAt: new Date().toISOString()
        };

        const results = this.getData('results');
        results.push(result);
        this.setData('results', results);

        document.getElementById('resultsForm').reset();
        this.showToast('✅ Results saved successfully!');
    }

    loadAdminResults() {
        // Load existing results
    }

    createAdminItem(item, type) {
        const div = document.createElement('div');
        div.className = 'manage-item';
        
        div.innerHTML = `
            <div>
                <strong>${item.title || item.subject}</strong><br>
                <small>Class ${item.class}</small>
            </div>
            <div class="manage-actions">
                <button class="btn-delete" onclick="schoolApp.deleteItem('${type}', '${item.id}')">
                    🗑️
                </button>
            </div>
        `;
        
        return div;
    }

    deleteItem(type, id) {
        if (!confirm(`Delete this ${type}?`)) return;
        
        const key = type === 'homework' ? 'homework' : 'notes';
        const items = this.getData(key);
        const filtered = items.filter(item => item.id !== id);
        
        this.setData(key, filtered);
        
        this.loadAdminSection(`manage-${type}`);
        this.updateAdminStats();
        this.showToast('✅ Deleted successfully!');
    }

    // UTILITIES
    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    initializeSampleData() {
        if (!localStorage.getItem('springfield_initialized')) {
            // Sample homework
            this.setData('homework', [
                {
                    id: '1',
                    class: '10',
                    subject: 'Math',
                    description: 'Complete Chapter 5 exercises 1-15',
                    dueDate: '2025-08-25',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    class: '10',
                    subject: 'Science',
                    description: 'Write a report on photosynthesis process',
                    dueDate: '2025-08-27',
                    createdAt: new Date().toISOString()
                }
            ]);

            // Sample notes
            this.setData('notes', [
                {
                    id: '1',
                    class: '10',
                    subject: 'Math',
                    title: 'Quadratic Equations',
                    content: 'A quadratic equation is any equation that can be rearranged in standard form as ax² + bx + c = 0',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    class: '10',
                    subject: 'Science',
                    title: 'Chemical Reactions',
                    content: 'A chemical reaction is a process that leads to the chemical transformation of one set of chemical substances to another.',
                    createdAt: new Date().toISOString()
                }
            ]);

            // Sample timetable
            this.setData('timetables', [
                {
                    class: '10',
                    period1: 'Math',
                    period2: 'English',
                    period3: 'Science',
                    period4: 'Hindi',
                    period5: 'Social',
                    period6: 'Computer',
                    updatedAt: new Date().toISOString()
                }
            ]);

            // Sample results
            this.setData('results', [
                {
                    id: '1',
                    class: '10',
                    studentName: 'Sample Student',
                    math: 95,
                    english: 88,
                    science: 92,
                    hindi: 85,
                    createdAt: new Date().toISOString()
                }
            ]);

            localStorage.setItem('springfield_initialized', 'true');
        }
    }
}

// Global functions
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function logoutAdmin() {
    window.location.href = 'index.html';
}

function refreshHomework() {
    const user = schoolApp.getData('currentUser');
    schoolApp.loadHomework(user.class);
}

function refreshNotes() {
    const user = schoolApp.getData('currentUser');
    schoolApp.loadNotes(user.class);
}

// Initialize app
const schoolApp = new SpringfieldIndia();
