"use strict";
const inputTask = document.getElementById("input-task");
const today = document.getElementById("today");
const tomorrow = document.getElementById("tomorrow");
const selectDate = document.getElementById("dateInput");
const addListBtn = document.querySelector(".add-list-btn");
const listContainer = document.querySelector(".render-list");


let list = [];

function fetchDetails() {
  let date = "";
  addListBtn.addEventListener("click", () => {
    let task = inputTask.value;
    if (!task) return;
    if (today.checked) date = "today";
    if (tomorrow.checked) date = "tomorrow";
    if (selectDate.value) date = convertDateFormat(selectDate.value);
    if (!today.checked && !tomorrow.checked && !selectDate.value) {
      inputTask.value = "";
      return;
    }
    const listIndex = list.findIndex((list) => list.date === date);
    if (listIndex !== -1)
      list[listIndex].tasks.push({ task: task, complete: false });
    else list.push({ date: date, tasks: [{ task: task, complete: false }] });

    handleListRender(list);
    setLocalStorage();
    inputTask.value = "";
    today.checked = false;
    tomorrow.checked = false;
    selectDate.value = "";
  });
}

function handleListRender(data) {
  listContainer.innerHTML = "";
  if (data.length === 0)
    listContainer.insertAdjacentHTML(
      "afterbegin",
      "<h3>Your To-do's will be rendered here</h3>",
    );
  const markup = generateListCardMarkup(data);
  listContainer.insertAdjacentHTML("afterbegin", markup);
}

function generateListCardMarkup(data) {
  return ` <ul class="todo-list">
  ${data
    .map(
      (item, listIndex) => ` <li class="list-card" data-id=${listIndex}>
      <h4 class="card-header">${item.date}</h4>
      <ul class="card-list">
      ${item.tasks
        .map(
          (
            task,
            i,
          ) => ` <li class="list-description" data-id=${i}  data-checked=${task.complete}>
          <div class="list-item">
            <em>&#10004;</em>
            <p id="list-item-paragraph">${task.task}</p>
          </div>
          <div class="list-item-icons">
            <i class="ph ph-trash delete-icn"></i>
            <input type="checkbox" name="check" id="list-item-check" data-checked=${task.complete}/>
           
          </div>
        </li>`,
        )
        .join("")}
      </ul>
    </li>`,
    )
    .join("")}
  </ul>`;
}

function handleInputFeilds() {
  today.addEventListener("change", () => {
    today.checked = true;
    tomorrow.checked = false;
  });
  tomorrow.addEventListener("change", () => {
    tomorrow.checked = true;
    today.checked = false;
  });
  selectDate.addEventListener("click", () => {
    tomorrow.checked = false;
    today.checked = false;
  });
}

function setLocalStorage() {
  localStorage.setItem("list", JSON.stringify(list));
}

function getLocalStorage() {
  let data = JSON.parse(localStorage.getItem("list"));
  if (data) {
    list = data;
    handleListContainer();
    handleListRender(list);
    handleTaskStatus();
  }
}

function handleDelete() {
  listContainer.addEventListener("click", (e) => {
    const deleteIcon = e.target.closest(".delete-icn");
    if (!deleteIcon) return;
    let confirmation = confirm(
      "Are you sure? Clicking this will delete your To-do from the list",
    );
    if (confirmation) {
      const listItem = deleteIcon.closest(".list-description");
      const taskId = parseInt(listItem.dataset.id); // Convert to integer
      const listIndex = parseInt(listItem.closest(".list-card").dataset.id);
      list[listIndex].tasks.splice(taskId, 1);
      handleListContainer();
      handleListRender(list);
      setLocalStorage();
    }
  });
}
function handleTaskStatus() {
  listContainer.addEventListener("click", (e) => {
    let checkbox = e.target.closest("#list-item-check");
    if (!checkbox) return;
    const listItem = checkbox.closest(".list-description");
    const listIndex = parseInt(listItem.closest(".list-card").dataset.id);
    list[listIndex].tasks.complete = checkbox.checked;
    list[listIndex].tasks.complete
      ? listItem.classList.add("checked")
      : listItem.classList.remove("checked");
  });
}

function handleListContainer() {
  let filtered = list.filter((list) => list.tasks.length !== 0);
  filtered ? (list = filtered) : (list = []);
}

function convertDateFormat(dateString) {
  // Step 1: Create a Date object from the original string
  const dateObj = new Date(dateString);

  // Step 2: Extract day, month, and date from the Date object
  const day = dateObj.toLocaleString("en-US", { weekday: "short" });
  const month = dateObj.toLocaleString("en-US", { month: "short" });
  const date = dateObj.getDate();

  // Step 3: Convert day and month to the desired format
  const formattedDay = day;
  const formattedMonth = month;

  // Step 4: Combine the formatted day, month, and date to create the desired string
  return `${formattedDay} ${formattedMonth} ${date}`;
}

function init() {
  handleInputFeilds();
  fetchDetails();
  getLocalStorage();
  handleDelete();
  handleTaskStatus();
}

window.addEventListener("DOMContentLoaded", init);