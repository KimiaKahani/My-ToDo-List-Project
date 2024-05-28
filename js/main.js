const ul = document.querySelector("ul");
const input = document.querySelector("form input");
let ifTaskIsRepeated = false;

window.onload = loadTasks;

document.querySelector("form button").addEventListener("click", (e) => {
  e.preventDefault();
  addTask();
});

//loading exsisting tasks in local storage
function loadTasks() {
  let tasks = localStorage.getItem("tasks");
  if (tasks !== null) {
    tasks = JSON.parse(tasks);
    tasks.forEach((task) => {
      createTask(task.value);
    });
    completeStoragedTasksChecking();
  }
}

//adding new task
function addTask() {
  if (input.value === "") {
    alert("Item Cannot Be Empty!");
    return;
  } else {
    repeatedTasksInLocalStorage();
    if (!ifTaskIsRepeated) {
      createTask(input.value);
      addToLocalStorage();
      input.value = "";
    }
  }
}

function createTask(taskValue) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const checkButton = document.createElement("input");
  const deleteButton = document.createElement("button");

  checkButton.classList.add("check");
  checkButton.setAttribute("type", "checkbox");
  span.innerText = taskValue;
  deleteButton.classList.add("delete");

  li.appendChild(checkButton);
  li.appendChild(span);
  li.appendChild(deleteButton);
  ul.appendChild(li);

  // click to delete a task
  deleteButton.addEventListener("click", () => {
    if (confirm("Delete This Item?")) {
      removeFromLocalStorage(span.innerText);
      li.remove();
    }
  });

  // click to add checkmark for a completed task
  checkButton.addEventListener("click", () => {
    if (checkButton.checked) {
      taskCompleted(span, span.innerText);
    } else {
      taskInComplete(span, span.innerText);
    }
  });

  // click to change value of a task
  span.addEventListener("click", () => {
    const newInnerText = prompt("Enter new Name for this Item:");
    const lastInnerText = span.innerText;
    if (newInnerText) {
      for (let i = 0; i < ul.children.length; i++) {
        if (newInnerText === ul.children[i].childNodes[1].innerText) {
          alert("Task Already Exist!");
          return false;
        }
      }
      span.innerText = newInnerText;
      changeLocalStorage(newInnerText, lastInnerText);
    } else if (newInnerText === "") {
      alert("Item Cannot Be Empty!");
    } else {
      span.innerText = lastInnerText;
    }
  });
}

function addToLocalStorage() {
  const value = input.value;
  const id = (Math.random() + 1).toString(36).substring(7);
  localStorage.setItem(
    "tasks",
    JSON.stringify([
      ...JSON.parse(localStorage.getItem("tasks") || "[]"),
      {
        id,
        value,
        completed: false,
      },
    ])
  );
}

// delete a task from local storage
function removeFromLocalStorage(taskInnerText) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => {
    if (task.value === taskInnerText) {
      tasks.splice(tasks.indexOf(task), 1);
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
}

// change value of a task from local storage
function changeLocalStorage(newInnerText, lastInnerText) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => {
    if (task.value === lastInnerText) {
      task.value = newInnerText;
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
}

// checking if task exists in local storage
function repeatedTasksInLocalStorage() {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks !== null) {
    tasks.forEach((task) => {
      if (task.value === input.value) {
        alert("Task Already Exist!");
        input.value = "";
        ifTaskIsRepeated = true;
      }
    });
  }
}

function completeStoragedTasksChecking() {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => {
    if (task.completed) {
      Array.from(ul.children).filter((item) => {
        if (task.value === item.childNodes[1].innerText) {
          item.childNodes[1].classList.add("complete");
          item.childNodes[0].checked = true;
        }
      });
    }
  });
}

//if task is complete
function taskCompleted(taskValue, taskInnerText) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => {
    if (task.value === taskInnerText) {
      task.completed = true;
      taskValue.classList.add("complete");
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// if task is not complete
function taskInComplete(taskValue, taskInnerText) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => {
    if (task.value === taskInnerText) {
      task.completed = false;
      taskValue.classList.remove("complete");
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//filtering
document.querySelector("#allTasks").addEventListener("click", toDoFilterAll);
document
  .querySelector("#completedTasks")
  .addEventListener("click", toDoFilterCompleted);
document
  .querySelector("#inCompletedTasks")
  .addEventListener("click", toDoFilterInComplete);

function toDoFilterAll() {
  Array.from(ul.children).filter((item) => (item.style.display = "flex"));
}
function toDoFilterCompleted() {
  Array.from(ul.children).filter((item) => {
    if (item.children[1].classList.contains("complete"))
      item.style.display = "flex";
    else item.style.display = "none";
  });
}
function toDoFilterInComplete() {
  Array.from(ul.children).filter((item) => {
    if (!item.children[1].classList.contains("complete"))
      item.style.display = "flex";
    else item.style.display = "none";
  });
}
