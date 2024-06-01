const input = document.querySelector('.input-field .input');
const addTaskBtn = document.querySelector('.add-task-btn');
const clearAllBtn = document.querySelector('.clear-all-btn');
const listContainer = document.querySelector('.list-container');
const search = document.querySelector('.search-field .search');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));// 
}

function allTasks() {
    const allLists = document.querySelectorAll('.list');
    const pendingTasks = document.querySelectorAll('.pending');
    const pendingNum = document.querySelector('.pending-num');

    if (allLists.length > 0) {
        listContainer.style.marginTop = '1.25rem';
        pendingNum.textContent = pendingTasks.length;
        clearAllBtn.classList.add('active');
        return;
    }

    listContainer.style.marginTop = '0';
    pendingNum.textContent = 'no';
    clearAllBtn.classList.remove('active');
}

function deleteTask(event) {
    const taskElement = event.currentTarget.parentElement;
    const taskIndex = Array.from(listContainer.children).reverse().indexOf(taskElement);

    tasks.splice(taskIndex, 1);
    taskElement.remove();

    saveToLocalStorage();
    allTasks();
};


function editTask(event) {
    const parentElement = event.target.parentElement;
    const taskElement = parentElement.querySelector('.task'); 

    event.target.remove();

    const iTagSave = document.createElement('i');
    iTagSave.classList.add('fa-solid', 'fa-floppy-disk');
    iTagSave.dataset.icon = 'save';

    parentElement.insertBefore(iTagSave, parentElement.querySelector('[data-icon="trash"]'));
    parentElement.removeEventListener('click', completeTask);

    taskElement.style.pointerEvents = 'auto';
    taskElement.contentEditable = true;
    taskElement.focus();

    iTagSave.addEventListener('click', () => {
        const taskText = taskElement.textContent;
        const taskIndex = Array.from(listContainer.children).reverse().indexOf(parentElement);

        tasks[taskIndex].name = taskText;

        const iTagEdit = document.createElement('i');
        iTagEdit.classList.add('fa-solid', 'fa-pen-to-square');
        iTagEdit.dataset.icon = 'edit';
        iTagEdit.addEventListener('click', editTask);

        parentElement.insertBefore(iTagEdit, parentElement.querySelector('[data-icon="trash"]'));

        taskElement.style.pointerEvents = 'none';
        taskElement.contentEditable = false;

        parentElement.addEventListener('click', completeTask);

        saveToLocalStorage();

        iTagSave.remove();
    });
}

function completeTask(event) {
    const taskElement = event.target;

    if (taskElement.tagName === 'LIST') {
        const taskIndex = Array.from(listContainer.children).reverse().indexOf(taskElement);
        const checkbox = taskElement.querySelector('input');
        const iTagEdit = taskElement.querySelector('[data-icon="edit"]');

        checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
            taskElement.classList.remove('pending');
            tasks[taskIndex].completion = true;
            iTagEdit.removeEventListener('click', editTask);
            iTagEdit.style.cursor = 'default';
            iTagEdit.style.opacity = '0.4';
        } else {
            taskElement.classList.add('pending');
            tasks[taskIndex].completion = false;
            iTagEdit.addEventListener('click', editTask);
            iTagEdit.style.cursor = 'pointer';
            iTagEdit.style.opacity = '1.0';
        } 

        saveToLocalStorage();
        allTasks();
    }
}

function addTask(taskText, completed = false) {
    const liTag = document.createElement('list');
    liTag.classList.add('list');
    if (!completed) liTag.classList.add('pending');
    liTag.addEventListener('click', completeTask);

    const inputTag = document.createElement('input');
    inputTag.type = 'checkbox';
    inputTag.checked = completed;

    const spanTag = document.createElement('span');
    spanTag.classList.add('task');
    spanTag.textContent = taskText;

    const iTagEdit = document.createElement('i');
    iTagEdit.classList.add('fa-solid', 'fa-pen-to-square');
    iTagEdit.dataset.icon = 'edit';
    iTagEdit.addEventListener('click', editTask);

    const iTagTrash = document.createElement('i');
    iTagTrash.classList.add('fa-solid', 'fa-trash');
    iTagTrash.dataset.icon = 'trash';
    iTagTrash.addEventListener('click', deleteTask);

    liTag.append(inputTag, spanTag, iTagEdit, iTagTrash); 
    listContainer.insertAdjacentElement('afterbegin', liTag);

    tasks.push({name: taskText, completion: completed, element: liTag});

    saveToLocalStorage();
    allTasks();
}

input.addEventListener('input', () => {
    const value = input.value.trim();
    const isActive = value.length > 0;

    addTaskBtn.classList.toggle('active', isActive);
});

addTaskBtn.addEventListener('click', () => {
    const taskText = input.value.trim();

    if (taskText) {
        addTask(taskText);
        input.value = '';
        addTaskBtn.classList.remove('active');
    }
});

search.addEventListener('input', () => {
    const searchValue = search.value.trim().toLowerCase();

    tasks.forEach(task => {
        const taskElement = task.element;

        task_name = task.name.toLowerCase();
        isVisible = task_name.includes(searchValue);
        taskElement.classList.toggle('hide', !isVisible);
    });
});

clearAllBtn.addEventListener('click', () => {
    listContainer.innerHTML = '';
    tasks = [];
    saveToLocalStorage();
    allTasks();
});

window.addEventListener('DOMContentLoaded', () => {
    const tasksNum = tasks.length;

    search.value = '';
    input.value = '';

    tasks.forEach(task => {
        addTask(task.name, task.completion);
    })

    tasks.splice(0, tasksNum);

    saveToLocalStorage();
    allTasks();
});
