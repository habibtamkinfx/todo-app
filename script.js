//DOM Elements
const dateEl = document.getElementById('date');
const todoInputEl = document.getElementById('todo-task');
const addBtnEl = document.getElementById('add-btn');
const filtersEl = document.querySelectorAll('.filter');
const todoListEl = document.getElementById('todos-list');
const emptyStateEl = document.querySelector('.empty-state');
const itemsLeftEl = document.getElementById('items-left');
const clearCompletedBtnEl = document.getElementById('clear-completed');

// Initialize an array to store tasks
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Event Listeners
todoInputEl.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
  return;
});

// Add task on button click
addBtnEl.addEventListener('click', addTodo);

// Add a new todo item
function addTodo() {
  const taskText = todoInputEl.value.trim();
  if (taskText === '') {
    alert('Please enter a task.');
    return;
  }

  const newTodo = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };
  todos.push(newTodo);

  saveTodos();
  renderTodos();
  todoInputEl.value = '';
}

// Save todos to LocalStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  // Clear existing list
  todoListEl.innerHTML = '';

  const filteredTodos = getFilteredTodos();

  filteredTodos.forEach((todo) => {
    const todoItemEl = document.createElement('li');
    todoItemEl.classList.add('todo-item');

    const labelEl = document.createElement('label');
    labelEl.classList.add('checkbox-container');

    const checkboxEl = document.createElement('input');
    checkboxEl.type = 'checkbox';
    checkboxEl.classList.add('todo-checkbox');
    checkboxEl.checked = todo.completed;

    const checkmarkEl = document.createElement('span');
    checkmarkEl.classList.add('checkmark');

    const textEl = document.createElement('span');
    textEl.classList.add('todo-item-text');
    textEl.textContent = todo.text;

    textEl.addEventListener('dblclick', () => {
      editTodo(todo, textEl);
    });

    const deleteBtnEl = document.createElement('button');
    deleteBtnEl.classList.add('delete-btn');
    deleteBtnEl.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtnEl.addEventListener('click', () => {
      removeItem(todo.id);
    });
    checkboxEl.addEventListener('change', () => {
      todo.completed = checkboxEl.checked;
      saveTodos();
      renderTodos();
    });
    labelEl.appendChild(checkboxEl);
    labelEl.appendChild(checkmarkEl);
    todoItemEl.appendChild(labelEl);
    todoItemEl.appendChild(textEl);
    todoItemEl.appendChild(deleteBtnEl);
    todoListEl.appendChild(todoItemEl);

    if (todo.completed) {
      todoItemEl.classList.add('completed');
    }
  });

  if (filteredTodos.length === 0) {
    emptyStateEl.classList.remove('hidden');
  } else {
    emptyStateEl.classList.add('hidden');
  }
  updateItemsLeft();
}

// Filter tasks based on selected filter
function filteredFilter() {
  filtersEl.forEach((filter) => {
    filter.addEventListener('click', (e) => {
      filtersEl.forEach((f) => f.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentFilter = e.currentTarget.dataset.filter;
      renderTodos();
    });
  });
}

// Get filtered todos based on current filter
function getFilteredTodos() {
  const filteredTodos = todos.filter((todo) => {
    switch (currentFilter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });
  return filteredTodos;
}

// Update the count of active tasks
function updateItemsLeft() {
  const activeTodos = todos.filter((todo) => !todo.completed);
  itemsLeftEl.textContent = `${activeTodos.length} item${activeTodos.length !== 1 ? 's' : ''} left`;
}

// Remove a todo item
function removeItem(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

// Clear all completed tasks
clearCompletedBtnEl.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

// Display current date
function updateDate() {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const today = new Date();
  dateEl.textContent = today.toLocaleDateString('en-US', options);
}

// Edit a todo item
function editTodo(todo, textEl) {
  const editInputEl = document.createElement('input');
  editInputEl.type = 'text';
  editInputEl.classList.add('edit-input');
  editInputEl.value = todo.text;
  textEl.replaceWith(editInputEl);
  editInputEl.focus();

  const save = () => {
    const updatedText = editInputEl.value.trim();
    if (!updatedText) {
      renderTodos();
      return;
    }
    todo.text = updatedText;
    saveTodos();
    renderTodos();
  };
  editInputEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      editInputEl.blur();
    }
  });
  editInputEl.addEventListener('blur', save);
}

// Initialize the app
window.addEventListener('DOMContentLoaded', () => {
  renderTodos();
  filteredFilter();
  updateDate();
});
