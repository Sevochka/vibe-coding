// Инициализация переменных
let isAnimating = false;
let animationInterval;

// Создание визуализации накопительных голов
function createGoalsChart(seasonsCount = 19) {
  const container = document.getElementById('goals-chart-container');
  container.innerHTML = '';
  
  // Получаем данные для отображения
  const oviData = cumulativeData.ovechkin.slice(0, seasonsCount + 1);
  const gretzkyData = cumulativeData.gretzky.slice(0, seasonsCount + 1);
  
  // Находим максимальное значение голов для масштабирования
  const maxGoals = Math.max(
    oviData[oviData.length - 1].goals,
    gretzkyData[gretzkyData.length - 1].goals
  );
  
  // Добавляем ось X с метками сезонов
  createSeasonAxis(container, seasonsCount);
  
  // Добавляем вертикальные линии сетки
  createGridLines(container, seasonsCount);
  
  // Создаем SVG для линий графика
  const svg = createSvgElement(container, maxGoals, oviData, gretzkyData);
  
  // Добавляем точки и подписи
  addDataPoints(container, oviData, 'ovechkin', maxGoals);
  addDataPoints(container, gretzkyData, 'gretzky', maxGoals);
  
  // Добавляем анимацию
  setTimeout(() => {
    const paths = svg.querySelectorAll('.line-path');
    paths.forEach(path => path.classList.add('animate-line'));
  }, 100);
}

// Создание оси X с метками сезонов
function createSeasonAxis(container, seasonsCount) {
  const xAxis = document.createElement('div');
  xAxis.className = 'x-axis';
  
  // Добавляем метки сезонов
  for (let i = 0; i <= seasonsCount; i++) {
    // Показываем каждый сезон
    const percentage = (i / seasonsCount) * 100;
    
    const xLabel = document.createElement('div');
    xLabel.className = 'x-label';
    xLabel.textContent = i;
    xLabel.style.left = `${percentage}%`;
    xAxis.appendChild(xLabel);
  }
  
  container.appendChild(xAxis);
}

// Создание вертикальных линий сетки
function createGridLines(container, seasonsCount) {
  for (let i = 1; i <= seasonsCount; i++) {
    const percentage = (i / seasonsCount) * 100;
    
    const gridLine = document.createElement('div');
    gridLine.className = 'grid-line vertical';
    gridLine.style.left = `${percentage}%`;
    container.appendChild(gridLine);
  }
}

// Создание SVG элемента с линиями графика
function createSvgElement(container, maxGoals, oviData, gretzkyData) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  
  // Создаем линии для Овечкина и Грецки
  svg.appendChild(createPath(oviData, 'ovechkin', maxGoals, svgNS));
  svg.appendChild(createPath(gretzkyData, 'gretzky', maxGoals, svgNS));
  
  container.appendChild(svg);
  return svg;
}

// Создание линии (path) для графика
function createPath(data, playerClass, maxGoals, svgNS) {
  const path = document.createElementNS(svgNS, "path");
  path.classList.add("line-path", playerClass);
  
  // Формируем путь линии
  let pathD = "";
  const totalSeasons = data.length - 1; // вычитаем 1, т.к. у нас есть сезон 0
  
  data.forEach((point, index) => {
    // Вычисляем координаты
    const x = (point.season / totalSeasons) * 100;
    const y = 100 - (point.goals / maxGoals) * 90; // оставляем отступ сверху
    
    if (index === 0) {
      pathD += `M ${x}% ${y}%`;
    } else {
      pathD += ` L ${x}% ${y}%`;
    }
  });
  
  path.setAttribute("d", pathD);
  return path;
}

// Добавление точек и подписей к графику
function addDataPoints(container, data, playerClass, maxGoals) {
  const totalSeasons = data.length - 1;
  
  // Пропускаем первую точку (0,0)
  for (let i = 1; i < data.length; i++) {
    const point = data[i];
    
    // Вычисляем координаты
    const x = (point.season / totalSeasons) * 100;
    const y = 100 - (point.goals / maxGoals) * 90; // оставляем отступ сверху
    
    // Создаем точку
    const pointElement = document.createElement('div');
    pointElement.className = `data-point ${playerClass}`;
    pointElement.style.left = `${x}%`;
    pointElement.style.top = `${y}%`;
    container.appendChild(pointElement);
    
    // Добавляем подпись с количеством голов
    const label = document.createElement('div');
    label.className = `point-label ${playerClass}`;
    label.textContent = point.goals;
    label.style.left = `${x}%`;
    label.style.top = `${y}%`;
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
      let currentSeason = 1; // Начинаем с первого сезона
      slider.value = currentSeason;
      updateSeasonText(currentSeason);
      createGoalsChart(currentSeason);
      
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
      }, 600); // интервал для анимации
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  createGoalsChart(19); // Сразу показываем все 19 сезонов
  setupSeasonSlider();
}); 