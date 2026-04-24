//DOM Elements
const dateEl = document.getElementById('date');
const todoInputEl = document.getElementById('todo-task');
const addBtnEl = document.getElementById('add-btn');
const filtersEl = document.querySelectorAll('.filter');
const todoListEl = document.getElementById('todo-list');
const emptyStateEl = document.querySelector('.empty-state');
const itemsLeftEl = document.getElementById('items-left');
const clearCompletedBtnEl = document.getElementById('clear-completed-btn');

// Initialize an array to store tasks
let todos = JSON.parse(localStorage.getItem('todos')) || [];
const currentFilter = 'all';

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

  // saveTodos();
  // renderTodos();
  todoInputEl.value = '';
}
