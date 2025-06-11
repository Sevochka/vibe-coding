// ИИ для компьютерного противника
class AIPlayer {
    constructor(paddle, physics) {
        this.paddle = paddle;
        this.physics = physics;
        this.targetX = paddle.x;
        this.targetY = paddle.y;
        this.reactionTime = GAME_CONFIG.AI_PADDLE.REACTION_TIME;
        this.predictionFactor = GAME_CONFIG.AI_PADDLE.PREDICTION_FACTOR;
        this.difficulty = GAME_CONFIG.AI_PADDLE.DIFFICULTY;
        this.lastUpdate = 0;
        this.updateInterval = 100; // мс
        this.defensivePosition = {
            x: GAME_CONFIG.FIELD.WIDTH / 2,
            y: GAME_CONFIG.AI_PADDLE.START_Y + 30
        };
    }

    // Обновление ИИ
    update(puck, playerPaddle, deltaTime) {
        const currentTime = Date.now();
        
        // Обновляем решения ИИ с определенным интервалом
        if (currentTime - this.lastUpdate > this.updateInterval) {
            this.makeDecision(puck, playerPaddle);
            this.lastUpdate = currentTime;
        }

        // Плавное движение к цели
        this.moveToTarget(deltaTime);
        
        // Ограничение движения в своей половине поля
        this.physics.constrainPaddle(this.paddle, false);
    }

    // Принятие решения ИИ
    makeDecision(puck, playerPaddle) {
        const puckSpeed = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy);
        const puckDistance = this.physics.distance(puck.x, puck.y, this.paddle.x, this.paddle.y);
        
        // Определяем поведение на основе ситуации
        if (this.isPuckComingToAI(puck)) {
            // Шайба движется к ИИ - перехватываем или защищаемся
            if (puckSpeed > 3 && puckDistance < 100) {
                this.interceptPuck(puck);
            } else {
                this.defendGoal(puck);
            }
        } else if (this.isPuckNearAI(puck)) {
            // Шайба рядом с ИИ - атакуем
            this.attackPuck(puck, playerPaddle);
        } else {
            // Шайба далеко или у игрока - возвращаемся в защитную позицию
            this.returnToDefense();
        }

        // Добавляем случайность для разнообразия игры
        this.addRandomness();
    }

    // Проверяем, движется ли шайба к ИИ
    isPuckComingToAI(puck) {
        const futurePuckY = puck.y + puck.vy * 30; // прогноз на 30 кадров
        return puck.vy < 0 && futurePuckY < GAME_CONFIG.FIELD.HEIGHT / 2;
    }

    // Проверяем, рядом ли шайба с ИИ
    isPuckNearAI(puck) {
        const distance = this.physics.distance(puck.x, puck.y, this.paddle.x, this.paddle.y);
        return distance < 80 && puck.y < GAME_CONFIG.FIELD.HEIGHT / 2;
    }

    // Перехват шайбы
    interceptPuck(puck) {
        // Предсказываем позицию шайбы
        const timeToReach = this.physics.distance(puck.x, puck.y, this.paddle.x, this.paddle.y) / GAME_CONFIG.AI_PADDLE.MAX_SPEED;
        const predictedX = puck.x + puck.vx * timeToReach * this.predictionFactor;
        const predictedY = puck.y + puck.vy * timeToReach * this.predictionFactor;

        // Ограничиваем предсказанную позицию полем
        this.targetX = this.physics.clamp(predictedX, GAME_CONFIG.AI_PADDLE.RADIUS, 
                                         GAME_CONFIG.FIELD.WIDTH - GAME_CONFIG.AI_PADDLE.RADIUS);
        this.targetY = this.physics.clamp(predictedY, GAME_CONFIG.AI_PADDLE.RADIUS, 
                                         GAME_CONFIG.FIELD.HEIGHT / 2 - GAME_CONFIG.AI_PADDLE.RADIUS);
    }

    // Защита ворот
    defendGoal(puck) {
        const goalCenterX = GAME_CONFIG.FIELD.WIDTH / 2;
        const puckToGoalAngle = Math.atan2(0 - puck.y, goalCenterX - puck.x);
        
        // Позиционируемся между шайбой и воротами
        const defenseDistance = 50;
        this.targetX = goalCenterX - Math.cos(puckToGoalAngle) * defenseDistance;
        this.targetY = this.defensivePosition.y;

        // Ограничиваем движение около ворот
        this.targetX = this.physics.clamp(this.targetX, 
                                         goalCenterX - GAME_CONFIG.GOALS.WIDTH / 2 + GAME_CONFIG.AI_PADDLE.RADIUS,
                                         goalCenterX + GAME_CONFIG.GOALS.WIDTH / 2 - GAME_CONFIG.AI_PADDLE.RADIUS);
    }

    // Атака шайбы
    attackPuck(puck, playerPaddle) {
        // Направляем шайбу к игроку или в угол поля
        const playerGoalX = GAME_CONFIG.FIELD.WIDTH / 2;
        const playerGoalY = GAME_CONFIG.FIELD.HEIGHT;
        
        // Выбираем стратегию атаки
        let attackX, attackY;
        
        if (Math.random() < 0.7) {
            // Атака в сторону ворот игрока
            attackX = playerGoalX + (Math.random() - 0.5) * GAME_CONFIG.GOALS.WIDTH;
            attackY = playerGoalY;
        } else {
            // Атака в угол для затруднения защиты
            attackX = Math.random() < 0.5 ? 50 : GAME_CONFIG.FIELD.WIDTH - 50;
            attackY = GAME_CONFIG.FIELD.HEIGHT - 50;
        }

        // Вычисляем направление удара
        const dx = attackX - puck.x;
        const dy = attackY - puck.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // Позиционируемся для удара
            const hitDistance = GAME_CONFIG.AI_PADDLE.RADIUS + GAME_CONFIG.PUCK.RADIUS + 5;
            this.targetX = puck.x - (dx / distance) * hitDistance;
            this.targetY = puck.y - (dy / distance) * hitDistance;
        }
    }

    // Возврат в защитную позицию
    returnToDefense() {
        this.targetX = this.physics.lerp(this.targetX, this.defensivePosition.x, 0.1);
        this.targetY = this.physics.lerp(this.targetY, this.defensivePosition.y, 0.1);
    }

    // Добавление случайности в движения
    addRandomness() {
        const randomFactor = (1 - this.difficulty) * 20;
        this.targetX += (Math.random() - 0.5) * randomFactor;
        this.targetY += (Math.random() - 0.5) * randomFactor;
    }

    // Плавное движение к целевой позиции
    moveToTarget(deltaTime) {
        const dx = this.targetX - this.paddle.x;
        const dy = this.targetY - this.paddle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 2) {
            // Рассчитываем скорость движения
            const moveSpeed = GAME_CONFIG.AI_PADDLE.MAX_SPEED * this.difficulty;
            const moveDistance = Math.min(moveSpeed * deltaTime / 16.67, distance);
            
            // Нормализуем направление
            const nx = dx / distance;
            const ny = dy / distance;
            
            // Обновляем скорость биты ИИ
            this.paddle.vx = nx * moveDistance * 60;
            this.paddle.vy = ny * moveDistance * 60;
            
            // Обновляем позицию
            this.paddle.x += nx * moveDistance;
            this.paddle.y += ny * moveDistance;
        } else {
            // Замедляем биту при достижении цели
            this.paddle.vx *= 0.8;
            this.paddle.vy *= 0.8;
        }
    }

    // Изменение сложности ИИ
    setDifficulty(level) {
        this.difficulty = Math.max(0.3, Math.min(1.0, level));
        this.reactionTime = GAME_CONFIG.AI_PADDLE.REACTION_TIME * (2 - this.difficulty);
        this.updateInterval = 50 + (1 - this.difficulty) * 100;
    }

    // Получение информации о состоянии ИИ
    getState() {
        return {
            difficulty: this.difficulty,
            targetX: this.targetX,
            targetY: this.targetY,
            isAttacking: this.isPuckNearAI,
            isDefending: !this.isPuckNearAI
        };
    }
} 