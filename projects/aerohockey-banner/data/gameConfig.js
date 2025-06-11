// Конфигурация игры в аэрохоккей
const GAME_CONFIG = {
    // Размеры игрового поля
    FIELD: {
        WIDTH: 280,
        HEIGHT: 400,
        PADDING: 15
    },
    
    // Настройки биты игрока
    PLAYER_PADDLE: {
        RADIUS: 15,
        MASS: 5,
        FRICTION: 0.8,
        MAX_SPEED: 8,
        START_X: 140,
        START_Y: 340
    },
    
    // Настройки биты ИИ
    AI_PADDLE: {
        RADIUS: 15,
        MASS: 5,
        FRICTION: 0.8,
        MAX_SPEED: 6,
        START_X: 140,
        START_Y: 60,
        REACTION_TIME: 0.1,
        PREDICTION_FACTOR: 0.3,
        DIFFICULTY: 0.7
    },
    
    // Настройки шайбы
    PUCK: {
        RADIUS: 10,
        MASS: 1,
        FRICTION: 0.98,
        BOUNCE_FACTOR: 0.8,
        START_X: 140,
        START_Y: 200,
        MAX_SPEED: 12,
        MIN_SPEED: 0.1
    },
    
    // Настройки ворот
    GOALS: {
        WIDTH: 80,
        HEIGHT: 6,
        TOP_Y: 0,
        BOTTOM_Y: 394
    },
    
    // Физика
    PHYSICS: {
        GRAVITY: 0,
        TIME_STEP: 1/60,
        COLLISION_DAMPING: 0.7,
        WALL_BOUNCE: 0.8
    },
    
    // Игровые правила
    GAME: {
        MAX_SCORE: 5,
        COUNTDOWN_TIME: 3,
        GOAL_CELEBRATION_TIME: 2000,
        RESET_DELAY: 1000
    },
    
    // Звуковые эффекты (URL можно заменить на реальные звуки)
    SOUNDS: {
        PADDLE_HIT: 'paddle_hit',
        WALL_HIT: 'wall_hit',
        GOAL: 'goal',
        GAME_START: 'game_start',
        VICTORY: 'victory'
    },
    
    // Цвета и эффекты
    EFFECTS: {
        TRAIL_LENGTH: 5,
        PARTICLE_COUNT: 8,
        PARTICLE_LIFE: 30,
        GLOW_INTENSITY: 0.5
    },
    
    // Текстовые сообщения
    MESSAGES: {
        START: 'Наведите мышь на поле для управления',
        PLAYER_GOAL: 'ГОЛ! Отличная игра!',
        AI_GOAL: 'ИИ забил. Не сдавайтесь!',
        PLAYER_WIN: 'ПОБЕДА! Вы чемпион!',
        AI_WIN: 'ПОРАЖЕНИЕ. Попробуйте еще раз!',
        DRAW: 'НИЧЬЯ! Отличная игра!',
        GAME_OVER: 'Игра окончена',
        READY: 'Готовы? Начинаем!',
        PAUSED: 'Игра на паузе'
    }
}; 