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
  // Обработчик нажатия клавиш на физической клавиатуре
  document.addEventListener('keydown', function(event) {
    // Если игра активна
    if (gameState && gameState.gameStatus === 'playing') {
      // Предотвращаем прокрутку страницы при нажатии на клавиши, связанные с игрой
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        if (document.activeElement === document.body) {
          event.preventDefault();
        }
      }
      
      // Буквы русского алфавита
      if (/^[А-яЁё]$/.test(event.key)) {
        addLetter(event.key);
        
        // Анимация нажатия клавиши на экранной клавиатуре
        const key = document.querySelector(`.key[data-key="${event.key.toLowerCase()}"]`);
        if (key) {
          key.classList.add('key-pressed');
          setTimeout(() => key.classList.remove('key-pressed'), 150);
        }
      } 
      // Backspace для удаления букв
      else if (event.key === 'Backspace') {
        removeLetter();
        
        // Анимация нажатия клавиши на экранной клавиатуре
        const key = document.querySelector(`.key[data-key="Backspace"]`);
        if (key) {
          key.classList.add('key-pressed');
          setTimeout(() => key.classList.remove('key-pressed'), 150);
        }
      } 
      // Enter для отправки догадки
      else if (event.key === 'Enter') {
        submitGuess();
        
        // Анимация нажатия клавиши на экранной клавиатуре
        const key = document.querySelector(`.key[data-key="Enter"]`);
        if (key) {
          key.classList.add('key-pressed');
          setTimeout(() => key.classList.remove('key-pressed'), 150);
        }
      }
    }
  });

  // Обработчик для кнопок уровня сложности
  document.querySelectorAll('.difficulty-button').forEach(button => {
    button.addEventListener('click', function() {
      // Убираем активный класс со всех кнопок
      document.querySelectorAll('.difficulty-button').forEach(btn => btn.classList.remove('active'));
      
      // Добавляем активный класс к нажатой кнопке
      this.classList.add('active');
      
      // Получаем уровень сложности из data-атрибута
      const level = this.dataset.level;
      
      // Обновляем текущий уровень сложности
      switchDifficulty(level);
      
      // Добавляем эффект нажатия кнопки
      this.classList.add('pop');
      setTimeout(() => this.classList.remove('pop'), 300);
    });
  });

  // Обработчик для кнопки подсказки
  const hintButton = document.getElementById('hintButton');
  if (hintButton) {
    hintButton.addEventListener('click', function() {
      useHint();
      
      // Добавляем эффект нажатия
      this.classList.add('pop');
      setTimeout(() => this.classList.remove('pop'), 300);
    });
  }

  // Обработчик для кнопки "Новая игра"
  const newGameButton = document.getElementById('newGameButton');
  if (newGameButton) {
    newGameButton.addEventListener('click', function() {
      startNewGame();
      
      // Добавляем эффект нажатия
      this.classList.add('pop');
      setTimeout(() => this.classList.remove('pop'), 300);
    });
  }

  // Обработчик для кнопки мультиплеера
  const multiplayerToggle = document.getElementById('multiplayerToggle');
  if (multiplayerToggle) {
    multiplayerToggle.addEventListener('click', function() {
      toggleMultiplayerMode();
      
      // Добавляем эффект нажатия
      this.classList.add('pop');
      setTimeout(() => this.classList.remove('pop'), 300);
    });
  }

  // Обработчик для кнопки достижений
  const achievementsButton = document.getElementById('achievementsButton');
  if (achievementsButton) {
    achievementsButton.addEventListener('click', function() {
      showAchievements();
      
      // Добавляем эффект нажатия
      this.classList.add('pop');
      setTimeout(() => this.classList.remove('pop'), 300);
    });
  }

  // Обработчик для закрытия модальных окон
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      hideModal(modal.id);
    });
  });

  // Добавляем слушатель для обновления активной ячейки при клике
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('letter-box') && gameState && gameState.gameStatus === 'playing') {
      // Если клик был по ячейке, определяем её строку и колонку
      const row = parseInt(event.target.parentElement.dataset.row);
      const col = parseInt(event.target.dataset.col);
      
      // Если ячейка в текущей строке
      if (row === gameState.currentRow && col < gameState.currentGuess.length) {
        // Устанавливаем курсор на эту ячейку
        gameState.currentGuess = gameState.currentGuess.substring(0, col);
        
        // Очищаем ячейки после текущей
        for (let i = col; i < gameState.currentWord.length; i++) {
          const cell = document.querySelector(`.row[data-row="${row}"] .letter-box[data-col="${i}"]`);
          if (cell) {
            cell.textContent = '';
          }
        }
        
        // Обновляем активную ячейку
        updateActiveCell();
        
        // Анимация выбора ячейки
        event.target.classList.add('pop');
        setTimeout(() => event.target.classList.remove('pop'), 300);
      }
    }
  });

  // Инициализация игры
  initGame();
  
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

// Обработчик для кнопок уровня сложности
document.querySelectorAll('.difficulty-button').forEach(button => {
  button.addEventListener('click', function() {
    // Убираем активный класс со всех кнопок
    document.querySelectorAll('.difficulty-button').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Добавляем активный класс к нажатой кнопке
    this.classList.add('active');
    
    // Получаем уровень сложности из data-атрибута
    const level = this.dataset.level;
    
    // Обновляем текущий уровень сложности
    switchDifficulty(level);
    
    // Добавляем эффект нажатия кнопки
    this.classList.add('pop');
    setTimeout(() => {
      this.classList.remove('pop');
    }, 300);
  });
});

// Обработчик для кнопки подсказки
document.getElementById('hintButton').addEventListener('click', function() {
  useHint();
  
  // Добавляем эффект нажатия
  this.classList.add('pop');
  setTimeout(() => {
    this.classList.remove('pop');
  }, 300);
});

// Обработчик для кнопки "Новая игра"
document.getElementById('newGameButton').addEventListener('click', function() {
  startNewGame();
  
  // Добавляем эффект нажатия
  this.classList.add('pop');
  setTimeout(() => {
    this.classList.remove('pop');
  }, 300);
});

// Обработчик для кнопки мультиплеера
document.getElementById('multiplayerToggle').addEventListener('click', function() {
  toggleMultiplayerMode();
  
  // Добавляем эффект нажатия
  this.classList.add('pop');
  setTimeout(() => {
    this.classList.remove('pop');
  }, 300);
});

// Обработчик для кнопки достижений
document.getElementById('achievementsButton').addEventListener('click', function() {
  showAchievements();
  
  // Добавляем эффект нажатия
  this.classList.add('pop');
  setTimeout(() => {
    this.classList.remove('pop');
  }, 300);
});

// Обработчик для закрытия модальных окон
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const modal = this.closest('.modal');
    hideModal(modal.id);
  });
});

// Обновляем активность текущей ячейки
function updateActiveCell() {
  // Сначала удаляем класс active со всех ячеек
  document.querySelectorAll('.letter-box').forEach(cell => {
    cell.classList.remove('active');
  });
  
  // Если мы находимся в пределах возможных ячеек, добавляем класс active к текущей
  if (gameState.currentCol < gameState.currentWord.length && gameState.currentRow < gameState.maxAttempts) {
    const cell = document.querySelector(`.row[data-row="${gameState.currentRow}"] .letter-box[data-col="${gameState.currentCol}"]`);
    if (cell) {
      cell.classList.add('active');
    }
  }
}

// Функция для обработки анимированного показа достижений
function showAchievements() {
  // Получаем контейнер для списка достижений
  const container = document.querySelector('.achievements-list');
  container.innerHTML = '';
  
  // Получаем все достижения
  const achievements = getAllAchievements();
  
  // Добавляем каждое достижение с задержкой для анимации
  achievements.forEach((achievement, index) => {
    const element = document.createElement('div');
    element.classList.add('achievement');
    
    if (!achievement.unlocked) {
      element.classList.add('achievement-locked');
    }
    
    element.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-info">
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-description">${achievement.description}</div>
      </div>
    `;
    
    container.appendChild(element);
    
    // Анимируем появление элементов
    setTimeout(() => {
      element.classList.add('pop');
      setTimeout(() => {
        element.classList.remove('pop');
      }, 300);
    }, index * 100);
  });
  
  // Показываем модальное окно
  showModal('achievementsModal');
}

// Добавляем слушатель для обновления активной ячейки
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('letter-box')) {
    // Если клик был по ячейке, определяем её строку и колонку
    const row = parseInt(event.target.parentElement.dataset.row);
    const col = parseInt(event.target.dataset.col);
    
    // Если ячейка в текущей строке
    if (row === gameState.currentRow && col < gameState.currentCol) {
      // Устанавливаем курсор на эту ячейку
      gameState.currentCol = col;
      updateActiveCell();
      
      // Анимация выбора ячейки
      event.target.classList.add('pop');
      setTimeout(() => {
        event.target.classList.remove('pop');
      }, 300);
    }
  }
}); 