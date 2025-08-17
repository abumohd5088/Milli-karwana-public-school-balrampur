// =============================
// ✅ Data Initialization
// =============================
function initStorage() {
  if (!localStorage.getItem('homework')) {
    localStorage.setItem('homework', JSON.stringify([]));
  }
  if (!localStorage.getItem('notes')) {
    localStorage.setItem('notes', JSON.stringify([]));
  }
  if (!localStorage.getItem('timetables')) {
    const tt = {};
    for (let i = 1; i <= 12; i++) tt[i] = Array(6).fill('');
    localStorage.setItem('timetables', JSON.stringify(tt));
  }
  if (!localStorage.getItem('results')) {
    const res = {};
    for (let i = 1; i <= 12; i++) res[i] = {};
    localStorage.setItem('results', JSON.stringify(res));
  }
  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', '540'); // Default
  }
}

// =============================
// ✅ Dashboard Logic
// =============================
function loadDashboard() {
  const name = localStorage.getItem('studentName') || 'Student';
  const cls = localStorage.getItem('studentClass') || 'X';

  document.getElementById('greet-name').textContent = name;
  document.getElementById('greet-class').textContent = cls;

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // Load Homework
  const hw = JSON.parse(localStorage.getItem('homework')).filter(h => h.class === cls || h.class === "All");
  const hwList = document.getElementById('homework-list');
  hwList.innerHTML = hw.length ? '' : '<li>No homework assigned.</li>';
  hw.forEach(h => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${h.subject}</strong>: ${h.title}<br><small>Due: ${h.due}</small><p>${h.desc}</p>`;
    hwList.appendChild(li);
  });

  // Load Notes
  const notes = JSON.parse(localStorage.getItem('notes')).filter(n => n.class === cls || n.class === "All");
  const notesList = document.getElementById('notes-list');
  notesList.innerHTML = notes.length ? '' : '<li>No notes available.</li>';
  notes.forEach(n => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${n.subject}:</strong> ${n.title}<p>${n.content}</p>`;
    notesList.appendChild(li);
  });

  // Load Timetable
  const tt = JSON.parse(localStorage.getItem('timetables'))[cls];
  const ttContent = document.getElementById('timetable-content');
  const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'];
  ttContent.innerHTML = '<table>';
  periods.forEach((p, i) => {
    ttContent.innerHTML += `<tr><td><strong>${p}</strong></td><td>${tt[i] || 'Free'}</td></tr>`;
  });
  ttContent.innerHTML += '</table>';

  // Load Results
  const results = JSON.parse(localStorage.getItem('results'))[cls];
  const resultsContent = document.getElementById('results-content');
  if (Object.keys(results).length === 0) {
    resultsContent.innerHTML = '<p>No results published yet.</p>';
  } else {
    resultsContent.innerHTML = '<table>';
    for (const [sub, mark] of Object.entries(results)) {
      const grade = mark >= 90 ? 'A+' : mark >= 80 ? 'A' : mark >= 70 ? 'B' : mark >= 60 ? 'C' : 'F';
      resultsContent.innerHTML += `<tr><td><strong>${sub}</strong></td><td>${mark}/100</td><td>Grade: ${grade}</td></tr>`;
    }
    resultsContent.innerHTML += '</table>';
  }

  // Admin FAB
  document.getElementById('admin-fab').onclick = () => {
    if (confirm("Go to admin panel?")) {
      window.location.href = 'admin.html';
    }
  };
}

// =============================
// ✅ Admin Panel Logic
// =============================
function adminLogin() {
  document.getElementById('login-btn').onclick = () => {
    const pass = document.getElementById('admin-pass').value;
    if (pass === 'Abutalha') {
      document.getElementById('admin-login-screen').style.display = 'none';
      document.getElementById('admin-panel').style.display = 'block';
      loadAdminPanel();
    } else {
      alert('❌ Wrong password!');
    }
  };

  document.getElementById('logout-btn').onclick = () => {
    if (confirm("Logout?")) {
      document.getElementById('admin-panel').style.display = 'none';
      document.getElementById('admin-login-screen').style.display = 'flex';
      document.getElementById('admin-pass').value = '';
    }
  };
}

function loadAdminPanel() {
  // Stats
  const hw = JSON.parse(localStorage.getItem('homework'));
  const notes = JSON.parse(localStorage.getItem('notes'));
  document.getElementById('stat-hw').textContent = hw.length;
  document.getElementById('stat-notes').textContent = notes.length;
  document.getElementById('stat-students').textContent = localStorage.getItem('students') || '0';

  // Add Homework
  document.getElementById('add-hw').onclick = () => {
    const cls = document.getElementById('hw-class').value || "All";
    const subject = document.getElementById('hw-subject').value;
    const title = document.getElementById('hw-title').value.trim();
    const desc = document.getElementById('hw-desc').value.trim();
    const due = document.getElementById('hw-due').value;

    if (!title || !desc || !due) {
      alert("All fields are required!");
      return;
    }

    const homework = JSON.parse(localStorage.getItem('homework'));
    homework.push({ class: cls, subject, title, desc, due });
    localStorage.setItem('homework', JSON.stringify(homework));
    alert("✅ Homework added!");
    document.getElementById('hw-title').value = '';
    document.getElementById('hw-desc').value = '';
    loadAdminStats();
    renderManageItems();
  };

  // Add Note
  document.getElementById('add-note').onclick = () => {
    const cls = document.getElementById('note-class').value || "All";
    const subject = document.getElementById('note-subject').value;
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();

    if (!title || !content) {
      alert("Title and content are required!");
      return;
    }

    const notes = JSON.parse(localStorage.getItem('notes'));
    notes.push({ class: cls, subject, title, content });
    localStorage.setItem('notes', JSON.stringify(notes));
    alert("✅ Note added!");
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    loadAdminStats();
    renderManageItems();
  };

  // Timetable
  const ttClass = document.getElementById('tt-class');
  const ttInputs = document.querySelectorAll('#timetable-editor input');
  ttClass.onchange = () => {
    const tt = JSON.parse(localStorage.getItem('timetables'))[ttClass.value];
    ttInputs.forEach((inp, i) => inp.value = tt[i] || '');
  };
  document.getElementById('save-tt').onclick = () => {
    const tt = JSON.parse(localStorage.getItem('timetables'));
    const cls = ttClass.value;
    const newTT = [];
    ttInputs.forEach(inp => newTT.push(inp.value.trim()));
    tt[cls] = newTT;
    localStorage.setItem('timetables', JSON.stringify(tt));
    alert("✅ Timetable saved!");
  };

  // Results
  const resultClass = document.getElementById('result-class');
  const resultInputs = document.querySelectorAll('#result-editor input');
  resultClass.onchange = () => {
    const results = JSON.parse(localStorage.getItem('results'))[resultClass.value];
    resultInputs.forEach(inp => {
      const sub = inp.dataset.sub;
      inp.value = results[sub] || '';
    });
  };
  document.getElementById('save-results').onclick = () => {
    const results = JSON.parse(localStorage.getItem('results'));
    const cls = resultClass.value;
    const newResults = {};
    resultInputs.forEach(inp => {
      const sub = inp.dataset.sub;
      const val = inp.value;
      if (val) newResults[sub] = parseInt(val);
    });
    results[cls] = newResults;
    localStorage.setItem('results', JSON.stringify(results));
    alert("✅ Results saved!");
  };

  // Render Manage Items
  renderManageItems();
}

function renderManageItems() {
  const hwList = document.getElementById('manage-hw');
  const noteList = document.getElementById('manage-notes');
  const homework = JSON.parse(localStorage.getItem('homework'));
  const notes = JSON.parse(localStorage.getItem('notes'));

  hwList.innerHTML = '';
  homework.forEach((h, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${h.class}: <strong>${h.subject}</strong> - ${h.title} <button data-id="${i}" class="del-hw">🗑️</button>`;
    hwList.appendChild(li);
  });

  noteList.innerHTML = '';
  notes.forEach((n, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${n.class}: <strong>${n.subject}</strong> - ${n.title} <button data-id="${i}" class="del-note">🗑️</button>`;
    noteList.appendChild(li);
  });

  // Delete handlers
  document.querySelectorAll('.del-hw').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const hw = JSON.parse(localStorage.getItem('homework'));
      hw.splice(id, 1);
      localStorage.setItem('homework', JSON.stringify(hw));
      renderManageItems();
      loadAdminStats();
    };
  });

  document.querySelectorAll('.del-note').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const notes = JSON.parse(localStorage.getItem('notes'));
      notes.splice(id, 1);
      localStorage.setItem('notes', JSON.stringify(notes));
      renderManageItems();
      loadAdminStats();
    };
  });
}

function loadAdminStats() {
  const hw = JSON.parse(localStorage.getItem('homework'));
  const notes = JSON.parse(localStorage.getItem('notes'));
  document.getElementById('stat-hw').textContent = hw.length;
  document.getElementById('stat-notes').textContent = notes.length;
}

// =============================
// ✅ INIT
// =============================
(function () {
  initStorage();

  if (window.location.pathname.includes('dashboard.html')) {
    loadDashboard();
  }

  if (window.location.pathname.includes('admin.html')) {
    adminLogin();
  }
})();
