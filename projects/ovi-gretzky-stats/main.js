// Инициализация переменных
let isAnimating = false;
let animationInterval;
let maxGoals;

// Получение максимального значения голов для масштабирования графиков
function getMaxGoals() {
  let maxOvi = Math.max(...seasonsData.ovechkin.map(s => s.goals));
  let maxGretzky = Math.max(...seasonsData.gretzky.map(s => s.goals));
  return Math.max(maxOvi, maxGretzky);
}

// Создание визуализации голов по сезонам
function createGoalsBars(seasonsCount = 1) {
  const container = document.getElementById('goals-bars-container');
  container.innerHTML = '';
  
  // Определяем максимальное значение для масштабирования
  maxGoals = getMaxGoals();
  
  // Создаем строки с данными для каждого сезона
  for (let i = 0; i < seasonsCount; i++) {
    const oviSeason = seasonsData.ovechkin[i];
    const gretzkySeason = seasonsData.gretzky[i];
    
    // Создаем контейнер для сезона
    const seasonRow = document.createElement('div');
    seasonRow.className = 'season-row';
    
    // Метка сезона
    const seasonLabel = document.createElement('div');
    seasonLabel.className = 'season-label';
    seasonLabel.textContent = oviSeason.season;
    seasonRow.appendChild(seasonLabel);
    
    // Контейнер для полосок
    const barsContainer = document.createElement('div');
    barsContainer.className = 'bars-container';
    
    // Линия максимального значения
    const maxLine = document.createElement('div');
    maxLine.className = 'max-value-line';
    maxLine.setAttribute('title', `Максимум: ${maxGoals} голов`);
    barsContainer.appendChild(maxLine);
    
    // Полоска Овечкина
    const oviBarContainer = document.createElement('div');
    oviBarContainer.className = 'goals-bar-container';
    
    const oviBar = document.createElement('div');
    oviBar.className = 'goals-bar ovechkin';
    oviBar.style.width = `${(oviSeason.goals / maxGoals) * 100}%`;
    oviBar.textContent = oviSeason.goals;
    oviBarContainer.appendChild(oviBar);
    
    // Полоска Грецки
    const gretzkyBarContainer = document.createElement('div');
    gretzkyBarContainer.className = 'goals-bar-container';
    
    const gretzkyBar = document.createElement('div');
    gretzkyBar.className = 'goals-bar gretzky';
    gretzkyBar.style.width = `${(gretzkySeason.goals / maxGoals) * 100}%`;
    gretzkyBar.textContent = gretzkySeason.goals;
    gretzkyBarContainer.appendChild(gretzkyBar);
    
    // Добавляем полоски в контейнер
    barsContainer.appendChild(oviBarContainer);
    barsContainer.appendChild(gretzkyBarContainer);
    
    // Добавляем контейнер полосок в строку сезона
    seasonRow.appendChild(barsContainer);
    
    // Добавляем строку в основной контейнер
    container.appendChild(seasonRow);
    
    // Добавляем анимацию
    setTimeout(() => {
      oviBar.classList.add('animate-bar');
      gretzkyBar.classList.add('animate-bar');
    }, 100 * i);
  }
}

// График накопительных голов
let cumulativeGoalsChart;
function createCumulativeGoalsChart() {
  const ctx = document.getElementById('cumulative-goals-chart').getContext('2d');
  
  const oviSeasons = cumulativeData.ovechkin.map(s => s.season);
  const oviGoals = cumulativeData.ovechkin.map(s => s.goals);
  const gretzkyGoals = cumulativeData.gretzky.map(s => s.goals);
  
  cumulativeGoalsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: oviSeasons,
      datasets: [
        {
          label: 'Овечкин',
          data: oviGoals,
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--ovechkin-color'),
          backgroundColor: 'rgba(255, 0, 60, 0.1)',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.1,
          fill: true
        },
        {
          label: 'Грецки',
          data: gretzkyGoals,
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--gretzky-color'),
          backgroundColor: 'rgba(0, 64, 252, 0.1)',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.1,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: function(tooltipItems) {
              const index = tooltipItems[0].dataIndex;
              const oviSeason = cumulativeData.ovechkin[index].season;
              const gretzkySeason = cumulativeData.gretzky[index].season;
              return `После ${index + 1} сезонов (${oviSeason} / ${gretzkySeason})`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Голы (накопительно)',
            font: {
              weight: 'bold'
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Сезон',
            font: {
              weight: 'bold'
            }
          }
        }
      }
    }
  });
}

// Обработка слайдера сезонов
function setupSeasonSlider() {
  const slider = document.getElementById('season-slider');
  const currentSeasonElement = document.getElementById('current-season');
  const playButton = document.getElementById('play-btn');
  const resetButton = document.getElementById('reset-btn');
  
  // Обновление текста с текущим сезоном
  function updateSeasonText(value) {
    if (value === 1) {
      currentSeasonElement.textContent = `1 сезон (${seasonsData.ovechkin[0].season} для Овечкина / ${seasonsData.gretzky[0].season} для Грецки)`;
    } else {
      currentSeasonElement.textContent = `${value} сезонов (2005-${2005+value-1} для Овечкина / 1979-${1979+value-1} для Грецки)`;
    }
  }
  
  // Обработчик изменения слайдера
  slider.addEventListener('input', function() {
    const seasons = parseInt(this.value);
    updateSeasonText(seasons);
    createGoalsBars(seasons);
  });
  
  // Воспроизведение анимации
  playButton.addEventListener('click', function() {
    if (isAnimating) {
      clearInterval(animationInterval);
      playButton.innerHTML = '&#9658; Воспроизвести';
      isAnimating = false;
    } else {
      let currentSeason = parseInt(slider.value);
      if (currentSeason === 19) {
        currentSeason = 0;
      }
      
      playButton.innerHTML = '&#10074;&#10074; Пауза';
      isAnimating = true;
      
      animationInterval = setInterval(() => {
        currentSeason++;
        
        if (currentSeason > 19) {
          clearInterval(animationInterval);
          playButton.innerHTML = '&#9658; Воспроизвести';
          isAnimating = false;
          return;
        }
        
        slider.value = currentSeason;
        updateSeasonText(currentSeason);
        createGoalsBars(currentSeason);
      }, 1500); // интервал в 1.5 секунды между обновлениями
    }
  });
  
  // Сброс слайдера
  resetButton.addEventListener('click', function() {
    if (isAnimating) {
      clearInterval(animationInterval);
      playButton.innerHTML = '&#9658; Воспроизвести';
      isAnimating = false;
    }
    
    slider.value = 1; // начальное положение
    updateSeasonText(1);
    createGoalsBars(1);
  });
}

// Инициализация всего при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  createGoalsBars(1);  // Начинаем с одного сезона
  createCumulativeGoalsChart();
  setupSeasonSlider();
}); 