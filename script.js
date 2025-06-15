const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskList = document.getElementById("taskList");
const error = document.getElementById("error");
const filterButtons = document.querySelectorAll("[data-filter]");

let tasks = [];

document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocalStorage();
  fetchTasks();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskTitle.value.trim();
  if (title === "") {
    showError("Task title cannot be empty");
    return;
  }
  const newTask = {
    id: Date.now(),
    title,
    completed: false,
  };
  tasks.push(newTask);
  updateTasks();
  taskTitle.value = "";
});

filterButtons.forEach((btn) =>
  btn.addEventListener("click", () => filterTasks(btn.dataset.filter))
);

function showError(msg) {
  error.textContent = msg;
  taskTitle.style.borderColor = "red";
  setTimeout(() => {
    error.textContent = "";
    taskTitle.style.borderColor = "";
  }, 2000);
}

function renderTasks(taskArray) {
  taskList.innerHTML = "";
  taskArray.forEach((task) => {
    const card = document.createElement("div");
    card.className = "task-card";

    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.title;
    if (task.completed) title.classList.add("completed");

    const status = document.createElement("div");
    status.textContent = task.completed ? "Completed" : "Pending";

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔️";
    completeBtn.onclick = () => toggleComplete(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => deleteTask(task.id);

    card.append(title, status, completeBtn, deleteBtn);
    taskList.appendChild(card);
  });
}

function toggleComplete(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  updateTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  updateTasks();
}

function filterTasks(type) {
  let filtered = [];
  if (type === "all") filtered = tasks;
  else if (type === "completed") filtered = tasks.filter((t) => t.completed);
  else if (type === "pending") filtered = tasks.filter((t) => !t.completed);
  renderTasks(filtered);
}

function updateTasks() {
  renderTasks(tasks);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
    renderTasks(tasks);
  }
}

// Async fetch from placeholder (optional for task demo)
function fetchTasks() {
  fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
    .then((res) => res.json())
    .then((data) => {
      const apiTasks = data.map((t) => ({
        id: t.id + 1000,
        title: t.title,
        completed: t.completed,
      }));
      tasks = [...tasks, ...apiTasks];
      updateTasks();
    })
    .catch((err) => console.error("Fetch error:", err));
}
