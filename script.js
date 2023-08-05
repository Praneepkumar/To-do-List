"use strict";
const inputTask = document.getElementById("input-task");
const today = document.getElementById("today");
const tomorrow = document.getElementById("tomorrow");
const selectDate = document.getElementById("dateInput");
const addListBtn = document.querySelector(".add-list-btn");
const listContainer = document.querySelector(".list-container");

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
    listIndex !== -1
      ? list[listIndex].tasks.push({ task: task, complete: false })
      : list.push({ date: date, tasks: [{ task: task, complete: false }] });

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
  setLocalStorage();
}

function generateListCardMarkup(data) {
  return ` <div class="todo-list">
  ${data
    .map(
      (item, listIndex) => ` <div class="list-card" data-id=${listIndex}>
      <h4 class="card-header">${item.date}</h4>
      <ul class="card-list">
      ${item.tasks
        .map(
          (
            task,
            i,
          ) => ` <li class="list-description" data-id=${i}  data-checked=${task.complete}>
          <div class="list-item" >
            <em>&#10004;</em>
            <p id="list-item-paragraph ">${task.task}</p>
          </div>
          <div class="list-item-icons">
            <i class="ph ph-trash delete-icn"></i>
            <input type="checkbox" name="check" id="list-item-check" data-checked=${task.complete} />
           
          </div>
        </li>`,
        )
        .join("")}
      </ul>
    </div>`,
    )
    .join("")}
  </div>`;
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
      const taskId = Number(listItem.dataset.id);
      const listIndex = Number(listItem.closest(".list-card").dataset.id);
      list[listIndex].tasks.splice(taskId, 1);
      handleListContainer();
      handleListRender(list);
      setLocalStorage();
    }
  });
}

function handleTaskStatus() {
  const checkboxes = document.querySelectorAll("#list-item-check");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      let checkbox = e.target.closest("#list-item-check");
      if (!checkbox) return;

      const listIndex = Number(checkbox.closest(".list-card").dataset.id);
      const listDescriptionIndex = Number(
        checkbox.closest(".list-description").dataset.id,
      );

      const checkboxStatus = checkbox.checked ? true : false;
      list[listIndex].tasks[listDescriptionIndex].complete = checkboxStatus;
      checkboxStatus
        ? checkbox.closest(".list-description").classList.add("checked")
        : checkbox.closest(".list-description").classList.remove("checked");
      setLocalStorage();
    });
  });
}
function handleListContainer() {
  let filtered = list.filter((list) => list.tasks.length !== 0);
  filtered ? (list = filtered) : (list = []);
  setLocalStorage();
}

function convertDateFormat(dateString) {
  const dateObj = new Date(dateString);
  const day = dateObj.toLocaleString("en-US", { weekday: "short" });
  const month = dateObj.toLocaleString("en-US", { month: "short" });
  const date = dateObj.getDate();
  const formattedDay = day;
  const formattedMonth = month;
  return `${formattedDay} ${formattedMonth} ${date}`;
}

function init() {
  handleInputFeilds();
  fetchDetails();
  handleDelete();
  handleTaskStatus();
  getLocalStorage();
}

window.addEventListener("DOMContentLoaded", init);