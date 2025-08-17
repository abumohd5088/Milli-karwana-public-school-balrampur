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
               
