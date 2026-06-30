// Task Planner Application
class TaskPlanner {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.render();
    }

    cacheElements() {
        this.taskForm = document.getElementById('task-form');
        this.taskInput = document.getElementById('task-input');
        this.prioritySelect = document.getElementById('priority-select');
        this.taskList = document.getElementById('task-list');
        this.emptyState = document.getElementById('empty-state');
        this.taskCount = document.getElementById('task-count');
        this.completedCount = document.getElementById('completed-count');
        this.clearBtn = document.getElementById('clear-btn');
        this.clearSection = document.getElementById('clear-completed');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
    }

    bindEvents() {
        this.taskForm.addEventListener('submit', (e) => this.addTask(e));
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e));
        });
        this.clearBtn.addEventListener('click', () => this.clearCompleted());
    }

    addTask(e) {
        e.preventDefault();
        
        const taskText = this.taskInput.value.trim();
        const priority = this.prioritySelect.value;

        if (taskText === '') {
            alert('Please enter a task');
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            priority: priority,
            createdAt: new Date().toLocaleDateString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.prioritySelect.value = 'medium';
        this.render();
        this.taskInput.focus();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.render();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    setFilter(e) {
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.render();
    }

    clearCompleted() {
        const confirmed = confirm('Are you sure you want to delete all completed tasks?');
        if (confirmed) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.render();
        }
    }

    getFilteredTasks() {
        switch(this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;

        this.taskCount.textContent = `${total} ${total === 1 ? 'task' : 'tasks'}`;
        this.completedCount.textContent = `${completed} completed`;

        // Update progress bar
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        this.progressFill.style.width = percentage + '%';
        this.progressText.textContent = percentage + '% Complete';
    }

    render() {
        const filteredTasks = this.getFilteredTasks();
        this.taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            this.emptyState.style.display = 'block';
            this.taskList.style.display = 'none';
        } else {
            this.emptyState.style.display = 'none';
            this.taskList.style.display = 'block';
            
            filteredTasks.forEach(task => {
                const li = this.createTaskElement(task);
                this.taskList.appendChild(li);
            });
        }

        // Show/hide clear button
        const hasCompleted = this.tasks.some(t => t.completed);
        this.clearSection.style.display = hasCompleted ? 'flex' : 'none';

        this.updateStats();
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        const priorityLabel = {
            low: '○',
            medium: '◐',
            high: '●'
        };

        li.innerHTML = `
            <div class="task-content">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    aria-label="Toggle task completion"
                >
                <span class="priority-indicator" title="${task.priority} priority">${priorityLabel[task.priority]}</span>
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <span class="task-date">${task.createdAt}</span>
            </div>
            <button class="btn-delete" title="Delete task">
                <span>✕</span>
            </button>
        `;

        const checkbox = li.querySelector('.task-checkbox');
        const deleteBtn = li.querySelector('.btn-delete');

        checkbox.addEventListener('change', () => this.toggleTask(task.id));
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

        return li;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize the planner when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TaskPlanner();
});