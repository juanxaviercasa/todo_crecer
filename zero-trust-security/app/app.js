'use strict';
const buttons=[...document.querySelectorAll('nav button')],views=[...document.querySelectorAll('.view')];
function show(id){buttons.forEach(button=>button.classList.toggle('active',button.dataset.view===id));views.forEach(view=>view.classList.toggle('active',view.id===id));history.replaceState(null,'',`#${id}`);document.querySelector('main').scrollTop=0;}
buttons.forEach(button=>button.addEventListener('click',()=>show(button.dataset.view)));
const initial=location.hash.slice(1);if(views.some(view=>view.id===initial))show(initial);
