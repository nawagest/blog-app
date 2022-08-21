const popup = document.querySelector('.popup');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const deleteForm = document.querySelector('.delete');
const deleteBtn = document.querySelectorAll('.delete-btn');

if(location.search === '?failed=true') {
    popup.classList.remove('hidden');
}

const closeModal = function() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}

const showModal = function() {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

deleteBtn.forEach((btn) => {
    btn.addEventListener('click', showModal);
});

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
});