document.addEventListener('DOMContentLoaded', function() {
  // Инициализация карты
  const map = L.map('map').setView([50.0, 10.0], 4);

  // Добавление тайлов OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  // Получаем DOM-элементы для отображения информации о клубе
  const clubInfoElement = document.getElementById('club-info');
  const clubNameElement = document.getElementById('club-name');
  const clubCountryElement = document.getElementById('club-country');
  const clubLeagueElement = document.getElementById('club-league');
  const clubLogoElement = document.getElementById('club-logo-img');
  const clubTitlesElement = document.getElementById('club-titles');
  const closeBtn = document.querySelector('.close-btn');

  // Закрываем окно с информацией по клику на крестик
  closeBtn.addEventListener('click', function() {
    clubInfoElement.classList.add('hidden');
  });

  // Закрываем окно с информацией по клику вне окна
  document.addEventListener('click', function(event) {
    if (!clubInfoElement.contains(event.target) && 
        !event.target.classList.contains('club-marker') && 
        !event.target.closest('.club-marker')) {
      clubInfoElement.classList.add('hidden');
    }
  });

  // Создаем и добавляем маркеры клубов на карту
  champions.forEach(function(club) {
    // Создаем маркер с кастомной иконкой
    const markerSize = 32; // размер маркера
    
    const customIcon = L.divIcon({
      className: 'club-marker',
      html: `<img src="${club.logo}" alt="${club.champion}" style="background-color: ${club.color};">`,
      iconSize: [markerSize, markerSize],
      iconAnchor: [markerSize / 2, markerSize / 2]
    });

    // Добавляем маркер на карту
    const marker = L.marker(club.coordinates, { icon: customIcon }).addTo(map);
    
    // Добавляем обработчик события клика
    marker.on('click', function() {
      // Заполняем информацию о клубе
      clubNameElement.textContent = club.champion;
      clubCountryElement.textContent = club.country;
      clubLeagueElement.textContent = club.league;
      clubLogoElement.src = club.logo;
      clubLogoElement.alt = club.champion;
      clubTitlesElement.textContent = club.titles;
      
      // Отображаем окно с информацией
      clubInfoElement.classList.remove('hidden');
    });
    
    // Добавляем тултип с названием клуба
    marker.bindTooltip(club.champion, {
      direction: 'top',
      offset: [0, -16],
      className: 'club-tooltip'
    });
  });

  // Добавляем возможность изменения размера карты при изменении размера окна
  window.addEventListener('resize', function() {
    map.invalidateSize();
  });
}); 