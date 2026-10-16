document.getElementById('year').textContent = new Date().getFullYear();
const contactButton = document.getElementById('contact-button');
const contactNote = document.getElementById('contact-note');
contactButton.addEventListener('click', () => {
  const expanded = contactButton.getAttribute('aria-expanded') === 'true';
  contactButton.setAttribute('aria-expanded', String(!expanded));
  contactNote.hidden = expanded;
});
