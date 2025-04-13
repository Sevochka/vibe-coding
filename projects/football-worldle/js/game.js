// Состояние игры
const gameState = {
  currentWord: '',
  currentGuess: '',
  guesses: [],
  currentRow: 0,
  maxAttempts: 6,
  gameStatus: 'playing', // 'playing', 'won', 'lost'
  difficultyLevel: 'beginner',
  playerPoints: 0,
  goalCount: 0,
  saveCount: 0,
  currentTheme: null,
  streakCount: 0,
  usedHint: false,
  playerLevel: difficultyLevels[0],
  earnedAchievements: [],
  keyboardStatus: {},
  multiplayerMode: false,
  currentPlayer: 1,
  player1Score: 0,
  player2Score: 0,
};

// Инициализация игры
const initGame = () => {
  resetGameState();
  chooseRandomWord();
  renderBoard();
  renderKeyboard();
  updateScoreboard();
  updatePlayerStatus();
  
  // Проверяем, есть ли текущая тема дня
  const today = new Date().toLocaleDateString('ru-RU');
  if (localStorage.getItem('themeDay') === today) {
    gameState.currentTheme = localStorage.getItem('currentTheme');
    showThemeDay(gameState.currentTheme);
  } else {
    // Каждые 3 дня генерируем случайную тему
    const randomDayCheck = Math.floor(Date.now() / 86400000) % 3;
    if (randomDayCheck === 0) {
      setRandomThemeDay();
    }
  }
  
  // Загружаем достижения и очки, если есть
  loadPlayerProgress();
};

// Сброс состояния игры
const resetGameState = () => {
  gameState.currentGuess = '';
  gameState.guesses = [];
  gameState.currentRow = 0;
  gameState.gameStatus = 'playing';
  gameState.usedHint = false;
  gameState.keyboardStatus = {};
  
  // Очистка доски
  document.querySelectorAll('.letter-box').forEach(box => {
    box.textContent = '';
    box.className = 'letter-box';
  });
  
  // Очистка подсказок
  document.querySelector('.tactical-hint').textContent = '';
  
  // Сброс клавиатуры
  document.querySelectorAll('.key').forEach(key => {
    key.className = key.className.includes('wide') ? 'key wide' : 'key';
  });
};

// Выбор случайного слова
const chooseRandomWord = () => {
  let wordList;
  
  if (gameState.currentTheme) {
    // Используем тематические слова, если есть активная тема
    wordList = gameWords[gameState.currentTheme];
  } else {
    // Иначе используем слова в соответствии с уровнем сложности
    wordList = gameWords[gameState.difficultyLevel];
  }
  
  const randomIndex = Math.floor(Math.random() * wordList.length);
  gameState.currentWord = wordList[randomIndex];
  
  // Если слово содержит пробел (многословные названия стадионов), заменяем его на "_"
  if (gameState.currentWord.includes(' ')) {
    gameState.currentWord = gameState.currentWord.replace(/ /g, '_');
  }
  
  console.log('Current word:', gameState.currentWord); // для отладки
};

// Добавление буквы к текущей догадке
const addLetter = (letter) => {
  if (gameState.gameStatus !== 'playing') return;
  if (gameState.currentGuess.length < gameState.currentWord.length) {
    gameState.currentGuess += letter;
    updateBoard();
  }
};

// Удаление последней буквы
const removeLetter = () => {
  if (gameState.gameStatus !== 'playing') return;
  if (gameState.currentGuess.length > 0) {
    gameState.currentGuess = gameState.currentGuess.slice(0, -1);
    updateBoard();
  }
};

// Проверка текущей догадки
const submitGuess = () => {
  if (gameState.gameStatus !== 'playing') return;
  if (gameState.currentGuess.length !== gameState.currentWord.length) {
    showMessage('Введите слово полностью!');
    shakeCurrentRow();
    return;
  }
  
  // Проверяем, что ввод содержит только кириллические буквы или "_"
  const validInput = /^[А-ЯЁ_]+$/i.test(gameState.currentGuess);
  if (!validInput) {
    showMessage('Используйте только русские буквы!');
    shakeCurrentRow();
    return;
  }
  
  // Проверяем результат
  const result = checkGuess(gameState.currentGuess);
  gameState.guesses.push(gameState.currentGuess);
  
  // Анимируем и раскрашиваем результат
  animateResult(result);
  
  // Обновляем статус клавиатуры
  updateKeyboardStatus(gameState.currentGuess, result);
  
  // Проверяем на победу
  if (gameState.currentGuess.toUpperCase() === gameState.currentWord.toUpperCase()) {
    gameWon();
  } else if (gameState.currentRow >= gameState.maxAttempts - 1) {
    gameLost();
  } else {
    // Переходим к следующей строке
    gameState.currentRow++;
    gameState.currentGuess = '';
    
    // Если мультиплеер, меняем игрока
    if (gameState.multiplayerMode) {
      gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
      updatePlayerTurn();
    }
    
    // Даем тактическую подсказку
    provideTacticalHint();
  }
  
  updateBoard();
  saveGameProgress();
};

// Проверка догадки и получение результата
const checkGuess = (guess) => {
  const result = Array(guess.length).fill('absent');
  const wordMap = {};
  
  // Создаем карту символов слова
  [...gameState.currentWord.toUpperCase()].forEach((letter, index) => {
    if (!wordMap[letter]) wordMap[letter] = 0;
    wordMap[letter]++;
  });
  
  // Сначала находим все точные совпадения
  [...guess.toUpperCase()].forEach((letter, index) => {
    if (letter === gameState.currentWord[index].toUpperCase()) {
      result[index] = 'correct';
      wordMap[letter]--;
    }
  });
  
  // Затем находим буквы, которые есть в слове, но в другом месте
  [...guess.toUpperCase()].forEach((letter, index) => {
    if (result[index] !== 'correct' && wordMap[letter] && wordMap[letter] > 0) {
      result[index] = 'present';
      wordMap[letter]--;
    }
  });
  
  return result;
};

// Обработка выигрыша
const gameWon = () => {
  gameState.gameStatus = 'won';
  gameState.goalCount++;
  gameState.streakCount++;
  gameState.playerPoints += calculatePoints();
  showMessage('ГОООООООЛ!!! 🎉');
  
  // Создаем анимацию гола
  createGoalAnimation();
  
  // Проверяем достижения
  checkAchievements();
  
  // Обновляем уровень игрока
  updatePlayerLevel();
  
  // Обновляем интерфейс
  updateScoreboard();
  updatePlayerStatus();
  saveGameProgress();
  
  // Показываем модальное окно победы
  setTimeout(() => {
    showGameResult(true);
  }, 1500);
};

// Обработка проигрыша
const gameLost = () => {
  gameState.gameStatus = 'lost';
  gameState.saveCount++;
  gameState.streakCount = 0;
  
  showMessage(`Сейв! Правильное слово: ${gameState.currentWord}`);
  
  // Создаем анимацию сейва
  createSaveAnimation();
  
  // Обновляем интерфейс
  updateScoreboard();
  saveGameProgress();
  
  // Показываем модальное окно проигрыша
  setTimeout(() => {
    showGameResult(false);
  }, 1500);
};

// Расчет очков за победу
const calculatePoints = () => {
  // Базовые очки за уровень сложности
  let basePoints = {
    'beginner': 50,
    'intermediate': 100,
    'advanced': 200,
    'legendary': 300,
  }[gameState.difficultyLevel];
  
  // Бонус за меньшее количество попыток
  const attemptsBonus = (gameState.maxAttempts - gameState.currentRow) * 20;
  
  // Бонус за серию
  const streakBonus = gameState.streakCount * 10;
  
  // Штраф за использование подсказки
  const hintPenalty = gameState.usedHint ? -30 : 0;
  
  return basePoints + attemptsBonus + streakBonus + hintPenalty;
};

// Использование подсказки
const useHint = () => {
  if (gameState.usedHint || gameState.gameStatus !== 'playing') return;
  
  // Находим случайную неотгаданную букву
  const currentGuess = gameState.currentGuess.toUpperCase();
  const correctLetters = [];
  
  // Проверяем все предыдущие догадки и находим уже правильно угаданные буквы
  gameState.guesses.forEach((guess, rowIndex) => {
    const result = checkGuess(guess);
    result.forEach((status, colIndex) => {
      if (status === 'correct') {
        correctLetters.push(colIndex);
      }
    });
  });
  
  // Находим индексы букв, которые еще не отгаданы
  const unknownIndices = [];
  for (let i = 0; i < gameState.currentWord.length; i++) {
    if (!correctLetters.includes(i)) {
      unknownIndices.push(i);
    }
  }
  
  if (unknownIndices.length === 0) {
    showMessage('Вы уже отгадали все буквы!');
    return;
  }
  
  // Выбираем случайную неотгаданную букву
  const randomIndex = unknownIndices[Math.floor(Math.random() * unknownIndices.length)];
  const hintLetter = gameState.currentWord[randomIndex].toUpperCase();
  
  // Заполняем эту букву в текущей строке
  const boardRow = document.querySelectorAll('.board .row')[gameState.currentRow];
  const letterBox = boardRow.querySelectorAll('.letter-box')[randomIndex];
  letterBox.textContent = hintLetter;
  letterBox.classList.add('letter-correct', 'pop');
  
  // Обновляем текущую догадку с подсказкой
  let newGuess = gameState.currentGuess.split('');
  while (newGuess.length < randomIndex) {
    newGuess.push('');
  }
  newGuess[randomIndex] = hintLetter;
  gameState.currentGuess = newGuess.join('');
  
  gameState.usedHint = true;
  document.getElementById('hintButton').disabled = true;
  
  // Показываем анимацию "замены"
  showSubstitutionAnimation();
  
  showMessage('Подсказка использована!');
  
  // Проверяем достижение за использование подсказки
  checkAchievement('free_kick');
  
  saveGameProgress();
};

// Переключение сложности
const switchDifficulty = (level) => {
  if (gameState.gameStatus !== 'playing' || gameState.guesses.length > 0) {
    return; // Нельзя менять сложность во время игры
  }
  
  gameState.difficultyLevel = level;
  resetGameState();
  chooseRandomWord();
  renderBoard(); // Перерисовываем доску, так как длина слова может измениться
  
  showMessage(`Уровень сложности: ${level}`);
  saveGameProgress();
};

// Сохранение прогресса игрока
const saveGameProgress = () => {
  const progressData = {
    playerPoints: gameState.playerPoints,
    goalCount: gameState.goalCount,
    saveCount: gameState.saveCount,
    streakCount: gameState.streakCount,
    difficultyLevel: gameState.difficultyLevel,
    playerLevel: gameState.playerLevel,
    earnedAchievements: gameState.earnedAchievements,
    lastPlayed: new Date().toISOString(),
  };
  
  localStorage.setItem('footballWorldleProgress', JSON.stringify(progressData));
};

// Загрузка прогресса игрока
const loadPlayerProgress = () => {
  const savedProgress = localStorage.getItem('footballWorldleProgress');
  if (savedProgress) {
    const progress = JSON.parse(savedProgress);
    
    gameState.playerPoints = progress.playerPoints || 0;
    gameState.goalCount = progress.goalCount || 0;
    gameState.saveCount = progress.saveCount || 0;
    gameState.streakCount = progress.streakCount || 0;
    gameState.difficultyLevel = progress.difficultyLevel || 'beginner';
    gameState.playerLevel = progress.playerLevel || difficultyLevels[0];
    gameState.earnedAchievements = progress.earnedAchievements || [];
    
    updatePlayerLevel();
    updatePlayerStatus();
    updateScoreboard();
  }
};