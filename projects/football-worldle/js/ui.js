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
    
    for (let j = 0; j < wordLength; j++) {
      const letterBox = document.createElement('div');
      letterBox.className = 'letter-box';
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
};

// Отрисовка клавиатуры
const renderKeyboard = () => {
  const keyboard = document.querySelector('.keyboard');
  keyboard.innerHTML = '';
  
  const rows = [
    ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ'],
    ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
    ['Backspace', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', 'Enter']
  ];
  
  rows.forEach(row => {
    const keyboardRow = document.createElement('div');
    keyboardRow.className = 'keyboard-row';
    
    row.forEach(key => {
      const keyElement = document.createElement('div');
      keyElement.className = 'key';
      
      if (key === 'Enter' || key === 'Backspace') {
        keyElement.classList.add('wide');
        keyElement.textContent = key === 'Enter' ? '⏎' : '⌫';
      } else {
        keyElement.textContent = key;
      }
      
      keyElement.addEventListener('click', () => {
        if (key === 'Enter') {
          submitGuess();
        } else if (key === 'Backspace') {
          removeLetter();
        } else if (key === '_') { // Для спец. символа пробел
          addLetter('_');
        } else {
          addLetter(key);
        }
      });
      
      keyboardRow.appendChild(keyElement);
    });
    
    keyboard.appendChild(keyboardRow);
  });
  
  // Если есть сохраненный статус клавиатуры, применяем его
  if (Object.keys(gameState.keyboardStatus).length > 0) {
    updateKeyboardDisplay();
  }
};

// Обновление отображения текущей догадки на доске
const updateBoard = () => {
  const currentRow = document.querySelectorAll('.board .row')[gameState.currentRow];
  if (!currentRow) return;
  
  const letterBoxes = currentRow.querySelectorAll('.letter-box');
  const wordLength = gameState.currentWord.length;
  
  // Очищаем текущую строку
  letterBoxes.forEach(box => {
    box.textContent = '';
    if (!box.classList.contains('letter-correct')) {
      box.className = 'letter-box';
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
  const toast = document.querySelector('.toast');
  if (!toast) {
    const newToast = document.createElement('div');
    newToast.className = 'toast';
    document.body.appendChild(newToast);
  }
  
  const toastElement = document.querySelector('.toast');
  toastElement.textContent = message;
  toastElement.classList.add('show');
  
  setTimeout(() => {
    toastElement.classList.remove('show');
  }, 2000);
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
const closeModal = () => {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('show');
  });
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
  closeModal();
  
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

// Установка случайного тематического дня
const setRandomThemeDay = () => {
  const themes = ['champions', 'transfers', 'stadiums'];
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  
  gameState.currentTheme = randomTheme;
  
  // Сохраняем тему дня
  const today = new Date().toLocaleDateString('ru-RU');
  localStorage.setItem('themeDay', today);
  localStorage.setItem('currentTheme', randomTheme);
  
  // Обновляем игру с новой темой
  resetGameState();
  chooseRandomWord();
  
  // Показываем тему дня
  showThemeDay(randomTheme);
};

// Создание анимации гола
const createGoalAnimation = () => {
  const stadium = document.querySelector('.stadium');
  if (!stadium) return;
  
  // Создаем мяч
  const ball = document.createElement('div');
  ball.className = 'ball';
  ball.style.left = '50%';
  ball.style.bottom = '20px';
  stadium.appendChild(ball);
  
  // Анимируем движение мяча
  setTimeout(() => {
    ball.style.bottom = '120px';
    ball.style.left = Math.random() > 0.5 ? '30%' : '70%';
    
    // Добавляем анимацию гола
    setTimeout(() => {
      ball.classList.add('goal-animation');
      
      // Удаляем мяч после анимации
      setTimeout(() => {
        ball.remove();
      }, 1000);
    }, 300);
  }, 100);
};

// Создание анимации сейва
const createSaveAnimation = () => {
  const stadium = document.querySelector('.stadium');
  if (!stadium) return;
  
  // Создаем мяч
  const ball = document.createElement('div');
  ball.className = 'ball';
  ball.style.left = '50%';
  ball.style.bottom = '20px';
  stadium.appendChild(ball);
  
  // Анимируем движение мяча
  setTimeout(() => {
    ball.style.bottom = '80px';
    ball.style.left = Math.random() > 0.5 ? '30%' : '70%';
    
    // Добавляем анимацию сейва
    setTimeout(() => {
      ball.classList.add('save-animation');
      
      // Удаляем мяч после анимации
      setTimeout(() => {
        ball.remove();
      }, 1000);
    }, 300);
  }, 100);
};

// Показать анимацию "замены" (подсказки)
const showSubstitutionAnimation = () => {
  const substitutionCard = document.createElement('div');
  substitutionCard.className = 'substitution-card';
  substitutionCard.innerHTML = `
    <div class="card-inner">
      <div class="player-number">↑↓</div>
      <div class="substitution-text">ЗАМЕНА</div>
    </div>
  `;
  document.body.appendChild(substitutionCard);
  
  // Анимируем появление и исчезновение карточки
  setTimeout(() => {
    substitutionCard.classList.add('show');
    
    setTimeout(() => {
      substitutionCard.classList.remove('show');
      
      setTimeout(() => {
        substitutionCard.remove();
      }, 500);
    }, 1500);
  }, 100);
};

// Проверка на достижения
const checkAchievements = () => {
  // Первый гол
  if (gameState.goalCount === 1) {
    checkAchievement('first_goal');
  }
  
  // Хет-трик (три слова подряд)
  if (gameState.streakCount >= 3) {
    checkAchievement('hat_trick');
  }
  
  // Сухой матч (слово с первой попытки)
  if (gameState.currentRow === 0) {
    checkAchievement('clean_sheet');
  }
  
  // Супер сейв (слово на последней попытке)
  if (gameState.currentRow === gameState.maxAttempts - 1) {
    checkAchievement('super_save');
  }
  
  // Лига Чемпионов (500+ очков)
  if (gameState.playerPoints >= 500) {
    checkAchievement('champions_league');
  }
  
  // Золотая бутса (10+ слов подряд)
  if (gameState.streakCount >= 10) {
    checkAchievement('golden_boot');
  }
  
  // Контроль мяча (5 слов без подсказок)
  // Для этого нужно отслеживать серию игр без подсказок отдельно
  const gamesWithoutHint = localStorage.getItem('gamesWithoutHint') || 0;
  if (!gameState.usedHint) {
    localStorage.setItem('gamesWithoutHint', Number(gamesWithoutHint) + 1);
    if (Number(gamesWithoutHint) + 1 >= 5) {
      checkAchievement('ball_control');
    }
  } else {
    localStorage.setItem('gamesWithoutHint', 0);
  }
};

// Проверка на конкретное достижение
const checkAchievement = (achievementId) => {
  if (gameState.earnedAchievements.includes(achievementId)) return;
  
  const achievement = achievements.find(a => a.id === achievementId);
  if (achievement) {
    gameState.earnedAchievements.push(achievementId);
    showAchievementUnlocked(achievement);
    saveGameProgress();
  }
};

// Показать анимацию разблокированного достижения
const showAchievementUnlocked = (achievement) => {
  const achievementToast = document.createElement('div');
  achievementToast.className = 'achievement-toast';
  achievementToast.innerHTML = `
    <div class="achievement-icon">${achievement.icon}</div>
    <div class="achievement-info">
      <div class="achievement-title">Достижение разблокировано!</div>
      <div class="achievement-name">${achievement.name}</div>
    </div>
  `;
  
  document.body.appendChild(achievementToast);
  
  setTimeout(() => {
    achievementToast.classList.add('show');
    
    setTimeout(() => {
      achievementToast.classList.remove('show');
      
      setTimeout(() => {
        achievementToast.remove();
      }, 500);
    }, 3000);
  }, 100);
};

// Предоставить тактическую подсказку
const provideTacticalHint = () => {
  if (gameState.gameStatus !== 'playing' || gameState.guesses.length === 0) return;
  
  const lastGuess = gameState.guesses[gameState.guesses.length - 1].toUpperCase();
  const targetWord = gameState.currentWord.toUpperCase();
  
  // Находим наибольшее расстояние между буквами
  let maxDistance = 0;
  let isCloseOverall = true;
  
  for (let i = 0; i < lastGuess.length; i++) {
    if (lastGuess[i] === targetWord[i]) continue; // Пропускаем правильные буквы
    
    // Находим расстояние между буквами в алфавите
    const lastGuessCode = lastGuess.charCodeAt(i);
    const targetWordCode = targetWord.charCodeAt(i);
    const distance = Math.abs(lastGuessCode - targetWordCode);
    
    if (distance > maxDistance) {
      maxDistance = distance;
    }
    
    if (distance > 5) { // Если расстояние больше 5, считаем что буква далека
      isCloseOverall = false;
    }
  }
  
  const tacticalHintElement = document.querySelector('.tactical-hint');
  let hintMessage;
  
  // Выбираем подходящую подсказку
  if (maxDistance > 10) {
    // Далекие буквы
    const randomIndex = Math.floor(Math.random() * tacticalHints.farLetter.length);
    hintMessage = tacticalHints.farLetter[randomIndex];
  } else if (isCloseOverall) {
    // Близкие буквы
    const randomIndex = Math.floor(Math.random() * tacticalHints.closeLetter.length);
    hintMessage = tacticalHints.closeLetter[randomIndex];
  } else {
    // Средние буквы - просто случайная подсказка
    const hints = [...tacticalHints.farLetter, ...tacticalHints.closeLetter];
    const randomIndex = Math.floor(Math.random() * hints.length);
    hintMessage = hints[randomIndex];
  }
  
  if (tacticalHintElement) {
    tacticalHintElement.textContent = hintMessage;
  }
};

// Функция для начала новой игры
const startNewGame = () => {
  closeModal();
  resetGameState();
  chooseRandomWord();
  
  // Если была тема дня, сохраняем ее
  if (gameState.currentTheme) {
    showThemeDay(gameState.currentTheme);
  }
  
  // Перерисовываем доску
  renderBoard();
  
  // Сбрасываем использование подсказки
  document.getElementById('hintButton').disabled = false;
  
  showMessage('Новая игра началась!');
};

// Переключение режима мультиплеера
const toggleMultiplayerMode = () => {
  gameState.multiplayerMode = !gameState.multiplayerMode;
  
  const multiplayerSection = document.querySelector('.multiplayer-section');
  
  if (gameState.multiplayerMode) {
    multiplayerSection.style.display = 'block';
    gameState.currentPlayer = 1;
    gameState.player1Score = 0;
    gameState.player2Score = 0;
    updatePlayerTurn();
    showMessage('Режим дуэли активирован!');
  } else {
    multiplayerSection.style.display = 'none';
    showMessage('Режим дуэли выключен');
  }
  
  // Перезапускаем игру для мультиплеера
  resetGameState();
  chooseRandomWord();
  renderBoard();
}; 