(function(){
  'use strict';

  const STORAGE_KEY = 'micro-habit-tracker:v1';
  const MAX_HABITS = 7;
  const DAYS_VISIBLE = 14;

  /** Utils **/
  const todayISO = () => new Date().toISOString().slice(0,10);
  const isoFor = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return d.toISOString().slice(0,10); };
  const byDateAsc = (a,b) => a.date.localeCompare(b.date);

  function loadState(){
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch(_){}
    return { habits: (window.SEED_HABITS || []).map(h => ({...h, days: normalizeDays(h.days)})) };
  }
  function saveState(state){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(_){} }

  function normalizeDays(days){
    // Keep last DAYS_VISIBLE days window aligned to today
    const map = new Map(days.map(d => [d.date, d.value]));
    const arr = [];
    for (let i = DAYS_VISIBLE - 1; i >= 0; i--) {
      const ds = isoFor(i);
      arr.push({ date: ds, value: map.has(ds) ? map.get(ds) : 0 });
    }
    return arr.sort(byDateAsc);
  }

  function computeStreak(days){
    // 0-missed, 1-done, 2-skipped(neutral). Streak counts consecutive 1s, 2 doesn't reset
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      const v = days[i].value;
      if (v === 1) { streak += 1; continue; }
      if (v === 2) { continue; }
      if (v === 0) { break; }
    }
    return streak;
  }

  function nextState(v){
    // 0 -> 1 -> 2 -> 0
    return v === 0 ? 1 : v === 1 ? 2 : 0;
  }

  function ensureUpTo7(habits){ return habits.slice(0, MAX_HABITS); }

  /** Rendering **/
  const listEl = document.getElementById('habitList');
  const tpl = document.getElementById('habitRowTpl');
  const addBtn = document.getElementById('addHabitBtn');
  const exportBtn = document.getElementById('exportBtn');
  const importInput = document.getElementById('importInput');

  // Dialog elements
  const dialog = document.getElementById('habitDialog');
  const habitForm = document.getElementById('habitForm');
  const habitName = document.getElementById('habitName');
  const habitColor = document.getElementById('habitColor');
  const deleteHabitBtn = document.getElementById('deleteHabitBtn');
  const cancelDialog = document.getElementById('cancelDialog');
  const habitDialogTitle = document.getElementById('habitDialogTitle');

  let state = loadState();
  saveState(state);

  function render(){
    listEl.innerHTML = '';
    const habits = ensureUpTo7(state.habits);
    habits.forEach(habit => {
      const node = tpl.content.firstElementChild.cloneNode(true);
      const dot = node.querySelector('.dot'); dot.style.background = habit.color;
      const nameBtn = node.querySelector('.habit-name'); nameBtn.textContent = habit.name;
      nameBtn.addEventListener('click', () => openEdit(habit.id));

      // Grid days
      const grid = node.querySelector('.habit-grid');
      const days = normalizeDays(habit.days);
      habit.days = days; // sync
      const today = todayISO();

      days.forEach(d => {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.setAttribute('title', `${d.date}`);
        if (d.date === today) cell.classList.add('today');
        cell.dataset.date = d.date;
        applyCellState(cell, d.value, habit.color);
        cell.addEventListener('click', () => {
          const newVal = nextState(d.value);
          d.value = newVal;
          applyCellState(cell, newVal, habit.color);
          updateHabit(habit.id, { days });
        });
        grid.appendChild(cell);
      });

      // Streak
      const streakEl = node.querySelector('.streak b');
      streakEl.textContent = computeStreak(days).toString();

      // Mini chart
      const canvas = document.createElement('canvas');
      canvas.className = 'mini-chart';
      node.appendChild(canvas);
      drawSparkline(canvas, days, habit.color);

      listEl.appendChild(node);
    });
  }

  function applyCellState(cell, v, color){
    cell.classList.remove('done','skipped','missed');
    if (v === 1) { cell.classList.add('done'); cell.style.borderColor = color; }
    else if (v === 2) { cell.classList.add('skipped'); }
    else { cell.classList.add('missed'); }
  }

  function drawSparkline(canvas, days, color){
    // Value mapping: 0 -> 0, 2 -> 0.5, 1 -> 1
    const values = days.map(d => d.value === 1 ? 1 : d.value === 2 ? 0.5 : 0);
    const dpr = window.devicePixelRatio || 1;
    const widthCss = canvas.clientWidth || canvas.parentElement.clientWidth;
    const heightCss = 36;
    canvas.width = Math.max(60, Math.floor(widthCss * dpr));
    canvas.height = Math.floor(heightCss * dpr);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0,0,widthCss,heightCss);

    // Background grid
    ctx.strokeStyle = '#eee'; ctx.lineWidth = 1;
    for (let i=1;i<4;i++){ const y = (heightCss/4)*i; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(widthCss,y); ctx.stroke(); }

    // Line
    const step = widthCss / (values.length - 1);
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
    values.forEach((v,i) => {
      const x = i * step;
      const y = heightCss - v * (heightCss - 6) - 3; // padding
      if (i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();

    // Fill under line with light tint
    ctx.lineTo(widthCss, heightCss); ctx.lineTo(0, heightCss); ctx.closePath();
    ctx.fillStyle = hexToRgba(color, 0.12);
    ctx.fill();
  }

  function hexToRgba(hex, a){
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return `rgba(0,199,139,${a})`;
    const r = parseInt(m[1],16), g = parseInt(m[2],16), b = parseInt(m[3],16);
    return `rgba(${r},${g},${b},${a})`;
  }

  /** Dialog Logic **/
  let editingId = null;
  function openCreate(){
    editingId = null;
    habitDialogTitle.textContent = 'Новая привычка';
    habitName.value = '';
    habitColor.value = '#00c78b';
    deleteHabitBtn.hidden = true;
    dialog.showModal();
  }
  function openEdit(id){
    editingId = id;
    const habit = state.habits.find(h => h.id === id);
    habitDialogTitle.textContent = 'Редактировать привычку';
    habitName.value = habit.name;
    habitColor.value = habit.color;
    deleteHabitBtn.hidden = false;
    dialog.showModal();
  }

  addBtn.addEventListener('click', () => {
    if (state.habits.length >= MAX_HABITS) { alert('Максимум 7 привычек'); return; }
    openCreate();
  });

  cancelDialog.addEventListener('click', () => dialog.close());

  habitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = habitName.value.trim();
    const color = habitColor.value;
    if (!name) return;
    if (editingId){
      updateHabit(editingId, { name, color });
    } else {
      const id = (crypto?.randomUUID?.() || ('h-'+Math.random().toString(36).slice(2)));
      const days = normalizeDays([]);
      state.habits.push({ id, name, color, days });
      saveState(state); render();
    }
    dialog.close();
  });

  deleteHabitBtn.addEventListener('click', () => {
    if (!editingId) return;
    state.habits = state.habits.filter(h => h.id !== editingId);
    saveState(state); render();
    dialog.close();
  });

  function updateHabit(id, patch){
    const idx = state.habits.findIndex(h => h.id === id); if (idx < 0) return;
    state.habits[idx] = { ...state.habits[idx], ...patch };
    state.habits[idx].days = normalizeDays(state.habits[idx].days);
    saveState(state);
    // Update streak without full re-render for small perf
    const row = listEl.children[idx];
    if (row){
      const streakEl = row.querySelector('.streak b');
      streakEl.textContent = computeStreak(state.habits[idx].days).toString();
      const canvas = row.querySelector('canvas.mini-chart');
      if (canvas) drawSparkline(canvas, state.habits[idx].days, state.habits[idx].color);
    } else {
      render();
    }
  }

  /** Export / Import **/
  exportBtn.addEventListener('click', () => {
    const data = JSON.stringify(ensureUpTo7(state.habits));
    const blob = new Blob([data], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'micro-habit-tracker.json';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });

  importInput.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error('Неверный формат');
      const sanitized = data.slice(0, MAX_HABITS).map(h => ({
        id: typeof h.id === 'string' ? h.id : (crypto?.randomUUID?.() || ('h-'+Math.random().toString(36).slice(2))),
        name: String(h.name || 'Без названия').slice(0, 40),
        color: /^#([0-9a-f]{6})$/i.test(h.color || '') ? h.color : '#00c78b',
        days: normalizeDays(Array.isArray(h.days) ? h.days.map(d => ({ date: String(d.date), value: Number(d.value)||0 })) : [])
      }));
      state.habits = sanitized; saveState(state); render();
    } catch(err){ alert('Не удалось импортировать JSON'); }
    finally { importInput.value = ''; }
  });

  // Initial render
  render();

  // Rerender charts on resize for crispness
  let rAF; window.addEventListener('resize', () => { cancelAnimationFrame(rAF); rAF = requestAnimationFrame(render); });
})();

