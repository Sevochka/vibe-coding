// Заполнение профилей игроков
function populatePlayerProfiles() {
  // Овечкин
  document.getElementById('ovechkin-birth').textContent = playersData.ovechkin.birthDate;
  document.getElementById('ovechkin-country').textContent = playersData.ovechkin.birthPlace.split(', ')[1];
  document.getElementById('ovechkin-size').textContent = `${playersData.ovechkin.height} / ${playersData.ovechkin.weight}`;
  document.getElementById('ovechkin-position').textContent = playersData.ovechkin.position;
  document.getElementById('ovechkin-number').textContent = playersData.ovechkin.jerseyNumber;
  document.getElementById('ovechkin-career').textContent = playersData.ovechkin.careerYears;
  document.getElementById('ovechkin-games').textContent = comparisonData.ovechkin.totalGames;
  document.getElementById('ovechkin-goals').textContent = comparisonData.ovechkin.totalGoals;
  document.getElementById('ovechkin-assists').textContent = comparisonData.ovechkin.totalAssists;
  document.getElementById('ovechkin-points').textContent = comparisonData.ovechkin.totalPoints;
  document.getElementById('ovechkin-winning').textContent = comparisonData.ovechkin.winningGoals;
  document.getElementById('ovechkin-pp').textContent = comparisonData.ovechkin.powerPlayGoals;
  document.getElementById('ovechkin-sh').textContent = comparisonData.ovechkin.shortHandedGoals;
  
  // Грецки
  document.getElementById('gretzky-birth').textContent = playersData.gretzky.birthDate;
  document.getElementById('gretzky-country').textContent = playersData.gretzky.birthPlace.split(', ')[1];
  document.getElementById('gretzky-size').textContent = `${playersData.gretzky.height} / ${playersData.gretzky.weight}`;
  document.getElementById('gretzky-position').textContent = playersData.gretzky.position;
  document.getElementById('gretzky-number').textContent = playersData.gretzky.jerseyNumber;
  document.getElementById('gretzky-career').textContent = playersData.gretzky.careerYears;
  document.getElementById('gretzky-games').textContent = comparisonData.gretzky.totalGames;
  document.getElementById('gretzky-goals').textContent = comparisonData.gretzky.totalGoals;
  document.getElementById('gretzky-assists').textContent = comparisonData.gretzky.totalAssists;
  document.getElementById('gretzky-points').textContent = comparisonData.gretzky.totalPoints;
  document.getElementById('gretzky-winning').textContent = comparisonData.gretzky.winningGoals;
  document.getElementById('gretzky-pp').textContent = comparisonData.gretzky.powerPlayGoals;
  document.getElementById('gretzky-sh').textContent = comparisonData.gretzky.shortHandedGoals;
}

// График голов по сезонам
let goalsChart;
function createGoalsChart(seasonsCount = 19) {
  const ctx = document.getElementById('goals-chart').getContext('2d');
  
  // Получаем сезоны и данные для указанного количества сезонов
  const oviSeasons = seasonsData.ovechkin.slice(0, seasonsCount).map(s => s.season);
  const oviGoals = seasonsData.ovechkin.slice(0, seasonsCount).map(s => s.goals);
  const gretzkyGoals = seasonsData.gretzky.slice(0, seasonsCount).map(s => s.goals);
  
  // Если график уже существует, обновляем его данные
  if (goalsChart) {
    goalsChart.data.labels = oviSeasons;
    goalsChart.data.datasets[0].data = oviGoals;
    goalsChart.data.datasets[1].data = gretzkyGoals;
    goalsChart.update();
  } else {
    // Создаем новый график
    goalsChart = new Chart(ctx, {
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
            pointRadius: 4,
            tension: 0.1,
            fill: true
          },
          {
            label: 'Грецки',
            data: gretzkyGoals,
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--gretzky-color'),
            backgroundColor: 'rgba(0, 64, 252, 0.1)',
            borderWidth: 2,
            pointRadius: 4,
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
                const oviSeason = seasonsData.ovechkin[index].season;
                const gretzkySeason = seasonsData.gretzky[index].season;
                return `Сезон ${oviSeason} (Овечкин) / ${gretzkySeason} (Грецки)`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Голы',
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

// График накопительных очков
let cumulativePointsChart;
function createCumulativePointsChart() {
  const ctx = document.getElementById('cumulative-points-chart').getContext('2d');
  
  const oviSeasons = cumulativeData.ovechkin.map(s => s.season);
  const oviPoints = cumulativeData.ovechkin.map(s => s.points);
  const gretzkyPoints = cumulativeData.gretzky.map(s => s.points);
  
  cumulativePointsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: oviSeasons,
      datasets: [
        {
          label: 'Овечкин',
          data: oviPoints,
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--ovechkin-color'),
          backgroundColor: 'rgba(255, 0, 60, 0.1)',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.1,
          fill: true
        },
        {
          label: 'Грецки',
          data: gretzkyPoints,
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
            text: 'Очки (накопительно)',
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

// Создание таблицы сравнения
function createComparisonTable() {
  const comparisonContainer = document.getElementById('stats-comparison');
  
  // Категории для сравнения
  const comparisonCategories = [
    { name: 'Голы', oviValue: comparisonData.ovechkin.totalGoals, gretzkyValue: comparisonData.gretzky.totalGoals },
    { name: 'Передачи', oviValue: comparisonData.ovechkin.totalAssists, gretzkyValue: comparisonData.gretzky.totalAssists },
    { name: 'Очки', oviValue: comparisonData.ovechkin.totalPoints, gretzkyValue: comparisonData.gretzky.totalPoints },
    { name: 'Игры', oviValue: comparisonData.ovechkin.totalGames, gretzkyValue: comparisonData.gretzky.totalGames },
    { name: 'Победные голы', oviValue: comparisonData.ovechkin.winningGoals, gretzkyValue: comparisonData.gretzky.winningGoals },
    { name: 'Голы в большинстве', oviValue: comparisonData.ovechkin.powerPlayGoals, gretzkyValue: comparisonData.gretzky.powerPlayGoals },
    { name: 'Голы в меньшинстве', oviValue: comparisonData.ovechkin.shortHandedGoals, gretzkyValue: comparisonData.gretzky.shortHandedGoals },
    { name: 'Голы в пустые ворота', oviValue: comparisonData.ovechkin.emptyNetGoals, gretzkyValue: comparisonData.gretzky.emptyNetGoals }
  ];
  
  // Очищаем контейнер
  comparisonContainer.innerHTML = '';
  
  // Создаем строки сравнения
  comparisonCategories.forEach(category => {
    const max = Math.max(category.oviValue, category.gretzkyValue);
    const oviPercent = (category.oviValue / max) * 100;
    const gretzkyPercent = (category.gretzkyValue / max) * 100;
    
    const row = document.createElement('div');
    row.className = 'comparison-row';
    
    const label = document.createElement('div');
    label.className = 'comparison-label';
    label.textContent = category.name;
    
    const bars = document.createElement('div');
    bars.className = 'comparison-bars';
    
    const oviBar = document.createElement('div');
    oviBar.className = 'comparison-bar ovechkin animate-bar';
    oviBar.style.width = `${oviPercent}%`;
    
    const gretzkyBar = document.createElement('div');
    gretzkyBar.className = 'comparison-bar gretzky animate-bar';
    gretzkyBar.style.width = `${gretzkyPercent}%`;
    
    // В зависимости от того, кто лидирует, показываем соответствующий бар
    if (category.oviValue >= category.gretzkyValue) {
      bars.appendChild(oviBar);
    } else {
      bars.appendChild(gretzkyBar);
    }
    
    const values = document.createElement('div');
    values.className = 'comparison-values';
    values.innerHTML = `<span>${category.oviValue}</span><span>${category.gretzkyValue}</span>`;
    
    row.appendChild(label);
    row.appendChild(bars);
    row.appendChild(values);
    
    comparisonContainer.appendChild(row);
  });
}

// Обработка слайдера сезонов
let isAnimating = false;
let animationInterval;

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
    createGoalsChart(seasons);
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
        createGoalsChart(currentSeason);
      }, 1000); // интервал в 1 секунду между обновлениями
    }
  });
  
  // Сброс слайдера
  resetButton.addEventListener('click', function() {
    if (isAnimating) {
      clearInterval(animationInterval);
      playButton.innerHTML = '&#9658; Воспроизвести';
      isAnimating = false;
    }
    
    slider.value = 19; // полный диапазон
    updateSeasonText(19);
    createGoalsChart(19);
  });
}

// Инициализация всего при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  populatePlayerProfiles();
  createGoalsChart();
  createCumulativeGoalsChart();
  createCumulativePointsChart();
  createComparisonTable();
  setupSeasonSlider();
}); 