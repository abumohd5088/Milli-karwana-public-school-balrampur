// utils.js
function getStored(key, def = []) {
  return JSON.parse(localStorage.getItem(key)) || def;
}

function setStored(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function saveUserSession(data) {
  localStorage.setItem('session', JSON.stringify({ ...data, time: Date.now() }));
}

function getUser() {
  return JSON.parse(localStorage.getItem('user')) || {};
}

// Dark Mode
document.getElementById('mode-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}
