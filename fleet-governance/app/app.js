'use strict';
const buttons=[...document.querySelectorAll('[data-view]')],views=[...document.querySelectorAll('[data-panel]')];
function show(name){for(const button of buttons){const active=button.dataset.view===name;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));}for(const view of views)view.hidden=view.dataset.panel!==name;}
for(const button of buttons)button.addEventListener('click',()=>show(button.dataset.view));show('overview');
