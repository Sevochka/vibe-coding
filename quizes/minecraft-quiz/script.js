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
const resultTitle = document.getElementById('resultTitle');
const resultIcon = document.getElementById('resultIcon');
const particleContainer = document.getElementById('particleContainer');

// Состояние теста
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let shuffledQuestions = [];

// Константы для частиц
const PARTICLE_COUNT = 50;
const PARTICLE_MIN_SIZE = 2;
const PARTICLE_MAX_SIZE = 6;
const PARTICLE_MIN_SPEED = 0.5;
const PARTICLE_MAX_SPEED = 2;
const PARTICLE_MIN_LIFETIME = 2000;
const PARTICLE_MAX_LIFETIME = 5000;

// Массив частиц
let particles = [];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Обработчики событий
    startButton.addEventListener('click', startQuiz);
    restartButton.addEventListener('click', restartQuiz);
    
    // Взаимодействие с мышью
    document.addEventListener('mousemove', handleMouseMove);
    
    // Создание частиц при загрузке страницы
    createInitialParticles();
    
    // Запуск анимации частиц
    requestAnimationFrame(animateParticles);
});

// Обработка движения мыши
function handleMouseMove(e) {
    // Обновляем переменные CSS для градиента
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.querySelector('.quiz-container').style.setProperty('--x', `${x}%`);
    document.querySelector('.quiz-container').style.setProperty('--y', `${y}%`);
    
    // Создаем частицы при движении мыши
    if (Math.random() > 0.7) {
        createParticle(e.clientX, e.clientY);
    }
}

// Создание начальных частиц
function createInitialParticles() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        createParticle(x, y);
    }
}

// Создание частицы
function createParticle(x, y) {
    const particle = {
        x,
        y,
        size: PARTICLE_MIN_SIZE + Math.random() * (PARTICLE_MAX_SIZE - PARTICLE_MIN_SIZE),
        speedX: (Math.random() - 0.5) * PARTICLE_MAX_SPEED,
        speedY: (Math.random() - 0.5) * PARTICLE_MAX_SPEED,
        opacity: 0.8,
        lifetime: PARTICLE_MIN_LIFETIME + Math.random() * (PARTICLE_MAX_LIFETIME - PARTICLE_MIN_LIFETIME),
        createdAt: Date.now()
    };
    
    particles.push(particle);
    
    // Создаем элемент частицы
    const particleElement = document.createElement('div');
    particleElement.classList.add('particle');
    particleElement.style.width = `${particle.size}px`;
    particleElement.style.height = `${particle.size}px`;
    particleElement.style.left = `${particle.x}px`;
    particleElement.style.top = `${particle.y}px`;
    particleElement.style.opacity = particle.opacity;
    
    // Добавляем частицу в контейнер
    particleContainer.appendChild(particleElement);
    
    // Плавно показываем частицу
    setTimeout(() => {
        particleElement.style.opacity = particle.opacity;
    }, 10);
    
    // Удаляем частицу через некоторое время
    setTimeout(() => {
        particleElement.style.opacity = '0';
        setTimeout(() => {
            particleElement.remove();
        }, 500);
    }, particle.lifetime);
}

// Анимация частиц
function animateParticles() {
    // Обновляем позиции частиц
    particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Проверяем границы экрана
        if (particle.x < 0 || particle.x > window.innerWidth) {
            particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > window.innerHeight) {
            particle.speedY *= -1;
        }
        
        // Удаляем частицы, которые прожили свой срок
        if (Date.now() - particle.createdAt > particle.lifetime) {
            particles.splice(index, 1);
        }
    });
    
    // Запрашиваем следующий кадр анимации
    requestAnimationFrame(animateParticles);
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
    // Эффект взрыва при старте
    createExplosionEffect();
    
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

// Эффект взрыва
function createExplosionEffect() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Создаем взрыв
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');
    explosion.style.left = `${centerX - 50}px`;
    explosion.style.top = `${centerY - 50}px`;
    particleContainer.appendChild(explosion);
    
    // Создаем частицы взрыва
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const angle = (i / 30) * 2 * Math.PI;
            const distance = 50 + Math.random() * 100;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            createParticle(x, y);
        }, i * 20);
    }
    
    // Удаляем взрыв через некоторое время
    setTimeout(() => {
        explosion.remove();
    }, 500);
}

// Загрузка вопроса
function loadQuestion() {
    // Обновляем прогресс-бар
    const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Получаем текущий вопрос
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    
    // Отображаем вопрос
    questionElement.textContent = currentQuestion.question;
    
    // Очищаем контейнер с вариантами ответов
    optionsContainer.innerHTML = '';
    
    // Создаем варианты ответов
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(index));
        
        // Добавляем вариант ответа в контейнер
        optionsContainer.appendChild(optionElement);
        
        // Анимация появления варианта ответа
        setTimeout(() => {
            optionElement.style.opacity = '1';
            optionElement.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Создаем анимацию для текущего вопроса
    createQuestionAnimation(currentQuestion);
}

// Создание анимации для вопроса
function createQuestionAnimation(question) {
    // Определяем тип анимации на основе вопроса
    if (question.question.includes('блок')) {
        createBlockAnimation();
    } else if (question.question.includes('моб')) {
        createMobAnimation();
    } else if (question.question.includes('портал') || question.question.includes('Край')) {
        createPortalAnimation();
    } else if (question.question.includes('взорв')) {
        createExplosionAnimation();
    } else if (question.question.includes('предмет')) {
        createItemRainAnimation();
    } else {
        // Создаем случайную анимацию
        const animations = [
            createBlockAnimation,
            createMobAnimation,
            createPortalAnimation,
            createExplosionAnimation,
            createItemRainAnimation
        ];
        
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        randomAnimation();
    }
}

// Анимация блоков
function createBlockAnimation() {
    const blockTypes = ['grass', 'dirt', 'stone', 'diamond', 'gold', 'iron', 'wood'];
    const blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
    
    // Создаем блок
    const block = document.createElement('div');
    block.classList.add('minecraft-block', blockType);
    block.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
    block.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
    particleContainer.appendChild(block);
    
    // Анимация появления блока
    setTimeout(() => {
        block.style.opacity = '0.8';
        block.classList.add('block-appear');
    }, 100);
    
    // Удаляем блок через некоторое время
    setTimeout(() => {
        block.classList.add('block-disappear');
        setTimeout(() => {
            block.remove();
        }, 500);
    }, 3000);
}

// Анимация мобов
function createMobAnimation() {
    const mobTypes = ['creeper', 'zombie', 'skeleton', 'spider', 'enderman', 'dragon'];
    const mobType = mobTypes[Math.floor(Math.random() * mobTypes.length)];
    
    // Создаем моба
    const mob = document.createElement('div');
    mob.classList.add('minecraft-mob', mobType);
    mob.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
    mob.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
    particleContainer.appendChild(mob);
    
    // Анимация появления моба
    setTimeout(() => {
        mob.style.opacity = '0.8';
        mob.classList.add('mob-appear');
    }, 100);
    
    // Удаляем моба через некоторое время
    setTimeout(() => {
        mob.classList.add('mob-disappear');
        setTimeout(() => {
            mob.remove();
        }, 500);
    }, 3000);
}

// Анимация портала
function createPortalAnimation() {
    const portalTypes = ['end-portal', 'nether-portal'];
    const portalType = portalTypes[Math.floor(Math.random() * portalTypes.length)];
    
    // Создаем портал
    const portal = document.createElement('div');
    portal.classList.add(portalType);
    portal.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
    portal.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
    particleContainer.appendChild(portal);
    
    // Анимация появления портала
    setTimeout(() => {
        portal.style.opacity = '0.7';
        portal.classList.add('portal-appear');
    }, 100);
    
    // Удаляем портал через некоторое время
    setTimeout(() => {
        portal.classList.add('portal-disappear');
        setTimeout(() => {
            portal.remove();
        }, 1000);
    }, 3000);
}

// Анимация взрыва
function createExplosionAnimation() {
    // Создаем взрыв
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');
    explosion.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
    explosion.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
    particleContainer.appendChild(explosion);
    
    // Анимация появления взрыва
    setTimeout(() => {
        explosion.style.opacity = '0.8';
        explosion.classList.add('explosion-appear');
    }, 100);
    
    // Удаляем взрыв через некоторое время
    setTimeout(() => {
        explosion.remove();
    }, 500);
}

// Анимация дождя из предметов
function createItemRainAnimation() {
    const itemTypes = ['diamond', 'gold', 'iron', 'wood', 'stone'];
    
    // Создаем дождь из предметов
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            
            // Создаем предмет
            const item = document.createElement('div');
            item.classList.add('item-rain');
            item.style.backgroundImage = `url('https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2d/${itemType.charAt(0).toUpperCase() + itemType.slice(1)}_JE4_BE3.png')`;
            item.style.left = `${Math.random() * (window.innerWidth - 20)}px`;
            item.style.top = '-20px';
            particleContainer.appendChild(item);
            
            // Анимация появления предмета
            setTimeout(() => {
                item.style.opacity = '1';
                item.classList.add('item-rain-appear');
            }, 100);
            
            // Удаляем предмет через некоторое время
            setTimeout(() => {
                item.classList.add('item-rain-disappear');
                setTimeout(() => {
                    item.remove();
                }, 500);
            }, 3000);
        }, i * 200);
    }
}

// Выбор варианта ответа
function selectOption(optionIndex) {
    // Получаем текущий вопрос
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    
    // Сохраняем ответ пользователя
    userAnswers.push(optionIndex);
    
    // Получаем все варианты ответов
    const options = document.querySelectorAll('.option');
    
    // Отмечаем выбранный вариант
    options[optionIndex].classList.add('selected');
    
    // Отключаем все варианты ответов
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Проверяем правильность ответа
    if (optionIndex === currentQuestion.correctAnswer) {
        // Правильный ответ
        score++;
        options[optionIndex].classList.add('correct');
        
        // Создаем анимацию для правильного ответа
        createCorrectAnswerAnimation();
    } else {
        // Неправильный ответ
        options[optionIndex].classList.add('incorrect');
        options[currentQuestion.correctAnswer].classList.add('correct');
        
        // Создаем анимацию для неправильного ответа
        createIncorrectAnswerAnimation();
    }
    
    // Переходим к следующему вопросу через некоторое время
    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < shuffledQuestions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 2000);
}

// Анимация правильного ответа
function createCorrectAnswerAnimation() {
    // Создаем взрыв частиц
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const angle = (i / 20) * 2 * Math.PI;
            const distance = 50 + Math.random() * 100;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            createParticle(x, y);
        }, i * 50);
    }
    
    // Создаем дождь из алмазов
    createItemRainAnimation();
}

// Анимация неправильного ответа
function createIncorrectAnswerAnimation() {
    // Создаем взрыв
    createExplosionAnimation();
    
    // Создаем частицы
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const angle = (i / 10) * 2 * Math.PI;
            const distance = 30 + Math.random() * 50;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            createParticle(x, y);
        }, i * 100);
    }
}

// Показ результатов
function showResults() {
    // Скрываем экран с вопросами и показываем экран с результатами
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    
    // Вычисляем процент правильных ответов
    const percent = Math.round((score / shuffledQuestions.length) * 100);
    
    // Определяем результат на основе процента
    const result = results.find(r => percent >= r.minScore && percent <= r.maxScore);
    
    // Отображаем результат
    scoreText.textContent = `${score} из ${shuffledQuestions.length}`;
    scorePercent.textContent = `${percent}%`;
    resultMessage.textContent = result.message;
    resultTitle.textContent = result.title;
    resultIcon.textContent = result.icon;
    
    // Анимация результата
    const animateScore = () => {
        let currentPercent = 0;
        const interval = setInterval(() => {
            currentPercent++;
            scorePercent.textContent = `${currentPercent}%`;
            
            if (currentPercent >= percent) {
                clearInterval(interval);
            }
        }, 20);
    };
    
    // Запускаем анимацию через небольшую задержку
    setTimeout(animateScore, 500);
    
    // Создаем анимацию для результата
    createResultAnimation(result);
}

// Анимация результата
function createResultAnimation(result) {
    // Определяем тип анимации на основе результата
    if (result.title === 'Новичок') {
        // Анимация для новичка
        createBlockAnimation();
    } else if (result.title === 'Строитель') {
        // Анимация для строителя
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createBlockAnimation();
            }, i * 1000);
        }
    } else if (result.title === 'Искатель приключений') {
        // Анимация для искателя приключений
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createMobAnimation();
            }, i * 1000);
        }
    } else if (result.title === 'Эксперт') {
        // Анимация для эксперта
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const animations = [
                    createBlockAnimation,
                    createMobAnimation,
                    createPortalAnimation,
                    createExplosionAnimation,
                    createItemRainAnimation
                ];
                
                const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
                randomAnimation();
            }, i * 800);
        }
    }
}

// Перезапуск теста
function restartQuiz() {
    // Скрываем экран с результатами и показываем стартовый экран
    resultsScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    
    // Создаем анимацию для перезапуска
    createExplosionEffect();
} 