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

// Создание визуализации голов
function createGoalsChart(seasonsCount = 1) {
  const container = document.getElementById('goals-chart-container');
  container.innerHTML = '';
  
  // Определяем максимальное значение для масштабирования
  maxGoals = getMaxGoals();
  
  // Создаем оси координат
  createAxes(container, maxGoals, seasonsCount);
  
  // Создаем линии данных
  createDataLines(container, seasonsCount);
}

// Создание осей и сетки
function createAxes(container, maxGoals, seasonsCount) {
  // Округлим максимальное значение голов до ближайшего десятка вверх
  const roundedMaxGoals = Math.ceil(maxGoals / 10) * 10;
  
  // Ось X (сезоны)
  const xAxis = document.createElement('div');
  xAxis.className = 'x-axis';
  
  // Добавляем метки сезонов на оси X
  for (let i = 0; i <= seasonsCount; i++) {
    if (i % 2 === 0 || i === seasonsCount) { // Показываем каждый второй сезон для уменьшения нагромождения
      const percentage = (i / seasonsCount) * 100;
      
      const xLabel = document.createElement('div');
      xLabel.className = 'x-label';
      xLabel.textContent = i;
      xLabel.style.left = `${percentage}%`;
      xAxis.appendChild(xLabel);
      
      // Добавляем вертикальные линии сетки
      if (i > 0) {
        const gridLine = document.createElement('div');
        gridLine.className = 'grid-line vertical';
        gridLine.style.left = `${percentage}%`;
        container.appendChild(gridLine);
      }
    }
  }
  
  container.appendChild(xAxis);
  
  // Ось Y (голы)
  const yAxis = document.createElement('div');
  yAxis.className = 'y-axis';
  
  // Добавляем метки голов на оси Y
  const steps = 5; // количество шагов на оси Y
  
  for (let i = 0; i <= steps; i++) {
    const goalValue = Math.round(i * (roundedMaxGoals / steps));
    const percentage = 100 - (goalValue / roundedMaxGoals) * 100; // Инвертируем для оси Y (0 внизу)
    
    const yLabel = document.createElement('div');
    yLabel.className = 'y-label';
    yLabel.textContent = goalValue;
    yLabel.style.top = `${percentage}%`;
    yAxis.appendChild(yLabel);
    
    // Добавляем горизонтальные линии сетки
    const gridLine = document.createElement('div');
    gridLine.className = 'grid-line horizontal';
    gridLine.style.top = `${percentage}%`;
    container.appendChild(gridLine);
  }
  
  container.appendChild(yAxis);
}

// Создание линий данных
function createDataLines(container, seasonsCount) {
  // Получаем данные для указанного количества сезонов
  const oviData = [{ season: 0, goals: 0 }, ...seasonsData.ovechkin.slice(0, seasonsCount)];
  const gretzkyData = [{ season: 0, goals: 0 }, ...seasonsData.gretzky.slice(0, seasonsCount)];
  
  // Создаем SVG элемент для линий
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.zIndex = "2";
  
  // Создаем линии для Овечкина и Грецки
  const oviPath = createPath(oviData, "ovechkin");
  const gretzkyPath = createPath(gretzkyData, "gretzky");
  
  svg.appendChild(oviPath);
  svg.appendChild(gretzkyPath);
  container.appendChild(svg);
  
  // Добавляем точки и подписи
  addDataPoints(container, oviData, "ovechkin");
  addDataPoints(container, gretzkyData, "gretzky");
  
  // Добавляем анимацию
  setTimeout(() => {
    oviPath.classList.add('animate-line');
    gretzkyPath.classList.add('animate-line');
  }, 100);
  
  // Функция для создания пути (линии)
  function createPath(data, playerClass) {
    const path = document.createElementNS(svgNS, "path");
    path.classList.add("line-path", playerClass);
    
    let pathD = "";
    
    data.forEach((season, index) => {
      // Рассчитываем координаты точки (x - сезоны, y - голы)
      const x = (index / data.length) * 100;
      const y = 100 - (season.goals / maxGoals) * 100; // Инвертируем для оси Y
      
      if (index === 0) {
        pathD += `M ${x}% ${y}%`;
      } else {
        pathD += ` L ${x}% ${y}%`;
      }
    });
    
    path.setAttribute("d", pathD);
    return path;
  }
}

// Добавление точек данных
function addDataPoints(container, data, playerClass) {
  // Начинаем с индекса 1, так как индекс 0 - это начальная точка (0,0)
  for (let i = 1; i < data.length; i++) {
    const season = data[i];
    
    // Рассчитываем координаты точки
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (season.goals / maxGoals) * 100; // Инвертируем для оси Y
    
    // Создаем точку
    const point = document.createElement('div');
    point.className = `data-point ${playerClass} animate-fade`;
    point.style.left = `${x}%`;
    point.style.top = `${y}%`;
    point.style.animationDelay = `${i * 0.1}s`;
    container.appendChild(point);
    
    // Добавляем подписи к точкам
    const label = document.createElement('div');
    label.className = `point-label ${playerClass} animate-fade`;
    label.textContent = season.goals;
    label.style.left = `${x}%`;
    label.style.top = `${y}%`;
    label.style.animationDelay = `${i * 0.1 + 0.2}s`;
    container.appendChild(label);
  }
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
      currentSeasonElement.textContent = `1 сезон`;
    } else {
      currentSeasonElement.textContent = `${value} сезонов`;
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
    createGoalsChart(1);
  });
}

// Инициализация всего при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  createGoalsChart(1);  // Начинаем с одного сезона
  setupSeasonSlider();
}); 