// Обработчик клавиатурных событий
const handleKeydown = (e) => {
  if (gameState.gameStatus !== 'playing') return;
  
  // Буквы русского алфавита
  if (/^[А-яЁё]$/.test(e.key)) {
    addLetter(e.key.toUpperCase());
  } 
  // Специальный символ для пробела в составных словах
  else if (e.key === '_') {
    addLetter('_');
  }
  // Backspace для удаления букв
  else if (e.key === 'Backspace') {
    removeLetter();
  } 
  // Enter для отправки догадки
  else if (e.key === 'Enter') {
    submitGuess();
  }
};

// Инициализация обработчиков событий
const initEventListeners = () => {
  // Клавиатурные события
  document.addEventListener('keydown', handleKeydown);
  
  // Кнопка подсказки
  const hintButton = document.getElementById('hintButton');
  if (hintButton) {
    hintButton.addEventListener('click', useHint);
  }
  
  // Кнопки сложности
  const difficultyButtons = document.querySelectorAll('.difficulty-button');
  difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const level = button.dataset.level;
      switchDifficulty(level);
      
      // Обновляем стили кнопок
      difficultyButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
    });
  });
  
  // Кнопка переключения мультиплеера
  const multiplayerToggle = document.getElementById('multiplayerToggle');
  if (multiplayerToggle) {
    multiplayerToggle.addEventListener('click', toggleMultiplayerMode);
  }
  
  // Кнопки в модальных окнах
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });
  
  // Кнопка достижений
  const achievementsButton = document.getElementById('achievementsButton');
  if (achievementsButton) {
    achievementsButton.addEventListener('click', showAchievements);
  }
  
  // Кнопка новой игры
  const newGameButton = document.getElementById('newGameButton');
  if (newGameButton) {
    newGameButton.addEventListener('click', startNewGame);
  }
  
  // Закрытие модальных окон по клику вне контента
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  });
};

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  initGame();
  initEventListeners();
  
  // Пометка активной кнопки сложности
  const activeButton = document.querySelector(`.difficulty-button[data-level="${gameState.difficultyLevel}"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }
});

// Предотвращение прокрутки страницы при нажатии на клавиши, связанные с игрой
window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
    if (document.activeElement === document.body) {
      e.preventDefault();
    }
  }
}); 