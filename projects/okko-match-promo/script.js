document.addEventListener('DOMContentLoaded', () => {
  // Инициализация обратного отсчета
  initCountdown();
  
  // Добавление обработчика для кнопки просмотра
  const watchButton = document.querySelector('.match-widget__cta');
  watchButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(matchData.matchInfo.streamingService.watchLink, '_blank');
  });
});

// Функция для инициализации обратного отсчета
function initCountdown() {
  const countdownEl = document.querySelector('.match-widget__countdown');
  const matchDate = new Date(matchData.matchInfo.date);
  
  // Функция для обновления отсчета
  function updateCountdown() {
    const now = new Date();
    const diff = matchDate - now;
    
    // Если матч уже начался, показываем "LIVE"
    if (diff <= 0) {
      countdownEl.innerHTML = `<div class="match-widget__countdown-live">LIVE</div>`;
      return;
    }
    
    // Расчет оставшегося времени
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Обновление HTML
    countdownEl.innerHTML = `
      ${days > 0 ? `
        <div class="match-widget__countdown-item">
          <span class="match-widget__countdown-value">${days}</span>
          <span class="match-widget__countdown-label">дн.</span>
        </div>
      ` : ''}
      <div class="match-widget__countdown-item">
        <span class="match-widget__countdown-value">${hours < 10 ? '0' + hours : hours}</span>
        <span class="match-widget__countdown-label">час.</span>
      </div>
      <div class="match-widget__countdown-item">
        <span class="match-widget__countdown-value">${minutes < 10 ? '0' + minutes : minutes}</span>
        <span class="match-widget__countdown-label">мин.</span>
      </div>
      <div class="match-widget__countdown-item">
        <span class="match-widget__countdown-value">${seconds < 10 ? '0' + seconds : seconds}</span>
        <span class="match-widget__countdown-label">сек.</span>
      </div>
    `;
  }
  
  // Обновляем счетчик каждую секунду
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Форматирование даты для отображения
function formatMatchDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const month = monthNames[date.getMonth()];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  return `${day} ${month}, ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}

// Скрипт для resize.js
const projectSlug = 'okko-match-promo';
const resize = () => {
  const dataUTILS = {
    for: 'BASIC_TEST',
    action: 'resizeIframe',
    selector: `iframe[src*=\\/projects\\/${projectSlug}]`,
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