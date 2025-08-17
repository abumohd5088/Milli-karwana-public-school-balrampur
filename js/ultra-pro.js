// Springfield India - Complete System
class SpringfieldManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupLocalStorage();
        this.handleCurrentPage();
    }

    setupLocalStorage() {
        if (!localStorage.getItem('springfield_initialized')) {
            // Sample data
            this.setData('homework', [
                {
                    id: '1',
                    class: '10',
                    subject: 'Math',
                    description: 'Complete exercises 1-15 from Chapter 5',
                    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    class: '10',
                    subject: 'Science',
                    description: 'Write a report on photosynthesis process',
                    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    createdAt: new Date().toISOString()
                }
            ]);

            this.setData('notes', [
                {
                    id: '1',
                    class: '10',
                    subject: 'Math',
                    title: 'Quadratic Equations',
                    content: 'A quadratic equation is any equation that can be rearranged in standard form as ax² + bx + c = 0. The solutions can be found using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    class: '10',
                    subject: 'Science',
                    title: 'Chemical Reactions',
                    content: 'A chemical reaction is a process that leads to the chemical transformation of one set of chemical substances to another. Key types: combination, decomposition, displacement, and double displacement reactions.',
                    createdAt: new Date().toISOString()
                }
            ]);

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

    handleCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop();
        
        switch(currentPage) {
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
    }

    initLogin() {
        // Login functionality handled in respective HTML files
    }

    initDashboard() {
        // Dashboard functionality handled in respective HTML files
    }

    initAdmin() {
        // Admin functionality handled in respective HTML files
    }
}

// Initialize system
new SpringfieldManager();
