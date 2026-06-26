// ── DATA ──
let students = JSON.parse(localStorage.getItem('students') || '[]');

// ── INIT ──
window.onload = () => renderAll();

// ── ADD STUDENT ──
function addStudent() {
  const nameInput  = document.getElementById('studentName');
  const gradeInput = document.getElementById('studentGrade');
  const errorMsg   = document.getElementById('errorMsg');

  const name  = nameInput.value.trim();
  const grade = parseFloat(gradeInput.value);

  // Validation
  if (!name) {
    errorMsg.textContent = '⚠️ Please enter a student name.';
    return;
  }
  if (isNaN(grade) || grade < 0 || grade > 100) {
    errorMsg.textContent = '⚠️ Grade must be a number between 0 and 100.';
    return;
  }

  errorMsg.textContent = '';

  students.push({ id: Date.now(), name, grade });
  saveData();
  renderAll();

  // Clear inputs
  nameInput.value  = '';
  gradeInput.value = '';
  nameInput.focus();

  showToast(`✅ "${name}" added successfully!`);
}

// ── DELETE STUDENT ──
function deleteStudent(id) {
  const student = students.find(s => s.id === id);
  students = students.filter(s => s.id !== id);
  saveData();
  renderAll();
  showToast(`🗑️ "${student.name}" removed.`);
}

// ── CLEAR ALL ──
function clearAll() {
  if (students.length === 0) return;
  if (!confirm('Are you sure you want to remove all students?')) return;
  students = [];
  saveData();
  renderAll();
  showToast('🗑️ All students cleared.');
}

// ── GET STATUS ──
function getStatus(grade) {
  if (grade >= 90) return { label: 'A — Excellent', cls: 'badge-A' };
  if (grade >= 80) return { label: 'B — Good',      cls: 'badge-B' };
  if (grade >= 70) return { label: 'C — Average',   cls: 'badge-C' };
  if (grade >= 50) return { label: 'D — Pass',      cls: 'badge-D' };
  return                  { label: 'F — Fail',      cls: 'badge-F' };
}

// ── RENDER TABLE ──
function renderTable() {
  const tbody        = document.getElementById('studentTableBody');
  const tableSection = document.getElementById('tableSection');
  const emptyState   = document.getElementById('emptyState');

  if (students.length === 0) {
    tableSection.style.display = 'none';
    emptyState.style.display   = 'block';
    return;
  }

  tableSection.style.display = 'block';
  emptyState.style.display   = 'none';

  tbody.innerHTML = students.map((s, i) => {
    const status = getStatus(s.grade);
    return `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${escapeHTML(s.name)}</strong></td>
        <td><strong>${s.grade.toFixed(1)}</strong></td>
        <td><span class="badge ${status.cls}">${status.label}</span></td>
        <td>
          <button class="btn-delete" onclick="deleteStudent(${s.id})" title="Remove student">🗑</button>
        </td>
      </tr>
    `;
  }).join('');
}

// ── RENDER STATS ──
function renderStats() {
  const statsSection = document.getElementById('statsSection');

  if (students.length === 0) {
    statsSection.style.display = 'none';
    return;
  }

  statsSection.style.display = 'grid';

  const grades  = students.map(s => s.grade);
  const total   = students.length;
  const avg     = grades.reduce((a, b) => a + b, 0) / total;
  const highest = Math.max(...grades);
  const lowest  = Math.min(...grades);
  const passed  = grades.filter(g => g >= 50).length;
  const failed  = total - passed;

  document.getElementById('statTotal').textContent  = total;
  document.getElementById('statAvg').textContent    = avg.toFixed(1);
  document.getElementById('statHigh').textContent   = highest.toFixed(1);
  document.getElementById('statLow').textContent    = lowest.toFixed(1);
  document.getElementById('statPassed').textContent = passed;
  document.getElementById('statFailed').textContent = failed;
}

// ── RENDER ALL ──
function renderAll() {
  renderStats();
  renderTable();
}

// ── SAVE TO LOCALSTORAGE ──
function saveData() {
  localStorage.setItem('students', JSON.stringify(students));
}

// ── TOAST NOTIFICATION ──
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── ESCAPE HTML (security) ──
function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── ENTER KEY SUPPORT ──
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') addStudent();
});
