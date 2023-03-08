import * as icons from './utils/icons.js';

const tasksEl = document.getElementById('tasks');
const addButtonEl = document.getElementById('add-button');
const addInputEl = document.getElementById('add-input');

const savedTasks = localStorage.getItem('todoList');
const tasks = savedTasks ? JSON.parse(savedTasks) : [];

const actionTrashIcons = () => {
  document.querySelectorAll(`.trash-icon`).forEach(item => {
    const id = +item.dataset.taskId;
    item.addEventListener('click', () => {
      deleteTask(id);
      item.removeEventListener(`click`, actionTrashIcons());
    });
  });
};

const actionPencilIcons = () => {
  document.querySelectorAll(`.pencil-icon`).forEach(item => {
    const id = +item.dataset.taskId;
    const index = tasks.findIndex(task => task.id === id);
    item.addEventListener('click', () => {
      tasks[index].isEditable = true;
      renderTodoList();
      item.removeEventListener(`click`, actionPencilIcons());
    });
  });
};

const actionConfirmIcons = () => {
  document.querySelectorAll(`.confirm-icon`).forEach(item => {
    const id = +item.dataset.taskId;
    item.addEventListener('click', () => {
      const editInputEl = document.getElementById(`edit-input-${id}`);
      editTask(id, editInputEl.value);
      item.removeEventListener(`click`, actionConfirmIcons());
    });
  });
};

const renderTodoList = () => {
  tasksEl.innerHTML = tasks
    .map(
      task => `
  <div class="task-element flex items-center">
    ${icons.checkIcon}
    <div class="flex flex-col py-4">
    ${
      task.isEditable
        ? `<input type="text" id="edit-input-${task.id}" class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value="${task.text}">`
        : `<dd class="text-lg font-semibold">${task.text}</dd>`
    }
    </div>
    <div class="flex gap-4 ml-auto">
    ${task.isEditable ? icons.getConfirmIcon(task.id) : icons.getPencilIcon(task.id)}
      ${icons.getTrashIcon(task.id)}
      </svg>
    </div>
  </div>
  `
    )
    .join('');
  actionTrashIcons();
  actionPencilIcons();
  actionConfirmIcons();
  localStorage.setItem('todoList', JSON.stringify(tasks));
};

renderTodoList();
// ## ADD TASK

const addTask = text => {
  tasks.unshift({
    id: tasks.length,
    text,
    completed: false,
    isEditable: false,
  });
  renderTodoList();
};

addButtonEl.addEventListener('click', () => {
  addTask(addInputEl.value);
  addInputEl.value = '';
});

// ## EDIT TASK

const editTask = (id, text) => {
  const index = tasks.findIndex(item => item.id === id);
  tasks[index].text = text;
  tasks[index].isEditable = false;
  renderTodoList();
};

// ## REMOVE TASK

const deleteTask = id => {
  //Znajdź index pod którym jest obiekt ze wskazanym ID
  //Usuń ten element z tablicy
  const index = tasks.findIndex(task => task.id === id);
  tasks.splice(index, 1);
  renderTodoList();
};
