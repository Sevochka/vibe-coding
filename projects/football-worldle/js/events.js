// Инициализация обработчиков событий для игры Football Worldle
document.addEventListener('DOMContentLoaded', () => {
  console.log('Инициализация игры Football Worldle');
  
  // Обработчик нажатия клавиш на физической клавиатуре
  document.addEventListener('keydown', (e) => {
    // Если открыто модальное окно, не обрабатываем клавиатуру
    if (document.querySelector('.modal.show')) return;
    
    if (gameState && gameState.gameStatus === 'playing') {
      const key = e.key.toUpperCase();
      
      // Обработка букв (кириллица)
      if (/^[А-ЯЁ]$/.test(key)) {
        addLetter(key);
        animateKeyPress(key);
      }
      
      // Обработка Backspace
      if (e.key === 'Backspace') {
        removeLetter();
        animateKeyPress('←');
      }
      
      // Обработка Enter
      if (e.key === 'Enter') {
        submitGuess();
        animateKeyPress('✓');
      }
      
      // Обработка underscore для многословных названий
      if (e.key === '_' || e.key === '-' || e.key === ' ') {
        addLetter('_');
        animateKeyPress('_');
      }
    }
  });

  // Обработка нажатий на экранную клавиатуру
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('key')) {
      const key = e.target.dataset.key;
      
      if (key === '←' || key === 'Backspace') {
        removeLetter();
      } else if (key === '✓' || key === 'Enter') {
        submitGuess();
      } else {
        addLetter(key);
      }
      
      animateKeyPress(key);
    }
  });

  // Обработка кнопок сложности
  document.querySelectorAll('.difficulty-button').forEach(button => {
    button.addEventListener('click', () => {
      // Убираем активный класс со всех кнопок
      document.querySelectorAll('.difficulty-button').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Добавляем активный класс на нажатую кнопку
      button.classList.add('active');
      
      // Переключаем сложность
      const level = button.dataset.level;
      switchDifficulty(level);
    });
  });

  // Обработка кнопки подсказки
  document.getElementById('hintButton').addEventListener('click', () => {
    useHint();
  });

  // Обработка кнопки новой игры
  document.getElementById('newGameButton').addEventListener('click', () => {
    startNewGame();
  });

  // Обработка переключения мультиплеера
  document.getElementById('multiplayerToggle').addEventListener('click', () => {
    gameState.multiplayerMode = !gameState.multiplayerMode;
    const multiplayerSection = document.querySelector('.multiplayer-section');
    
    if (gameState.multiplayerMode) {
      multiplayerSection.style.display = 'block';
      document.getElementById('multiplayerToggle').textContent = 'Режим одиночной игры';
      gameState.currentPlayer = 1;
      updatePlayerTurn();
      showMessage('Режим дуэли активирован!');
    } else {
      multiplayerSection.style.display = 'none';
      document.getElementById('multiplayerToggle').textContent = 'Режим дуэли';
      showMessage('Режим одиночной игры!');
    }
  });

  // Обработка кнопки достижений
  document.getElementById('achievementsButton').addEventListener('click', () => {
    showAchievements();
  });

  // Обработка закрытия модальных окон
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
      });
    });
  });

  // Клик вне модального окна для закрытия
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  });

  // Обработка клика по ячейке для выбора активной ячейки в текущей строке
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('letter-box') && gameState.gameStatus === 'playing') {
      const boardRows = document.querySelectorAll('.board .row');
      const currentRow = boardRows[gameState.currentRow];
      
      if (currentRow && currentRow.contains(e.target)) {
        const cells = currentRow.querySelectorAll('.letter-box');
        const clickedIndex = Array.from(cells).indexOf(e.target);
        
        // Если пользователь кликнул на ячейку после уже введенных букв или на пустую ячейку
        if (clickedIndex <= gameState.currentGuess.length) {
          // Устанавливаем фокус на эту ячейку (визуально)
          cells.forEach(cell => cell.classList.remove('active'));
          e.target.classList.add('active');
        }
      }
    }
  });

  // Инициализация игры при загрузке страницы
  try {
    console.log('Запуск инициализации игры');
    initGame();
  } catch (e) {
    console.error('Ошибка при инициализации игры:', e);
  }
});

// Анимация нажатия клавиши
function animateKeyPress(key) {
  const keyElement = document.querySelector(`.key[data-key="${key}"]`);
  if (keyElement) {
    keyElement.classList.add('key-pressed');
    setTimeout(() => {
      keyElement.classList.remove('key-pressed');
    }, 150);
  }
} 