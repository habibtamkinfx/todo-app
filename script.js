//DOM Elements
const dateEl = document.getElementById('date');
const todoInputEl = document.getElementById('todo-task');
const addBtnEl = document.getElementById('add-btn');
const filtersEl = document.querySelectorAll('.filter');
const todoListEl = document.getElementById('todos-list');
const emptyStateEl = document.querySelector('.empty-state');
const itemsLeftEl = document.getElementById('items-left');
const clearCompletedBtnEl = document.getElementById('clear-completed-btn');

// Initialize an array to store tasks
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Display current date
const options = { weekday: 'long', month: 'long', day: 'numeric' };
const today = new Date();
dateEl.textContent = today.toLocaleDateString('en-US', options);

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

  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === 'active') {
      return !todo.completed;
    } else if (currentFilter === 'completed') {
      return todo.completed;
    } else {
      return true;
    }
  });

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

  const itemsLeft = filteredTodos.filter((todo) => !todo.completed).length;
  itemsLeftEl.textContent = `${itemsLeft} item${itemsLeft !== 1 ? 's' : ''} left`;
}

function filteredFilter() {
  filtersEl.forEach((filter) => {
    filter.addEventListener('click', (e) => {
      currentFilter = e.target.dataset.filter;
      renderTodos();
    });
  });
}

function removeItem(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

window.addEventListener('DOMContentLoaded', () => {
  renderTodos();
  filteredFilter();
});
