const wlLink = 'https://winline.ru/?utm_source=special-winline-top-matches-banner&utm_medium=banner&utm_campaign=top-matches';

const elMatches = document.getElementById('matches');

function createBadge(text, type) {
  const el = document.createElement('div');
  el.className = `badge ${type}`;
  el.textContent = text.slice(0, 2).toUpperCase();
  return el;
}

function fmtTime(date) {
  const d = new Date(date);
  const dd = d.getDate();
  const months = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
  const hh = String(d.getHours()).padStart(2,'0');
  const mm = String(d.getMinutes()).padStart(2,'0');
  return `${dd} ${months[d.getMonth()]} ${hh}:${mm}`;
}

function renderMatches() {
  elMatches.innerHTML = '';
  matches.forEach((m, idx) => {
    const card = document.createElement('article');
    card.className = 'match-card';
    card.setAttribute('role','button');
    card.onclick = () => window.open(wlLink, '_blank', 'noopener');

    const row = document.createElement('div');
    row.className = 'match-row';

    const left = document.createElement('div');
    left.className = 'team';
    left.appendChild(createBadge(m.home, 'home'));
    const hn = document.createElement('div'); hn.className = 'team-name'; hn.textContent = m.home; left.appendChild(hn);

    const right = document.createElement('div');
    right.className = 'team';
    right.appendChild(createBadge(m.away, 'away'));
    const an = document.createElement('div'); an.className = 'team-name'; an.textContent = m.away; right.appendChild(an);

    const center = document.createElement('div');
    center.className = 'center';

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `<span>${m.tournament}</span><span class="dot"></span><span>${fmtTime(m.startAt)}</span><span class="dot"></span><span class="countdown" id="cd-${idx}"></span>`;

    const cta = document.createElement('button');
    cta.className = 'play-cta pulse';
    cta.setAttribute('aria-label','Смотреть матч на Winline');
    cta.innerHTML = `<span class="play">▶</span> Смотреть бесплатно`;
    cta.onclick = (e) => { e.stopPropagation(); window.open(wlLink, '_blank', 'noopener'); };

    center.append(meta, cta);
    row.append(left, center, right);

    const odds = document.createElement('div');
    odds.className = 'odds';

    const maxOdd = Math.max(m.odds.p1, m.odds.x, m.odds.p2);
    const mk = [
      { label: 'П1', val: m.odds.p1 },
      { label: 'Х',  val: m.odds.x },
      { label: 'П2', val: m.odds.p2 }
    ];
    mk.forEach(k => {
      const b = document.createElement('button');
      b.textContent = `${k.label} ${Number(k.val).toFixed(2)}`;
      if (k.val === maxOdd) b.classList.add('hot');
      b.onclick = (e) => { e.stopPropagation(); window.open(wlLink, '_blank', 'noopener'); };
      odds.appendChild(b);
    });

    card.append(row, odds);
    elMatches.appendChild(card);
  });
}

function updateCountdowns() {
  matches.forEach((m, idx) => {
    const el = document.getElementById(`cd-${idx}`);
    if (!el) return;
    const now = new Date();
    const start = new Date(m.startAt);
    const diff = start - now;
    if (diff <= 0) {
      el.textContent = 'идёт матч';
      el.style.color = '#ff3d00';
      return;
    }
    const h = Math.floor(diff / 36e5);
    const mnt = Math.floor((diff % 36e5) / 6e4);
    el.textContent = `через ${h} ч ${String(mnt).padStart(2,'0')} м`;
  });
}

document.getElementById('ctaBig').onclick = () => window.open(wlLink, '_blank', 'noopener');

renderMatches();
updateCountdowns();
setInterval(updateCountdowns, 1000 * 30);


