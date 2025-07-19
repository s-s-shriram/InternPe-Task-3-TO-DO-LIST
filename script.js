const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");

const totalCountEl = document.getElementById("total-count");
const completedCountEl = document.getElementById("completed-count");
const pendingCountEl = document.getElementById("pending-count");

const dateTime = document.getElementById("date-time");

// Update Date and Time
setInterval(() => {
  const now = new Date();
  dateTime.textContent = now.toLocaleString();
}, 1000);

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function updateTaskStats() {
  totalCountEl.textContent = tasks.length;
  completedCountEl.textContent = tasks.filter(t => t.completed).length;
  pendingCountEl.textContent = tasks.filter(t => !t.completed).length;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateTaskStats();
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  let filteredTasks = [];

  if (filter === "all") {
    filteredTasks = tasks;
  } else if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (filter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task";
    if (task.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = task.text;
    span.addEventListener("dblclick", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks(getActiveFilter());
    });

    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks(getActiveFilter());
    });

    li.appendChild(span);
    li.appendChild(btn);
    taskList.appendChild(li);
  });

  updateTaskStats();
}

function getActiveFilter() {
  const active = document.querySelector(".filter-btn.active");
  return active ? active.dataset.filter : "all";
}

addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text !== "") {
    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks(getActiveFilter());
    taskInput.value = "";
  }
});

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addBtn.click();
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

// Initial Render
renderTasks("all");
