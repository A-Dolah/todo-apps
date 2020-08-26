const addTodoForm = document.querySelector('.add__todo__form');
const titleInputField = document.querySelector('.add__todo__input__title');
const descInputField = document.querySelector('.add__todo__input__description');
const submitbutton = document.querySelector('.add__todo__submitbutton');
const todoList = document.querySelector('.todo__list');

let state = [];
let todoId = 0;

const setLocalStorage = () =>
  localStorage.setItem('state', JSON.stringify(state));

const handleSubmitButton = () =>
  !titleInputField.value || !descInputField.value
    ? submitbutton.setAttribute('disabled', 'disabled')
    : submitbutton.removeAttribute('disabled');

const resetInputFields = () => {
  titleInputField.value = '';
  descInputField.value = '';
};

const handleSubmitTodo = (event) => {
  event.preventDefault();
  const todo = {
    id: todoId,
    title: titleInputField.value,
    description: descInputField.value,
    done: false,
    dateCreated: new Date().toLocaleDateString(),
    deleted: false,
  };
  state.push(todo);
  setLocalStorage();
  window.dispatchEvent(new Event('statechange'));
  resetInputFields();
  handleSubmitButton();
  todoId += 1;
};

const handleDoneClick = (event) => {
  if (
    event.target.textContent === 'Remove' ||
    event.target.classList.contains('todo__list')
  )
    return;
  const clickedCard = event.target.classList.contains('card')
    ? event.target
    : event.target.parentNode;
  state[clickedCard.id].done = !state[clickedCard.id].done;
  setLocalStorage();
  window.dispatchEvent(new Event('statechange'));
};

const handleRemoveTodoClick = (event) => {
  const clickedCard = event.target.parentNode;
  state[clickedCard.id].deleted = true;
  setLocalStorage();
  window.dispatchEvent(new Event('statechange'));
};

const appendCardToDOM = (card) => todoList.appendChild(card);

const createLI = (id) => {
  const card = document.createElement('LI');
  card.setAttribute('id', `${id}`);
  card.classList.add('card');
  return card;
};

const createTodoCard = (todo) => {
  const { id, title, description, dateCreated } = todo;
  const card = createLI(id);
  card.innerHTML = `
            <h1>${title}</h1>
            <h2>${description}</h2>
            <p>Created: ${dateCreated}</p>
            `;
  appendCardToDOM(card);
};

const createCompletedTodoCard = (todo) => {
  const { id, title, description, dateCreated } = todo;
  const card = createLI(id);
  card.classList.add('is__done');
  card.innerHTML = `
      <button>Remove</button>
      <h1>${title}</h1>
      <h2>${description}</h2>
      <p>Created: ${dateCreated}</p> 
      `;
  appendCardToDOM(card);
  card.querySelector('button').addEventListener('click', handleRemoveTodoClick);
};

const renderTodos = () => {
  todoList.innerHTML = '';
  state
    .filter((todo) => !todo.done)
    .forEach((todo) => {
      createTodoCard(todo);
    });
  state
    .filter((todo) => todo.done && !todo.deleted)
    .forEach((todo) => {
      createCompletedTodoCard(todo);
    });
};

addTodoForm.addEventListener('keyup', handleSubmitButton);
addTodoForm.addEventListener('submit', handleSubmitTodo);
todoList.addEventListener('click', handleDoneClick);
window.addEventListener('statechange', renderTodos);

if (localStorage.state) {
  state = [...JSON.parse(localStorage.getItem('state'))];
  todoId = state.length;
  window.dispatchEvent(new Event('statechange'));
}
