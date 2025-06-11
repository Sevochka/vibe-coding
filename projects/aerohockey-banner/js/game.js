// Основной класс игры в аэрохоккей
class AeroHockeyGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameField = document.getElementById('gameField');
        
        // Игровые объекты
        this.physics = new Physics();
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.playerScore = 0;
        this.aiScore = 0;
        this.lastTime = 0;
        this.particles = [];
        
        // DOM элементы
        this.playerScoreEl = document.getElementById('playerScore');
        this.aiScoreEl = document.getElementById('aiScore');
        this.gameStatusEl = document.getElementById('gameStatus');
        this.victoryScreenEl = document.getElementById('victoryScreen');
        this.victoryTextEl = document.getElementById('victoryText');
        this.victorySubtextEl = document.getElementById('victorySubtext');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        
        // Игровые объекты
        this.initGameObjects();
        this.initEventHandlers();
        this.updateGameStatus(GAME_CONFIG.MESSAGES.START);
        
        // Запуск игрового цикла
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }
    
    // Инициализация игровых объектов
    initGameObjects() {
        // Бита игрока
        this.playerPaddle = {
            x: GAME_CONFIG.PLAYER_PADDLE.START_X,
            y: GAME_CONFIG.PLAYER_PADDLE.START_Y,
            vx: 0,
            vy: 0,
            radius: GAME_CONFIG.PLAYER_PADDLE.RADIUS,
            mass: GAME_CONFIG.PLAYER_PADDLE.MASS,
            friction: GAME_CONFIG.PLAYER_PADDLE.FRICTION
        };
        
        // Бита ИИ
        this.aiPaddle = {
            x: GAME_CONFIG.AI_PADDLE.START_X,
            y: GAME_CONFIG.AI_PADDLE.START_Y,
            vx: 0,
            vy: 0,
            radius: GAME_CONFIG.AI_PADDLE.RADIUS,
            mass: GAME_CONFIG.AI_PADDLE.MASS,
            friction: GAME_CONFIG.AI_PADDLE.FRICTION
        };
        
        // Шайба
        this.puck = {
            x: GAME_CONFIG.PUCK.START_X,
            y: GAME_CONFIG.PUCK.START_Y,
            vx: 0,
            vy: 0,
            radius: GAME_CONFIG.PUCK.RADIUS,
            mass: GAME_CONFIG.PUCK.MASS,
            friction: GAME_CONFIG.PUCK.FRICTION
        };
        
        // ИИ игрок
        this.ai = new AIPlayer(this.aiPaddle, this.physics);
        
        // Позиции мыши
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseOverField = false;
    }
    
    // Инициализация обработчиков событий
    initEventHandlers() {
        // Кнопки
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.playAgainBtn.addEventListener('click', () => this.resetGame());
        
        // Управление мышью
        this.gameField.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.gameField.addEventListener('mouseenter', () => this.isMouseOverField = true);
        this.gameField.addEventListener('mouseleave', () => this.isMouseOverField = false);
        
        // Предотвращаем контекстное меню
        this.gameField.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    // Обработка движения мыши
    handleMouseMove(e) {
        if (this.gameState !== 'playing') return;
        
        const rect = this.gameField.getBoundingClientRect();
        const newX = e.clientX - rect.left;
        const newY = e.clientY - rect.top;
        
        // Рассчитываем скорость биты на основе движения мыши
        const deltaTime = 16.67; // ~60 FPS
        this.playerPaddle.vx = (newX - this.playerPaddle.x) * (60 / deltaTime);
        this.playerPaddle.vy = (newY - this.playerPaddle.y) * (60 / deltaTime);
        
        // Ограничиваем скорость
        const speed = this.physics.limitSpeed(
            this.playerPaddle.vx, 
            this.playerPaddle.vy, 
            GAME_CONFIG.PLAYER_PADDLE.MAX_SPEED
        );
        this.playerPaddle.vx = speed.vx;
        this.playerPaddle.vy = speed.vy;
        
        // Обновляем позицию
        this.playerPaddle.x = newX;
        this.playerPaddle.y = newY;
        
        // Ограничиваем движение в своей половине поля
        this.physics.constrainPaddle(this.playerPaddle, true);
    }
    
    // Запуск игры
    startGame() {
        this.gameState = 'playing';
        this.updateGameStatus('Игра началась!');
        this.startBtn.style.display = 'none';
        
        // Даем шайбе начальный импульс
        setTimeout(() => {
            const angle = (Math.random() - 0.5) * Math.PI * 0.5;
            const speed = 3;
            this.puck.vx = Math.cos(angle) * speed;
            this.puck.vy = Math.sin(angle) * speed * (Math.random() < 0.5 ? 1 : -1);
        }, 500);
    }
    
    // Сброс игры
    resetGame() {
        this.gameState = 'menu';
        this.playerScore = 0;
        this.aiScore = 0;
        this.updateScore();
        this.updateGameStatus(GAME_CONFIG.MESSAGES.START);
        this.hideVictoryScreen();
        this.startBtn.style.display = 'inline-block';
        this.resetPositions();
        this.particles = [];
    }
    
    // Сброс позиций объектов
    resetPositions() {
        this.playerPaddle.x = GAME_CONFIG.PLAYER_PADDLE.START_X;
        this.playerPaddle.y = GAME_CONFIG.PLAYER_PADDLE.START_Y;
        this.playerPaddle.vx = 0;
        this.playerPaddle.vy = 0;
        
        this.aiPaddle.x = GAME_CONFIG.AI_PADDLE.START_X;
        this.aiPaddle.y = GAME_CONFIG.AI_PADDLE.START_Y;
        this.aiPaddle.vx = 0;
        this.aiPaddle.vy = 0;
        
        this.puck.x = GAME_CONFIG.PUCK.START_X;
        this.puck.y = GAME_CONFIG.PUCK.START_Y;
        this.puck.vx = 0;
        this.puck.vy = 0;
    }
    
    // Основной игровой цикл
    gameLoop(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        if (this.gameState === 'playing') {
            this.update(deltaTime);
        }
        
        this.render();
        this.updateDOM();
        
        requestAnimationFrame(this.gameLoop);
    }
    
    // Обновление игровой логики
    update(deltaTime) {
        // Обновление ИИ
        this.ai.update(this.puck, this.playerPaddle, deltaTime);
        
        // Применение физики к шайбе
        this.physics.updatePosition(this.puck);
        this.physics.applyFriction(this.puck);
        
        // Проверка столкновений
        this.checkCollisions();
        
        // Обновление частиц
        this.updateParticles();
    }
    
    // Проверка столкновений
    checkCollisions() {
        // Столкновение шайбы со стенами и воротами
        const wallCollision = this.physics.handleWallCollision(this.puck);
        
        if (wallCollision === 'goal_top') {
            this.handleGoal('player');
        } else if (wallCollision === 'goal_bottom') {
            this.handleGoal('ai');
        } else if (wallCollision === 'wall') {
            this.createParticles(this.puck.x, this.puck.y, '#00c78b');
        }
        
        // Столкновение шайбы с битами
        if (this.physics.handleCircleCollision(this.puck, this.playerPaddle)) {
            this.physics.calculatePaddleHit(this.playerPaddle, this.puck);
            this.createParticles(this.puck.x, this.puck.y, '#00c78b');
            this.addPuckClass('hit');
        }
        
        if (this.physics.handleCircleCollision(this.puck, this.aiPaddle)) {
            this.physics.calculatePaddleHit(this.aiPaddle, this.puck);
            this.createParticles(this.puck.x, this.puck.y, '#ff003c');
            this.addPuckClass('hit');
        }
    }
    
    // Обработка гола
    handleGoal(scorer) {
        if (scorer === 'player') {
            this.playerScore++;
            this.updateGameStatus(GAME_CONFIG.MESSAGES.PLAYER_GOAL);
            this.animateScore('player');
        } else {
            this.aiScore++;
            this.updateGameStatus(GAME_CONFIG.MESSAGES.AI_GOAL);
            this.animateScore('ai');
        }
        
        this.updateScore();
        this.createGoalParticles();
        
        // Проверка на окончание игры
        if (this.playerScore >= GAME_CONFIG.GAME.MAX_SCORE || this.aiScore >= GAME_CONFIG.GAME.MAX_SCORE) {
            setTimeout(() => this.endGame(), 1000);
        } else {
            setTimeout(() => this.resetPositions(), GAME_CONFIG.GAME.RESET_DELAY);
        }
    }
    
    // Окончание игры
    endGame() {
        this.gameState = 'gameOver';
        
        if (this.playerScore > this.aiScore) {
            this.showVictoryScreen(GAME_CONFIG.MESSAGES.PLAYER_WIN, GAME_CONFIG.MESSAGES.PLAYER_WIN);
        } else {
            this.showVictoryScreen(GAME_CONFIG.MESSAGES.AI_WIN, GAME_CONFIG.MESSAGES.AI_WIN);
        }
    }
    
    // Создание частиц
    createParticles(x, y, color, count = GAME_CONFIG.EFFECTS.PARTICLE_COUNT) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: GAME_CONFIG.EFFECTS.PARTICLE_LIFE,
                maxLife: GAME_CONFIG.EFFECTS.PARTICLE_LIFE,
                color: color
            });
        }
    }
    
    // Создание частиц при голе
    createGoalParticles() {
        const goalX = GAME_CONFIG.FIELD.WIDTH / 2;
        const goalY = this.playerScore > this.aiScore ? 0 : GAME_CONFIG.FIELD.HEIGHT;
        this.createParticles(goalX, goalY, '#ffc300', 20);
    }
    
    // Обновление частиц
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.95;
            particle.vy *= 0.95;
            particle.life--;
            return particle.life > 0;
        });
    }
    
    // Отрисовка
    render() {
        // Очистка canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Отрисовка частиц
        this.renderParticles();
        
        // Отрисовка шайбы (если игра идет)
        if (this.gameState === 'playing') {
            this.renderPuckTrail();
        }
    }
    
    // Отрисовка частиц
    renderParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    // Отрисовка следа шайбы
    renderPuckTrail() {
        const speed = Math.sqrt(this.puck.vx * this.puck.vx + this.puck.vy * this.puck.vy);
        if (speed > 2) {
            this.ctx.strokeStyle = '#00c78b40';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(this.puck.x, this.puck.y, this.puck.radius + 5, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    // Обновление DOM элементов
    updateDOM() {
        // Обновление позиций элементов
        const playerPaddleEl = document.getElementById('playerPaddle');
        const aiPaddleEl = document.getElementById('aiPaddle');
        const puckEl = document.getElementById('puck');
        
        if (playerPaddleEl) {
            playerPaddleEl.style.left = (this.playerPaddle.x - this.playerPaddle.radius) + 'px';
            playerPaddleEl.style.top = (this.playerPaddle.y - this.playerPaddle.radius) + 'px';
        }
        
        if (aiPaddleEl) {
            aiPaddleEl.style.left = (this.aiPaddle.x - this.aiPaddle.radius) + 'px';
            aiPaddleEl.style.top = (this.aiPaddle.y - this.aiPaddle.radius) + 'px';
        }
        
        if (puckEl) {
            puckEl.style.left = (this.puck.x - this.puck.radius) + 'px';
            puckEl.style.top = (this.puck.y - this.puck.radius) + 'px';
            
            // Анимация движения шайбы
            const speed = Math.sqrt(this.puck.vx * this.puck.vx + this.puck.vy * this.puck.vy);
            if (speed > 2) {
                puckEl.classList.add('moving');
            } else {
                puckEl.classList.remove('moving');
            }
        }
    }
    
    // Обновление счета
    updateScore() {
        this.playerScoreEl.textContent = this.playerScore;
        this.aiScoreEl.textContent = this.aiScore;
    }
    
    // Анимация счета
    animateScore(player) {
        const scoreEl = player === 'player' ? this.playerScoreEl : this.aiScoreEl;
        scoreEl.classList.add('animate');
        setTimeout(() => scoreEl.classList.remove('animate'), 500);
    }
    
    // Обновление статуса игры
    updateGameStatus(message) {
        this.gameStatusEl.textContent = message;
    }
    
    // Добавление CSS класса к шайбе
    addPuckClass(className) {
        const puckEl = document.getElementById('puck');
        if (puckEl) {
            puckEl.classList.add(className);
            setTimeout(() => puckEl.classList.remove(className), 200);
        }
    }
    
    // Показ экрана победы
    showVictoryScreen(title, subtitle) {
        this.victoryTextEl.textContent = title;
        this.victorySubtextEl.textContent = subtitle;
        this.victoryScreenEl.classList.add('show');
    }
    
    // Скрытие экрана победы
    hideVictoryScreen() {
        this.victoryScreenEl.classList.remove('show');
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new AeroHockeyGame();
}); 