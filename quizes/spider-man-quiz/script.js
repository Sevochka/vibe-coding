// DOM элементы
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultsScreen = document.getElementById('resultsScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const progressBar = document.getElementById('progressBar');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('optionsContainer');
const scoreText = document.getElementById('scoreText');
const scorePercent = document.getElementById('scorePercent');
const resultMessage = document.getElementById('resultMessage');
const webContainer = document.getElementById('webContainer');

// Состояние теста
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let shuffledQuestions = [];

// Константы для паутины
const WEB_COUNT = 15;
const WEB_MIN_LENGTH = 50;
const WEB_MAX_LENGTH = 150;
const WEB_MIN_WIDTH = 1;
const WEB_MAX_WIDTH = 3;
let lastMouseX = 0;
let lastMouseY = 0;
let lastWebCreationTime = 0;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Обработчики событий
    startButton.addEventListener('click', startQuiz);
    restartButton.addEventListener('click', restartQuiz);
    
    // Взаимодействие с мышью
    document.addEventListener('mousemove', handleMouseMove);
    
    // Создание паутины при загрузке страницы
    createInitialWebs();
});

// Обработка движения мыши
function handleMouseMove(e) {
    // Обновляем переменные CSS для градиента
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.querySelector('.quiz-container').style.setProperty('--x', `${x}%`);
    document.querySelector('.quiz-container').style.setProperty('--y', `${y}%`);
    
    // Создаем паутину при достаточном движении мыши и если прошло достаточно времени
    const now = Date.now();
    if ((Math.abs(e.clientX - lastMouseX) > 40 || Math.abs(e.clientY - lastMouseY) > 40) 
        && now - lastWebCreationTime > 100) {
        createWebString(lastMouseX, lastMouseY, e.clientX, e.clientY);
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        lastWebCreationTime = now;
    }
}

// Создание начальных паутин
function createInitialWebs() {
    lastMouseX = window.innerWidth / 2;
    lastMouseY = window.innerHeight / 2;
    
    for (let i = 0; i < WEB_COUNT / 2; i++) {
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const endX = startX + (Math.random() * 200 - 100);
        const endY = startY + (Math.random() * 200 - 100);
        
        createWebString(startX, startY, endX, endY);
    }
}

// Создание паутины в указанной позиции
function createWebAtPosition(x, y) {
    // Создаем элемент паутины
    const web = document.createElement('div');
    web.classList.add('web');
    
    // Рассчитываем параметры паутины
    const length = WEB_MIN_LENGTH + Math.random() * (WEB_MAX_LENGTH - WEB_MIN_LENGTH);
    const width = WEB_MIN_WIDTH + Math.random() * (WEB_MAX_WIDTH - WEB_MIN_WIDTH);
    const angle = Math.random() * 360;
    
    // Стилизуем паутину
    web.style.width = `${width}px`;
    web.style.height = `${length}px`;
    web.style.left = `${x}px`;
    web.style.top = `${y}px`;
    web.style.transform = `rotate(${angle}deg)`;
    
    // Добавляем паутину в контейнер
    webContainer.appendChild(web);
    
    // Плавно показываем паутину
    setTimeout(() => {
        web.style.opacity = '0.8';
    }, 10);
    
    // Удаляем паутину через некоторое время
    setTimeout(() => {
        web.style.opacity = '0';
        setTimeout(() => {
            web.remove();
        }, 500);
    }, 3000 + Math.random() * 2000);
}

// Создание нити паутины между двумя точками
function createWebString(startX, startY, endX, endY) {
    // Вычисляем расстояние и угол между точками
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Создаем элемент паутины
    const web = document.createElement('div');
    web.classList.add('web');
    
    // Стилизуем нить паутины
    web.style.width = `${distance}px`;
    web.style.height = `${1 + Math.random() * 2}px`;
    web.style.left = `${startX}px`;
    web.style.top = `${startY}px`;
    web.style.transformOrigin = 'left center';
    web.style.transform = `rotate(${angle}deg)`;
    web.style.borderRadius = '4px';
    
    // Добавляем паутину в контейнер
    webContainer.appendChild(web);
    
    // Плавно показываем паутину
    setTimeout(() => {
        web.style.opacity = '0.6';
    }, 10);
    
    // Удаляем паутину через некоторое время
    setTimeout(() => {
        web.style.opacity = '0';
        setTimeout(() => {
            web.remove();
        }, 500);
    }, 2000 + Math.random() * 1000);
}

// Перемешивание вопросов
function shuffleQuestions() {
    shuffledQuestions = [...questions];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
    
    // Ограничиваем количество вопросов до 10
    if (shuffledQuestions.length > 10) {
        shuffledQuestions = shuffledQuestions.slice(0, 10);
    }
}

// Начало теста
function startQuiz() {
    // Эффект паутины при старте
    createWebBurstEffect();
    
    // Сбрасываем состояние теста
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    // Перемешиваем вопросы
    shuffleQuestions();
    
    // Скрываем стартовый экран и показываем экран с вопросами
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    resultsScreen.classList.add('hidden');
    
    // Загружаем первый вопрос
    loadQuestion();
}

// Эффект взрыва паутины
function createWebBurstEffect() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const angle = (i / 20) * 2 * Math.PI;
            const distance = 100 + Math.random() * 150;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            createWebString(centerX, centerY, endX, endY);
        }, i * 40);
    }
}

// Загрузка вопроса
function loadQuestion() {
    const question = shuffledQuestions[currentQuestionIndex];
    
    // Обновляем прогресс-бар
    const progress = ((currentQuestionIndex) / shuffledQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Отображаем вопрос и устанавливаем начальную прозрачность
    questionElement.textContent = question.question;
    questionElement.style.opacity = '0';
    
    // Очищаем контейнер с вариантами ответов
    optionsContainer.innerHTML = '';
    
    // Создаем фрагмент для вариантов ответов (оптимизация производительности DOM)
    const fragment = document.createDocumentFragment();
    
    // Добавляем варианты ответов
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        
        // Добавляем обработчик клика
        optionElement.addEventListener('click', () => selectOption(index));
        
        // Устанавливаем начальную прозрачность для плавной анимации
        optionElement.style.opacity = '0';
        optionElement.style.transform = 'translateY(10px)';
        
        // Добавляем во фрагмент
        fragment.appendChild(optionElement);
    });
    
    // Добавляем все варианты сразу в DOM
    optionsContainer.appendChild(fragment);
    
    // Анимируем варианты с небольшой задержкой между ними
    const options = optionsContainer.querySelectorAll('.option');
    options.forEach((option, index) => {
        setTimeout(() => {
            option.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            option.style.opacity = '1';
            option.style.transform = 'translateY(0)';
        }, 50 * index);
    });
}

// Выбор варианта ответа
function selectOption(optionIndex) {
    // Проверяем, был ли ответ уже выбран
    const options = optionsContainer.querySelectorAll('.option');
    if (options[0].classList.contains('selected')) {
        return;
    }
    
    const question = shuffledQuestions[currentQuestionIndex];
    const isCorrect = optionIndex === question.correctAnswer;
    
    // Сохраняем ответ пользователя
    userAnswers.push({
        questionIndex: currentQuestionIndex,
        selectedOption: optionIndex,
        isCorrect: isCorrect
    });
    
    // Обновляем счет
    if (isCorrect) {
        score++;
        createWebBurstEffect();
    }
    
    // Отмечаем выбранный вариант
    options.forEach((option, index) => {
        if (index === optionIndex) {
            option.classList.add('selected');
            option.classList.add(isCorrect ? 'correct' : 'incorrect');
        } else if (index === question.correctAnswer) {
            option.classList.add('correct');
        }
    });
    
    // Задержка перед переходом к следующему вопросу
    setTimeout(() => {
        // Плавно скрываем варианты
        options.forEach((option, index) => {
            option.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            option.style.opacity = '0';
            option.style.transform = 'translateY(10px)';
        });
        
        // Скрываем вопрос
        questionElement.style.transition = 'opacity 0.3s ease';
        questionElement.style.opacity = '0';
        
        // Переходим к следующему вопросу после анимации
        setTimeout(() => {
            currentQuestionIndex++;
            
            if (currentQuestionIndex < shuffledQuestions.length) {
                loadQuestion();
                // Показываем вопрос после загрузки
                setTimeout(() => {
                    questionElement.style.opacity = '1';
                }, 50);
            } else {
                showResults();
            }
        }, 300);
    }, 1200);
}

// Показ результатов
function showResults() {
    // Скрываем экран с вопросами и показываем экран с результатами
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    
    // Вычисляем процент правильных ответов
    const totalQuestions = shuffledQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Обновляем текст с результатами
    scoreText.textContent = `${score} из ${totalQuestions}`;
    scorePercent.textContent = `${percentage}%`;
    
    // Находим подходящее сообщение
    let resultMessageText = '';
    for (const result of results) {
        if (score >= result.minScore && score <= result.maxScore) {
            resultMessageText = result.message;
            break;
        }
    }
    
    resultMessage.textContent = resultMessageText;
    
    // Эффект паутины при показе результатов
    createWebBurstEffect();
    
    // Анимация для процента
    const animateScore = () => {
        let displayPercent = 0;
        const interval = setInterval(() => {
            if (displayPercent >= percentage) {
                clearInterval(interval);
            } else {
                displayPercent++;
                scorePercent.textContent = `${displayPercent}%`;
            }
        }, 20);
    };
    
    // Запускаем анимацию через небольшую задержку
    setTimeout(animateScore, 500);
}

// Перезапуск теста
function restartQuiz() {
    startQuiz();
} 