class ShotsAnimation {
  constructor() {
    this.field = document.querySelector('.football-field');
    this.currentShotIndex = 0;
    this.isPlaying = false;
    this.animationSpeed = 1500; // миллисекунды между ударами
    this.shotElements = [];
    
    this.init();
  }

  init() {
    this.createFieldLines();
    this.renderStats();
    this.setupControls();
    this.createLegend();
  }

  createFieldLines() {
    const fieldLines = document.createElement('div');
    fieldLines.className = 'field-lines';
    
    // Центральная линия
    const centerLine = document.createElement('div');
    centerLine.className = 'center-line';
    fieldLines.appendChild(centerLine);
    
    // Центральный круг
    const centerCircle = document.createElement('div');
    centerCircle.className = 'center-circle';
    fieldLines.appendChild(centerCircle);
    
    // Штрафные площади
    const leftPenalty = document.createElement('div');
    leftPenalty.className = 'penalty-area left';
    fieldLines.appendChild(leftPenalty);
    
    const rightPenalty = document.createElement('div');
    rightPenalty.className = 'penalty-area right';
    fieldLines.appendChild(rightPenalty);
    
    // Вратарские площади
    const leftGoal = document.createElement('div');
    leftGoal.className = 'goal-area left';
    fieldLines.appendChild(leftGoal);
    
    const rightGoal = document.createElement('div');
    rightGoal.className = 'goal-area right';
    fieldLines.appendChild(rightGoal);
    
    this.field.appendChild(fieldLines);
  }

  renderStats() {
    const statsContainer = document.querySelector('.stats-container');
    
    // Статистика домашней команды
    const homeStats = document.createElement('div');
    homeStats.className = 'team-stats home';
    homeStats.innerHTML = `
      <h3 class="team-name">${matchStats.homeTeam.name}</h3>
      <div class="stat-item">
        <span>Всего ударов</span>
        <span class="stat-value">${matchStats.homeTeam.totalShots}</span>
      </div>
      <div class="stat-item">
        <span>Удары в створ</span>
        <span class="stat-value">${matchStats.homeTeam.shotsOnTarget}</span>
      </div>
      <div class="stat-item">
        <span>Заблокированные</span>
        <span class="stat-value">${matchStats.homeTeam.blockedShots}</span>
      </div>
      <div class="stat-item">
        <span>Сейвы</span>
        <span class="stat-value">${matchStats.homeTeam.saves}</span>
      </div>
    `;
    
    // Статистика гостевой команды
    const awayStats = document.createElement('div');
    awayStats.className = 'team-stats away';
    awayStats.innerHTML = `
      <h3 class="team-name">${matchStats.awayTeam.name}</h3>
      <div class="stat-item">
        <span>Всего ударов</span>
        <span class="stat-value">${matchStats.awayTeam.totalShots}</span>
      </div>
      <div class="stat-item">
        <span>Удары в створ</span>
        <span class="stat-value">${matchStats.awayTeam.shotsOnTarget}</span>
      </div>
      <div class="stat-item">
        <span>Заблокированные</span>
        <span class="stat-value">${matchStats.awayTeam.blockedShots}</span>
      </div>
      <div class="stat-item">
        <span>Сейвы</span>
        <span class="stat-value">${matchStats.awayTeam.saves}</span>
      </div>
    `;
    
    statsContainer.appendChild(homeStats);
    statsContainer.appendChild(awayStats);
  }

  setupControls() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    playBtn.addEventListener('click', () => this.play());
    pauseBtn.addEventListener('click', () => this.pause());
    resetBtn.addEventListener('click', () => this.reset());
  }

  createLegend() {
    const legend = document.querySelector('.legend');
    
    legend.innerHTML = `
      <div class="legend-item">
        <div class="legend-color home"></div>
        <span>${matchStats.homeTeam.name}</span>
      </div>
      <div class="legend-item">
        <div class="legend-color away"></div>
        <span>${matchStats.awayTeam.name}</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: white; border: 1px solid #ccc;"></div>
        <span>В створ</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: transparent; border: 2px solid #666;"></div>
        <span>Блокирован</span>
      </div>
    `;
  }

  calculateArrowAngle(shot) {
    const target = shot.team === 'home' ? goalCoordinates.away : goalCoordinates.home;
    const deltaX = target.x - shot.x;
    const deltaY = target.y - shot.y;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  }

  createShotArrow(shot) {
    const arrow = document.createElement('div');
    arrow.className = `shot-arrow ${shot.team}`;
    
    const angle = this.calculateArrowAngle(shot);
    
    arrow.style.left = `${shot.x}%`;
    arrow.style.top = `${shot.y}%`;
    arrow.style.transform = `rotate(${angle}deg)`;
    
    const color = shot.team === 'home' ? matchStats.homeTeam.color : matchStats.awayTeam.color;
    
    arrow.innerHTML = `
      <svg viewBox="0 0 40 8" fill="none">
        <path d="M1 4L39 4M35 1L39 4L35 7" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    
    return arrow;
  }

  createShotPoint(shot) {
    const point = document.createElement('div');
    point.className = `shot-point ${shot.team} ${shot.type}`;
    
    point.style.left = `${shot.x}%`;
    point.style.top = `${shot.y}%`;
    
    if (shot.team === 'home') {
      point.style.backgroundColor = matchStats.homeTeam.color;
    } else {
      point.style.backgroundColor = matchStats.awayTeam.color;
    }
    
    return point;
  }

  animateShot(shot) {
    const arrow = this.createShotArrow(shot);
    const point = this.createShotPoint(shot);
    
    this.field.appendChild(arrow);
    this.field.appendChild(point);
    
    this.shotElements.push({ arrow, point });
    
    // Анимация стрелки
    setTimeout(() => {
      arrow.classList.add('animate');
    }, 50);
    
    // Анимация точки через небольшую задержку
    setTimeout(() => {
      point.classList.add('animate');
    }, 200);
  }

  play() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    document.getElementById('playBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;
    
    this.playNextShot();
  }

  playNextShot() {
    if (!this.isPlaying || this.currentShotIndex >= shotsData.length) {
      this.pause();
      return;
    }
    
    const shot = shotsData[this.currentShotIndex];
    this.animateShot(shot);
    
    this.currentShotIndex++;
    
    if (this.currentShotIndex < shotsData.length) {
      setTimeout(() => this.playNextShot(), this.animationSpeed);
    } else {
      this.pause();
    }
  }

  pause() {
    this.isPlaying = false;
    document.getElementById('playBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
  }

  reset() {
    this.pause();
    this.currentShotIndex = 0;
    
    // Удаляем все элементы выстрелов
    this.shotElements.forEach(({ arrow, point }) => {
      if (arrow.parentNode) arrow.parentNode.removeChild(arrow);
      if (point.parentNode) point.parentNode.removeChild(point);
    });
    
    this.shotElements = [];
    
    document.getElementById('resetBtn').disabled = false;
  }

  // Автоматический запуск через 2 секунды после загрузки
  autoStart() {
    setTimeout(() => {
      this.play();
    }, 2000);
  }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  const animation = new ShotsAnimation();
  animation.autoStart();
});

// Resize observer для адаптивности
const resize = () => {
  const dataUTILS = {
    for: 'BASIC_TEST',
    action: 'resizeIframe',
    selector: `iframe[src*=\\/projects\\/football-shots-animation]`,
    sizes: {
      height: 2 * Math.floor(document.body.scrollHeight / 2) + 10,
    },
  };

  window?.top?.postMessage(JSON.stringify(dataUTILS), '*');
}

const resizeObserver = new ResizeObserver(() => {
  resize();
});
resizeObserver.observe(document.body);
resize(); 