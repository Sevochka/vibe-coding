// Основные элементы приложения
const welcomeScreen = document.getElementById('welcome-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const progressBar = document.querySelector('.progress');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const scoreText = document.getElementById('score-text');
const resultDescription = document.getElementById('result-description');
const characterResult = document.getElementById('character-result');
const vkShareBtn = document.getElementById('vk-share');
const telegramShareBtn = document.getElementById('telegram-share');

// Переменные для хранения состояния игры
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let shuffledQuestions = [];

// Инициализация теста
function initTest() {
    // Перемешиваем вопросы для разнообразия
    shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    // Начинаем с первого вопроса
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    
    // Обновляем индикатор прогресса
    updateProgress();
}

// Отображение вопроса
function showQuestion(question) {
    // Очищаем предыдущие ответы
    answersContainer.innerHTML = '';
    
    // Устанавливаем текст вопроса
    questionText.textContent = question.question;
    
    // Перемешиваем ответы для каждого вопроса
    const shuffledAnswers = [...question.answers].sort(() => Math.random() - 0.5);
    
    // Добавляем варианты ответов
    shuffledAnswers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.classList.add('answer-btn');
        
        // Структура кнопки ответа
        let answerContent = `<span>${answer.text}</span>`;
        
        // Если есть изображение, добавляем его
        if (answer.image) {
            answerContent = `<div class="answer-with-image">
                <img src="${answer.image}" alt="${answer.text}" class="answer-image">
                <span>${answer.text}</span>
            </div>`;
        }
        
        button.innerHTML = answerContent;
        
        // Обработчик событий при клике на ответ
        button.addEventListener('click', () => {
            // Сохраняем ответ пользователя
            userAnswers.push({
                question: question.question,
                userAnswer: answer.text,
                correct: answer.correct
            });
            
            // Получаем координаты клика для эффекта разбивания блока
            const rect = button.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            // Применяем визуальный эффект в зависимости от правильности ответа
            if (answer.correct) {
                button.classList.add('correct');
                score++;
                
                // Создаем эффект разбивания блока соответствующего типа
                particleSystem.createBlockBreakEffect(x, y, question.blockType || 'grass');
            } else {
                button.classList.add('incorrect');
                
                // Показываем правильный ответ
                const correctButton = Array.from(answersContainer.children).find(btn => {
                    return btn.querySelector('span').textContent === shuffledAnswers.find(a => a.correct).text;
                });
                
                if (correctButton) {
                    correctButton.classList.add('correct');
                }
                
                // Эффект разбивания блока для неверного ответа (всегда камень)
                particleSystem.createBlockBreakEffect(x, y, 'stone');
            }
            
            // Блокируем все кнопки после выбора
            Array.from(answersContainer.children).forEach(btn => {
                btn.disabled = true;
            });
            
            // Переход к следующему вопросу или показ результатов
            setTimeout(() => {
                currentQuestionIndex++;
                
                if (currentQuestionIndex < shuffledQuestions.length) {
                    showQuestion(shuffledQuestions[currentQuestionIndex]);
                    updateProgress();
                } else {
                    showResults();
                }
            }, 1500);
        });
        
        answersContainer.appendChild(button);
    });
}

// Обновление индикатора прогресса
function updateProgress() {
    const progressPercentage = (currentQuestionIndex / shuffledQuestions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

// Отображение результатов теста
function showResults() {
    // Скрываем экран вопросов и показываем экран результатов
    questionScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    // Определяем результат на основе набранных баллов
    const userResult = getResult(score);
    
    // Отображаем информацию о результате
    scoreText.textContent = `Ваш результат: ${score} из ${shuffledQuestions.length}`;
    resultDescription.textContent = userResult.description;
    characterResult.style.backgroundImage = `url('${userResult.character}')`;
    
    // Создаем эффект победы с частицами
    if (score > shuffledQuestions.length / 2) {
        particleSystem.createVictoryEffect();
    }
    
    // Настраиваем кнопки для поделиться результатом
    setupShareButtons(userResult);
}

// Определение результата на основе набранных баллов
function getResult(score) {
    // Находим подходящий результат в массиве
    return results.find(result => score >= result.minScore && score <= result.maxScore);
}

// Настройка кнопок для шеринга
function setupShareButtons(result) {
    const shareText = `Я прошел тест на знание Minecraft и получил результат: ${result.title}! Мой счет: ${score} из ${shuffledQuestions.length}. Попробуй и ты!`;
    const shareUrl = encodeURIComponent(window.location.href);
    
    // Настройка VK
    vkShareBtn.addEventListener('click', () => {
        window.open(`http://vk.com/share.php?url=${shareUrl}&title=${encodeURIComponent(shareText)}`, '_blank');
    });
    
    // Настройка Telegram
    telegramShareBtn.addEventListener('click', () => {
        window.open(`https://t.me/share/url?url=${shareUrl}&text=${encodeURIComponent(shareText)}`, '_blank');
    });
}

// Переключение между экранами
function switchScreen(from, to) {
    from.classList.remove('active');
    to.classList.add('active');
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    // Кнопка "Начать тест"
    startBtn.addEventListener('click', () => {
        switchScreen(welcomeScreen, questionScreen);
        initTest();
    });
    
    // Кнопка "Пройти ещё раз"
    restartBtn.addEventListener('click', () => {
        switchScreen(resultScreen, questionScreen);
        initTest();
    });
    
    // Анимация вращения куба при наведении
    const cube = document.querySelector('.cube');
    cube.addEventListener('mouseover', () => {
        cube.style.animationDuration = '2s';
    });
    
    cube.addEventListener('mouseout', () => {
        cube.style.animationDuration = '15s';
    });
    
    // Добавление случайных пикселей при щелчке на фон
    document.addEventListener('click', (e) => {
        // Проверяем, был ли клик на фоне (не на кнопке или другом интерактивном элементе)
        if (e.target === document.body || e.target.classList.contains('minecraft-world')) {
            const randomBlockType = Object.keys(blockEffects)[Math.floor(Math.random() * Object.keys(blockEffects).length)];
            particleSystem.createBlockBreakEffect(e.clientX, e.clientY, randomBlockType);
        }
    });
}); 