// Основные переменные игры
let gameCategories = []; // Текущие категории в игре
let allTerms = []; // Все термины для текущей игры
let selectedCards = []; // Выбранные карточки
let foundGroups = []; // Найденные группы
let remainingAttempts = 4; // Оставшиеся попытки
let gameOver = false; // Флаг окончания игры
let failedAttempts = 0; // Количество неудачных попыток для текущего набора карточек

// Элементы DOM
const gameBoard = document.getElementById('game-board');
const submitButton = document.getElementById('submit-button');
const restartButton = document.getElementById('restart-button');
const hintButton = document.getElementById('hint-button');
const messageBox = document.getElementById('message-box');
const messageText = document.getElementById('message-text');
const closeMessage = document.getElementById('close-message');
const attemptsElement = document.getElementById('attempts');
const groupsContainer = document.getElementById('groups-container');
const overlay = document.getElementById('overlay');
const victoryModal = document.getElementById('victory-modal');
const victoryMessage = document.getElementById('victory-message');
const playAgainButton = document.getElementById('play-again-button');
const confettiContainer = document.getElementById('confetti-container');

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    setupEventListeners();
    setupResizeScript();
});

// Настройка обработчиков событий
function setupEventListeners() {
    submitButton.addEventListener('click', checkSelection);
    restartButton.addEventListener('click', initGame);
    hintButton.addEventListener('click', provideHint);
    closeMessage.addEventListener('click', hideMessage);
    playAgainButton.addEventListener('click', initGame);
}

// Инициализация новой игры
function initGame() {
    // Сброс состояния игры
    gameCategories = [];
    allTerms = [];
    selectedCards = [];
    foundGroups = [];
    remainingAttempts = 4;
    gameOver = false;
    failedAttempts = 0;
    
    // Обновление UI
    updateAttempts();
    hideMessage();
    hideVictoryModal();
    clearConfetti();
    
    // Выбор случайных категорий для игры
    selectRandomCategories();
    
    // Создание и отображение игрового поля
    renderGameBoard();
    renderFoundGroups();
    
    // Активация кнопок
    submitButton.disabled = true;
    hintButton.disabled = false;
}

// Выбор случайных категорий для текущей игры
function selectRandomCategories() {
    // Копируем массив всех категорий
    const shuffledCategories = [...categories];
    
    // Перемешиваем массив
    for (let i = shuffledCategories.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCategories[i], shuffledCategories[j]] = [shuffledCategories[j], shuffledCategories[i]];
    }
    
    // Выбираем первые 4 категории
    gameCategories = shuffledCategories.slice(0, 4);
    
    // Собираем все термины для игры
    allTerms = gameCategories.reduce((acc, category) => {
        return [...acc, ...category.terms];
    }, []);
    
    // Перемешиваем термины
    for (let i = allTerms.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allTerms[i], allTerms[j]] = [allTerms[j], allTerms[i]];
    }
}

// Отрисовка игрового поля
function renderGameBoard() {
    gameBoard.innerHTML = '';
    
    // Создаем карточки для всех терминов
    allTerms.forEach((term, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.term = term;
        card.dataset.index = index;
        card.textContent = term;
        
        // Если термин принадлежит к найденной группе, помечаем его
        const foundGroup = foundGroups.find(group => 
            group.terms.includes(term)
        );
        
        if (foundGroup) {
            card.classList.add('found');
            const categoryIndex = gameCategories.findIndex(cat => cat.title === foundGroup.title);
            card.style.backgroundColor = getCategoryColor(categoryIndex);
            card.style.borderColor = getCategoryColor(categoryIndex);
            card.style.color = 'white';
        } else {
            // Добавляем обработчик клика для активных карточек
            card.addEventListener('click', () => selectCard(card));
        }
        
        gameBoard.appendChild(card);
    });
}

// Получение цвета для категории
function getCategoryColor(index) {
    const colors = [
        'var(--category-1-color)',
        'var(--category-2-color)',
        'var(--category-3-color)',
        'var(--category-4-color)'
    ];
    return colors[index] || colors[0];
}

// Выбор карточки
function selectCard(card) {
    // Проверяем, не достигнут ли лимит выбора
    if (selectedCards.length >= 4 && !card.classList.contains('selected')) {
        return;
    }
    
    // Переключаем состояние выбора
    card.classList.toggle('selected');
    
    // Обновляем массив выбранных карточек
    const term = card.dataset.term;
    if (card.classList.contains('selected')) {
        selectedCards.push(term);
    } else {
        selectedCards = selectedCards.filter(t => t !== term);
    }
    
    // Активируем/деактивируем кнопку проверки
    submitButton.disabled = selectedCards.length !== 4;
}

// Проверка выбранных карточек
function checkSelection() {
    if (selectedCards.length !== 4) {
        return;
    }
    
    // Проверяем, образуют ли выбранные термины группу
    const foundCategory = gameCategories.find(category => {
        const categoryTerms = category.terms;
        return selectedCards.every(term => categoryTerms.includes(term)) && 
               categoryTerms.every(term => selectedCards.includes(term));
    });
    
    if (foundCategory) {
        // Верно найденная группа
        handleCorrectSelection(foundCategory);
    } else {
        // Неверный выбор
        handleIncorrectSelection();
    }
}

// Обработка верного выбора группы
function handleCorrectSelection(category) {
    // Добавляем группу в список найденных
    foundGroups.push(category);
    
    // Отмечаем найденные карточки
    markFoundCards(category);
    
    // Показываем сообщение об успехе
    showMessage(getRandomMessage('success'));
    
    // Очищаем выбор
    selectedCards = [];
    submitButton.disabled = true;
    
    // Проверяем на победу
    if (foundGroups.length === 4) {
        setTimeout(() => {
            showVictory();
        }, 1000);
    } else {
        // Обновляем отображение найденных групп
        renderFoundGroups();
    }
}

// Пометка найденных карточек
function markFoundCards(category) {
    const cards = document.querySelectorAll('.card');
    const categoryIndex = gameCategories.findIndex(cat => cat.title === category.title);
    
    cards.forEach(card => {
        if (category.terms.includes(card.dataset.term)) {
            card.classList.remove('selected');
            card.classList.add('found', 'correct');
            card.style.backgroundColor = getCategoryColor(categoryIndex);
            card.style.borderColor = getCategoryColor(categoryIndex);
            card.style.color = 'white';
            
            // Удаляем обработчик события
            card.replaceWith(card.cloneNode(true));
        }
    });
}

// Обработка неверного выбора
function handleIncorrectSelection() {
    // Уменьшаем количество попыток
    remainingAttempts--;
    failedAttempts++;
    updateAttempts();
    
    // Добавляем анимацию ошибки
    const selectedCardElements = document.querySelectorAll('.card.selected');
    selectedCardElements.forEach(card => {
        card.classList.add('wrong');
        setTimeout(() => {
            card.classList.remove('wrong', 'selected');
        }, 500);
    });
    
    // Показываем сообщение об ошибке
    if (remainingAttempts === 0) {
        gameOver = true;
        setTimeout(() => {
            showMessage('Игра окончена! У вас закончились попытки. Нажмите "Новая игра", чтобы начать заново.');
        }, 600);
    } else if (remainingAttempts === 1) {
        setTimeout(() => {
            showMessage(getRandomMessage('lastAttempt'));
        }, 600);
    } else {
        setTimeout(() => {
            showMessage(getRandomMessage('error'));
        }, 600);
    }
    
    // Очищаем выбор
    selectedCards = [];
    submitButton.disabled = true;
    
    // После двух неудачных попыток предлагаем подсказку
    if (failedAttempts >= 2 && !gameOver) {
        setTimeout(() => {
            showMessage('Кажется, вы испытываете трудности. Воспользуйтесь подсказкой!');
        }, 2000);
    }
}

// Обновление счетчика попыток
function updateAttempts() {
    attemptsElement.textContent = remainingAttempts;
    
    if (remainingAttempts <= 1) {
        attemptsElement.style.color = 'var(--sports-red-a700)';
    } else {
        attemptsElement.style.color = 'var(--sports-grey-800)';
    }
}

// Отображение найденных групп
function renderFoundGroups() {
    groupsContainer.innerHTML = '';
    
    foundGroups.forEach((group, index) => {
        const groupElement = document.createElement('div');
        groupElement.classList.add('group-item');
        
        const titleElement = document.createElement('div');
        titleElement.classList.add('group-title');
        titleElement.textContent = group.title;
        
        const wordsElement = document.createElement('div');
        wordsElement.classList.add('group-words');
        
        group.terms.forEach(term => {
            const wordElement = document.createElement('span');
            wordElement.classList.add('group-word');
            wordElement.textContent = term;
            wordsElement.appendChild(wordElement);
        });
        
        groupElement.appendChild(titleElement);
        groupElement.appendChild(wordsElement);
        groupsContainer.appendChild(groupElement);
    });
}

// Предоставление подсказки
function provideHint() {
    if (gameOver || foundGroups.length === 4) {
        return;
    }
    
    // Находим категории, которые еще не найдены
    const remainingCategories = gameCategories.filter(category => 
        !foundGroups.some(found => found.title === category.title)
    );
    
    if (remainingCategories.length === 0) {
        return;
    }
    
    // Выбираем случайную категорию
    const randomCategory = remainingCategories[Math.floor(Math.random() * remainingCategories.length)];
    
    // Создаем подсказку с названием категории и одним случайным термином
    const randomTerm = randomCategory.terms[Math.floor(Math.random() * randomCategory.terms.length)];
    const hint = `${getRandomMessage('hintGiven')} Ищите группу "${randomCategory.title}". Один из терминов - "${randomTerm}".`;
    
    // Уменьшаем количество попыток за использование подсказки
    remainingAttempts = Math.max(1, remainingAttempts - 1);
    updateAttempts();
    
    // Показываем подсказку
    showMessage(hint);
    
    // Деактивируем кнопку подсказки
    hintButton.disabled = true;
    setTimeout(() => {
        if (!gameOver) {
            hintButton.disabled = false;
        }
    }, 20000); // Подсказка будет недоступна 20 секунд
}

// Показ сообщения
function showMessage(text) {
    messageText.textContent = text;
    messageBox.classList.remove('hidden');
    overlay.classList.remove('hidden');
    
    // Обеспечиваем корректную работу кнопки закрытия сообщения
    // Удаляем предыдущие обработчики, если они есть
    closeMessage.removeEventListener('click', hideMessage);
    
    // Добавляем новый обработчик
    closeMessage.addEventListener('click', hideMessage);
    
    // Также позволяем закрыть сообщение при нажатии клавиши Escape
    document.addEventListener('keydown', handleEscapeKey);
}

// Обработчик для закрытия сообщения по клавише Escape
function handleEscapeKey(e) {
    if (e.key === 'Escape' && !messageBox.classList.contains('hidden')) {
        hideMessage();
    }
}

// Скрытие сообщения
function hideMessage() {
    messageBox.classList.add('hidden');
    overlay.classList.add('hidden');
    
    // Удаляем обработчик Escape
    document.removeEventListener('keydown', handleEscapeKey);
    
    // Сбрасываем выбранные карточки после сообщения об ошибке
    document.querySelectorAll('.card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    selectedCards = [];
    submitButton.disabled = true;
}

// Получение случайного сообщения из категории
function getRandomMessage(type) {
    const messageList = messages[type] || [];
    if (messageList.length === 0) {
        return '';
    }
    return messageList[Math.floor(Math.random() * messageList.length)];
}

// Показ экрана победы
function showVictory() {
    victoryMessage.textContent = getRandomMessage('victory');
    overlay.classList.remove('hidden');
    victoryModal.classList.remove('hidden');
    createConfetti();
}

// Скрытие экрана победы
function hideVictoryModal() {
    victoryModal.classList.add('hidden');
    overlay.classList.add('hidden');
}

// Создание конфетти
function createConfetti() {
    // Цвета конфетти
    const colors = [
        'var(--sports-primary-color)',
        'var(--sports-yellow-A700)',
        'var(--sports-cyan-A700)',
        'var(--sports-red-a700)',
        'var(--sports-blue-A400)'
    ];
    
    // Количество конфетти
    const confettiCount = 200;
    
    // Создаем элементы конфетти
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `-5%`;
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.opacity = Math.random() + 0.5;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Добавляем анимацию
        confetti.style.animation = `
            fall ${Math.random() * 3 + 2}s linear forwards,
            sway ${Math.random() * 2 + 3}s ease-in-out infinite alternate
        `;
        
        // Определяем @keyframes для fall и sway
        if (!document.querySelector('#confetti-keyframes')) {
            const style = document.createElement('style');
            style.id = 'confetti-keyframes';
            style.innerHTML = `
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(${Math.random() * 360 + 360}deg);
                    }
                }
                
                @keyframes sway {
                    from {
                        transform: translateX(-5%);
                    }
                    to {
                        transform: translateX(5%);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        confettiContainer.appendChild(confetti);
    }
    
    // Удаляем конфетти через некоторое время
    setTimeout(clearConfetti, 5000);
}

// Очистка конфетти
function clearConfetti() {
    confettiContainer.innerHTML = '';
}

// Создаем resize.js для iframe
const projectSlug = window.location.pathname.split('/').filter(Boolean).pop();
function setupResizeScript() {
    const resize = () => {
        const dataUTILS = {
            for: 'BASIC_TEST',
            action: 'resizeIframe',
            selector: `iframe[src*=\\/projects\\/${projectSlug}]]`,
            sizes: {
                height: 2 * Math.floor(document.body.scrollHeight / 2) + 10,
            },
        };

        window?.top?.postMessage(JSON.stringify(dataUTILS), '*');
    };

    const resizeObserver = new ResizeObserver(() => {
        resize();
    });
    resizeObserver.observe(document.body);
} 