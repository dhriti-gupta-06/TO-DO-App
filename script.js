// Array to hold tasks
let tasks = [];

// DOM elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');
const countSpan = document.getElementById('count');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Event listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
filterBtns.forEach(btn => btn.addEventListener('click', filterTasks));
clearCompletedBtn.addEventListener('click', clearCompleted);

// Functions

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;
    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };
    tasks.push(task);
    taskInput.value = '';
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function toggleComplete(id) {
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
}

function filterTasks(e) {
    const filter = e.target.dataset.filter;
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    renderTasks(filter);
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    let filteredTasks = tasks;
    if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) li.classList.add('completed');
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">Delete</button>
        `;
        const checkbox = li.querySelector('.task-checkbox');
        const deleteBtn = li.querySelector('.delete-btn');
        checkbox.addEventListener('change', () => toggleComplete(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        taskList.appendChild(li);
    });
    updateCount();
}

function updateCount() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    countSpan.textContent = `${total} tasks (${pending} pending, ${completed} completed)`;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}
