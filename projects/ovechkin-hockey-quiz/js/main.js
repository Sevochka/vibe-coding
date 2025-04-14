document.addEventListener('DOMContentLoaded', () => {
    // Элементы интерфейса
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const periodBreak = document.getElementById('period-break');
    const resultsScreen = document.getElementById('results-screen');
    
    const startButton = document.getElementById('start-button');
    const continueButton = document.getElementById('continue-button');
    const restartButton = document.getElementById('restart-button');
    
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const finalScoreElement = document.getElementById('final-score');
    const resultTextElement = document.getElementById('result-text');
    const periodElement = document.getElementById('current-period');
    const minuteIndicator = document.getElementById('minute-indicator');
    
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackText = document.getElementById('feedback-text');
    
    const progressBar = document.getElementById('progress-bar');
    const puck = document.getElementById('puck');
    
    const shareVkButton = document.getElementById('share-vk');
    const shareTelegramButton = document.getElementById('share-telegram');
    
    // Состояние игры
    let currentPeriod = 1;
    let questionsPerPeriod = 3; // Первые два периода по 3 вопроса
    let lastPeriodQuestions = 4; // Последний период 4 вопроса
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let secondsLeft = 60;
    let canAnswer = true;
    let currentProgress = 0;
    
    // Подготовка вопросов для каждого периода
    const periodQuestions = [
        questions.slice(0, questionsPerPeriod),
        questions.slice(questionsPerPeriod, questionsPerPeriod * 2),
        questions.slice(questionsPerPeriod * 2)
    ];
    
    // Начало игры
    startButton.addEventListener('click', startGame);
    continueButton.addEventListener('click', continueToPeriod);
    restartButton.addEventListener('click', restartGame);
    
    shareVkButton.addEventListener('click', shareToVK);
    shareTelegramButton.addEventListener('click', shareToTelegram);
    
    function startGame() {
        startScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        currentPeriod = 1;
        currentQuestionIndex = 0;
        score = 0;
        secondsLeft = 60;
        
        updateScoreboard();
        startTimer();
        loadQuestion();
        updateProgress();
    }
    
    function updateScoreboard() {
        scoreElement.textContent = score;
        periodElement.textContent = currentPeriod;
    }
    
    function startTimer() {
        clearInterval(timer);
        secondsLeft = 60;
        timerElement.textContent = secondsLeft;
        
        timer = setInterval(() => {
            secondsLeft--;
            timerElement.textContent = secondsLeft;
            
            if (secondsLeft <= 10) {
                timerElement.classList.add('time-warning');
            } else {
                timerElement.classList.remove('time-warning');
            }
            
            if (secondsLeft <= 0) {
                clearInterval(timer);
                endPeriod();
            }
        }, 1000);
    }
    
    function loadQuestion() {
        // Определяем, какой вопрос из какого периода загружать
        const currentPeriodQuestions = periodQuestions[currentPeriod - 1];
        const questionData = currentPeriodQuestions[currentQuestionIndex];
        
        // Обновляем минуту матча
        const totalQuestions = currentPeriod === 3 ? lastPeriodQuestions : questionsPerPeriod;
        const minuteValue = Math.ceil(60 / totalQuestions * (currentQuestionIndex + 1));
        minuteIndicator.textContent = `${minuteValue} минута`;
        
        questionText.textContent = questionData.text;
        optionsContainer.innerHTML = '';
        feedbackContainer.style.display = 'none';
        
        // Создаем и добавляем варианты ответов
        questionData.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.classList.add('option');
            optionButton.textContent = option;
            
            optionButton.addEventListener('click', () => {
                if (canAnswer) {
                    checkAnswer(index, questionData.correctAnswerIndex, questionData.feedback);
                }
            });
            
            optionsContainer.appendChild(optionButton);
        });
        
        canAnswer = true;
    }
    
    function checkAnswer(selectedIndex, correctIndex, feedback) {
        canAnswer = false;
        const options = document.querySelectorAll('.option');
        
        options[correctIndex].classList.add('correct');
        
        if (selectedIndex === correctIndex) {
            // Правильный ответ
            score++;
            updateScoreboard();
        } else {
            // Неправильный ответ
            options[selectedIndex].classList.add('incorrect');
        }
        
        // Показываем обратную связь от Овечкина
        feedbackContainer.style.display = 'block';
        typeWriterEffect(feedbackText, feedback);
        
        // Переход к следующему вопросу после задержки
        setTimeout(() => {
            nextQuestion();
        }, 3000);
    }
    
    function typeWriterEffect(element, text) {
        element.textContent = '';
        element.classList.add('typing');
        
        let i = 0;
        const speed = 30; // скорость печатания
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                element.classList.remove('typing');
            }
        }
        
        typeWriter();
    }
    
    function nextQuestion() {
        // Увеличиваем индекс вопроса
        currentQuestionIndex++;
        
        // Определяем, сколько вопросов в текущем периоде
        const totalQuestionsInPeriod = currentPeriod === 3 ? lastPeriodQuestions : questionsPerPeriod;
        
        // Если закончились вопросы в текущем периоде
        if (currentQuestionIndex >= totalQuestionsInPeriod) {
            endPeriod();
        } else {
            loadQuestion();
            updateProgress();
        }
    }
    
    function updateProgress() {
        // Рассчитываем общий прогресс (от 0 до 1)
        const totalQuestions = questionsPerPeriod * 2 + lastPeriodQuestions;
        let questionsAnswered = 0;
        
        if (currentPeriod === 1) {
            questionsAnswered = currentQuestionIndex;
        } else if (currentPeriod === 2) {
            questionsAnswered = questionsPerPeriod + currentQuestionIndex;
        } else {
            questionsAnswered = questionsPerPeriod * 2 + currentQuestionIndex;
        }
        
        currentProgress = questionsAnswered / totalQuestions;
        
        // Обновляем прогресс-бар и позицию шайбы
        progressBar.style.width = `${currentProgress * 100}%`;
        puck.style.left = `${currentProgress * 100}%`;
    }
    
    function endPeriod() {
        clearInterval(timer);
        
        if (currentPeriod < 3) {
            // Показываем экран перерыва между периодами
            gameScreen.classList.remove('active');
            periodBreak.classList.add('active');
        } else {
            // Игра завершена, показываем результаты
            endGame();
        }
    }
    
    function continueToPeriod() {
        // Переходим к следующему периоду
        currentPeriod++;
        currentQuestionIndex = 0;
        
        periodBreak.classList.remove('active');
        gameScreen.classList.add('active');
        
        updateScoreboard();
        startTimer();
        loadQuestion();
        updateProgress();
    }
    
    function endGame() {
        clearInterval(timer);
        
        gameScreen.classList.remove('active');
        resultsScreen.classList.add('active');
        
        finalScoreElement.textContent = score;
        
        // Определяем сообщение о результате
        let resultMessage = "";
        for (const messageData of resultMessages) {
            if (score >= messageData.min && score <= messageData.max) {
                resultMessage = messageData.message;
                break;
            }
        }
        
        resultTextElement.textContent = resultMessage;
    }
    
    function restartGame() {
        resultsScreen.classList.remove('active');
        startScreen.classList.add('active');
    }
    
    function shareToVK() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(`Я набрал ${score} из 10 в тесте "Овечкин побил рекорд Гретцки"!`);
        const shareUrl = `https://vk.com/share.php?url=${url}&title=${title}`;
        window.open(shareUrl, '_blank');
    }
    
    function shareToTelegram() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Я набрал ${score} из 10 в тесте "Овечкин побил рекорд Гретцки"! Проверь свои знания о хоккее!`);
        const shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        window.open(shareUrl, '_blank');
    }
}); 