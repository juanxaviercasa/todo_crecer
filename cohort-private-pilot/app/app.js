'use strict';const cards=[...document.querySelectorAll('[data-profile]')];cards.forEach(card=>card.addEventListener('click',()=>{location.href=card.dataset.profile}));
