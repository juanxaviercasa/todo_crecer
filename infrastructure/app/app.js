'use strict';
const buttons = [...document.querySelectorAll('nav button')];
const views = [...document.querySelectorAll('.view')];
buttons.forEach(button => button.addEventListener('click', () => {
  buttons.forEach(item => item.classList.toggle('active', item === button));
  views.forEach(view => {
    view.hidden = view.id !== button.dataset.view;
    view.classList.toggle('active', view.id === button.dataset.view);
  });
  document.querySelector('.content').scrollTop = 0;
}));
