// Отрисовка игрового поля
const renderBoard = () => {
  const board = document.querySelector('.board');
  board.innerHTML = '';
  
  // Определяем размер слова для отрисовки
  const wordLength = gameState.currentWord ? gameState.currentWord.length : 5;
  
  // Создаем строки и ячейки
  for (let i = 0; i < gameState.maxAttempts; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    row.dataset.row = i;
    
    for (let j = 0; j < wordLength; j++) {
      const letterBox = document.createElement('div');
      letterBox.className = 'letter-box';
      letterBox.dataset.col = j;
      row.appendChild(letterBox);
    }
    
    board.appendChild(row);
  }
  
  // Если есть предыдущие догадки, отображаем их
  if (gameState.guesses.length > 0) {
    gameState.guesses.forEach((guess, rowIndex) => {
      const result = checkGuess(guess);
      const row = document.querySelectorAll('.board .row')[rowIndex];
      
      [...guess.toUpperCase()].forEach((letter, colIndex) => {
        const letterBox = row.querySelectorAll('.letter-box')[colIndex];
        letterBox.textContent = letter;
        letterBox.classList.add(`letter-${result[colIndex]}`);
      });
    });
  }
  
  updateBoard();
  updateActiveCell();
};

// Отрисовка клавиатуры
const renderKeyboard = () => {
  createKeyboard();
};

// Обновление отображения текущей догадки на доске
const updateBoard = () => {
  const currentRow = document.querySelector(`.row[data-row="${gameState.currentRow}"]`);
  if (!currentRow) return;
  
  const letterBoxes = currentRow.querySelectorAll('.letter-box');
  const wordLength = gameState.currentWord.length;
  
  // Очищаем текущую строку
  letterBoxes.forEach(box => {
    box.textContent = '';
    if (!box.classList.contains('letter-correct')) {
      box.className = 'letter-box';
      box.dataset.col = box.dataset.col; // Сохраняем атрибут data-col
    }
  });
  
  // Заполняем текущую догадку
  [...gameState.currentGuess.toUpperCase()].forEach((letter, index) => {
    if (index < wordLength && letterBoxes[index]) {
      letterBoxes[index].textContent = letter;
    }
  });
};

// Анимация и раскраска результата проверки
const animateResult = (result) => {
  const currentRow = document.querySelectorAll('.board .row')[gameState.currentRow];
  const letterBoxes = currentRow.querySelectorAll('.letter-box');
  
  // Последовательная анимация каждой буквы
  [...gameState.currentGuess.toUpperCase()].forEach((letter, index) => {
    const letterBox = letterBoxes[index];
    
    // Задержка для последовательной анимации
    setTimeout(() => {
      letterBox.classList.add('pop');
      letterBox.classList.add(`letter-${result[index]}`);
      
      // Удаляем класс анимации после ее завершения
      setTimeout(() => {
        letterBox.classList.remove('pop');
      }, 300);
    }, index * 100);
  });
};

// Обновление статуса клавиатуры
const updateKeyboardStatus = (guess, result) => {
  [...guess.toUpperCase()].forEach((letter, index) => {
    // Если буква уже отмечена как correct, не меняем ее статус
    if (gameState.keyboardStatus[letter] === 'correct') return;
    
    // Иначе обновляем статус в соответствии с результатом
    if (result[index] === 'correct') {
      gameState.keyboardStatus[letter] = 'correct';
    } else if (result[index] === 'present' && gameState.keyboardStatus[letter] !== 'correct') {
      gameState.keyboardStatus[letter] = 'present';
    } else if (!gameState.keyboardStatus[letter]) {
      gameState.keyboardStatus[letter] = 'absent';
    }
  });
  
  updateKeyboardDisplay();
};

// Обновление отображения клавиатуры
const updateKeyboardDisplay = () => {
  document.querySelectorAll('.key').forEach(key => {
    const letter = key.textContent;
    if (letter.length === 1 && gameState.keyboardStatus[letter]) {
      key.classList.add(`key-${gameState.keyboardStatus[letter]}`);
    }
  });
};

// Анимация встряски текущей строки (ошибка)
const shakeCurrentRow = () => {
  const currentRow = document.querySelectorAll('.board .row')[gameState.currentRow];
  currentRow.classList.add('shake');
  
  setTimeout(() => {
    currentRow.classList.remove('shake');
  }, 500);
};

// Отображение сообщения игроку
const showMessage = (message) => {
  showToast(message);
};

// Функция для отображения уведомлений (toast)
const showToast = (message, duration = 3000) => {
  let toast = document.querySelector('.toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.classList.add('toast');
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  
  // Анимированное появление
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Скрытие через заданное время
  setTimeout(() => {
    toast.classList.remove('show');
    
    // Удаление элемента после скрытия
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
};

// Обновление табло
const updateScoreboard = () => {
  const playerScore = document.getElementById('playerScore');
  const goalkeeperScore = document.getElementById('goalkeeperScore');
  
  if (playerScore) playerScore.textContent = gameState.goalCount;
  if (goalkeeperScore) goalkeeperScore.textContent = gameState.saveCount;
};

// Обновление статуса игрока
const updatePlayerStatus = () => {
  const playerStatus = document.querySelector('.player-status');
  const currentLevel = document.querySelector('.current-level');
  const progressFill = document.querySelector('.progress-fill');
  
  if (currentLevel) {
    currentLevel.textContent = gameState.playerLevel.name;
  }
  
  if (playerStatus) {
    playerStatus.textContent = `${gameState.playerPoints} очков`;
  }
  
  if (progressFill) {
    // Находим текущий уровень и следующий
    const currentLevelIndex = difficultyLevels.findIndex(level => level.name === gameState.playerLevel.name);
    const nextLevel = difficultyLevels[currentLevelIndex + 1];
    
    if (nextLevel) {
      const currentPoints = gameState.playerPoints - gameState.playerLevel.points;
      const pointsToNextLevel = nextLevel.points - gameState.playerLevel.points;
      const progressPercentage = Math.min(100, (currentPoints / pointsToNextLevel) * 100);
      progressFill.style.width = `${progressPercentage}%`;
    } else {
      // Максимальный уровень
      progressFill.style.width = '100%';
    }
  }
};

// Обновляем активность текущей ячейки
const updateActiveCell = () => {
  // Сначала удаляем класс active со всех ячеек
  document.querySelectorAll('.letter-box').forEach(cell => {
    cell.classList.remove('active');
  });
  
  // Если мы находимся в пределах возможных ячеек, добавляем класс active к текущей
  if (gameState.currentRow < gameState.maxAttempts) {
    const row = document.querySelector(`.row[data-row="${gameState.currentRow}"]`);
    if (row) {
      const currentCol = gameState.currentGuess.length;
      if (currentCol < gameState.currentWord.length) {
        const cell = row.querySelector(`.letter-box[data-col="${currentCol}"]`);
        if (cell) {
          cell.classList.add('active');
        }
      }
    }
  }
};

// Обновление уровня игрока
const updatePlayerLevel = () => {
  // Находим уровень, соответствующий текущему количеству очков
  for (let i = difficultyLevels.length - 1; i >= 0; i--) {
    if (gameState.playerPoints >= difficultyLevels[i].points) {
      const newLevel = difficultyLevels[i];
      
      // Если это новый уровень
      if (gameState.playerLevel.name !== newLevel.name) {
        gameState.playerLevel = newLevel;
        showLevelUpMessage(newLevel);
        
        // Проверяем достижение за достижение уровня "Легенда"
        if (newLevel.name === "Легенда") {
          checkAchievement('golden_ball');
        }
      } else {
        gameState.playerLevel = newLevel;
      }
      
      break;
    }
  }
};

// Показать сообщение о повышении уровня
const showLevelUpMessage = (newLevel) => {
  showMessage(`Уровень повышен: ${newLevel.name}!`);
  
  // Создаем анимацию для уровня
  const levelElement = document.querySelector('.current-level');
  if (levelElement) {
    levelElement.classList.add('pop');
    setTimeout(() => {
      levelElement.classList.remove('pop');
    }, 300);
  }
};

// Обновление очереди хода в мультиплеере
const updatePlayerTurn = () => {
  const playerTurn = document.querySelector('.current-player');
  if (playerTurn) {
    playerTurn.textContent = `Игрок ${gameState.currentPlayer}`;
  }
};

// Показать результат игры
const showGameResult = (isWin) => {
  const modal = document.getElementById('resultModal');
  const modalTitle = document.querySelector('#resultModal .modal-title');
  const modalContent = document.querySelector('#resultModal .modal-content-inner');
  
  if (isWin) {
    modalTitle.textContent = 'ГОООООЛ!';
    modalContent.innerHTML = `
      <p>Вы угадали слово <strong>${gameState.currentWord}</strong> за ${gameState.currentRow + 1} попыток!</p>
      <p>Набрано очков: <strong>+${calculatePoints()}</strong></p>
      <p>Текущая серия: <strong>${gameState.streakCount}</strong></p>
      <div class="button-group">
        <button class="button" onclick="startNewGame()">Новая игра</button>
        <button class="button secondary" onclick="showAchievements()">Достижения</button>
      </div>
    `;
  } else {
    modalTitle.textContent = 'Сейв!';
    modalContent.innerHTML = `
      <p>Не удалось угадать слово. Правильный ответ: <strong>${gameState.currentWord}</strong></p>
      <div class="button-group">
        <button class="button" onclick="startNewGame()">Новая игра</button>
        <button class="button secondary" onclick="showAchievements()">Достижения</button>
      </div>
    `;
  }
  
  modal.classList.add('show');
};

// Закрыть модальное окно
const hideModal = (id) => {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('show');
  }
};

// Показать достижения
const showAchievements = () => {
  const modal = document.getElementById('achievementsModal');
  const achievementsList = document.querySelector('#achievementsModal .achievements-list');
  
  achievementsList.innerHTML = '';
  
  achievements.forEach(achievement => {
    const isUnlocked = gameState.earnedAchievements.includes(achievement.id);
    
    const achievementElement = document.createElement('div');
    achievementElement.className = `achievement ${isUnlocked ? '' : 'achievement-locked'}`;
    
    achievementElement.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-info">
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-description">${achievement.description}</div>
      </div>
    `;
    
    achievementsList.appendChild(achievementElement);
  });
  
  // Закрываем предыдущее модальное окно, если оно открыто
  hideModal('resultModal');
  
  // Открываем модальное окно с достижениями
  modal.classList.add('show');
};

// Показать тематический день
const showThemeDay = (theme) => {
  const themeDayElement = document.querySelector('.theme-day');
  const themeTitle = document.querySelector('.theme-title');
  const themeDescription = document.querySelector('.theme-description');
  
  if (!themeDayElement || !themeTitle || !themeDescription) return;
  
  let title, description;
  
  switch (theme) {
    case 'champions':
      title = 'День чемпионов';
      description = 'Сегодня угадываем имена чемпионов мира и их страны';
      break;
    case 'transfers':
      title = 'День трансферов';
      description = 'Сегодня угадываем имена футболистов и клубы, совершившие громкие трансферы';
      break;
    case 'stadiums':
      title = 'День стадионов';
      description = 'Сегодня угадываем названия известных футбольных стадионов';
      break;
    default:
      return;
  }
  
  themeTitle.textContent = title;
  themeDescription.textContent = description;
  themeDayElement.style.display = 'block';
};

// Создание клавиатуры с анимацией нажатия
const createKeyboard = () => {
  const keyboard = document.querySelector('.keyboard');
  keyboard.innerHTML = '';

  const rows = [
    ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ'],
    ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
    ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', 'Backspace', 'Enter']
  ];

  rows.forEach(row => {
    const rowElement = document.createElement('div');
    rowElement.classList.add('keyboard-row');
    
    row.forEach(letter => {
      const key = document.createElement('div');
      
      if (letter === 'Enter') {
        key.textContent = '✓';
        key.classList.add('key', 'wide');
        key.dataset.key = 'Enter';
      } else if (letter === 'Backspace') {
        key.textContent = '←';
        key.classList.add('key', 'wide');
        key.dataset.key = 'Backspace';
      } else {
        key.textContent = letter;
        key.classList.add('key');
        key.dataset.key = letter;
      }
      
      key.addEventListener('click', (e) => {
        // Добавляем класс для анимации нажатия
        key.classList.add('key-pressed');
        
        // Удаляем класс через время анимации
        setTimeout(() => {
          key.classList.remove('key-pressed');
        }, 150);
        
        if (letter === 'Enter') {
          submitGuess();
        } else if (letter === 'Backspace') {
          removeLetter();
        } else {
          addLetter(letter);
        }
      });
      
      rowElement.appendChild(key);
    });
    
    keyboard.appendChild(rowElement);
  });

  // Если есть сохраненный статус клавиатуры, применяем его
  if (gameState && Object.keys(gameState.keyboardStatus).length > 0) {
    updateKeyboardDisplay();
  }
};

// Функция для начала новой игры
const startNewGame = () => {
  // Закрыть все модальные окна
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('show');
  });
  
  // Сбросить состояние игры
  resetGameState();
  chooseRandomWord();
  
  // Перерисовываем доску и клавиатуру
  renderBoard();
  renderKeyboard();
  
  // Обновляем интерфейс
  updateScoreboard();
  updatePlayerStatus();
  
  // Если была тема дня, сохраняем ее
  if (gameState.currentTheme) {
    showThemeDay(gameState.currentTheme);
  }
  
  // Сбрасываем использование подсказки
  const hintButton = document.getElementById('hintButton');
  if (hintButton) {
    hintButton.disabled = false;
  }
  
  // Показываем сообщение
  showToast('Новая игра началась!');
  
  // Обновляем активную ячейку
  updateActiveCell();
}; 