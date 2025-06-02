// Конфигурация игры Морской бой | FONBET
const GAME_CONFIG = {
    BOARD_SIZE: 10,
    SHIPS: [
        { name: '4-палубный', size: 4, count: 1, color: '#00c78b', bonus: null },
        { name: '3-палубный', size: 3, count: 2, color: '#0040fc', bonus: 'extra_turn' },
        { name: '2-палубный', size: 2, count: 3, color: '#ffc300', bonus: null },
        { name: '1-палубный', size: 1, count: 4, color: '#ff003c', bonus: null }
    ],
    SPECIAL_CELLS: [
        { 
            name: 'Подсветка', 
            effect: 'Показывает содержимое ячеек 3x3 вокруг',
            count: 1,
            icon: '💡',
            color: '#ffc300'
        },
        { 
            name: 'Защита', 
            effect: 'Необходимы два хода для открытия',
            count: 1,
            icon: '🛡️',
            color: '#00a0f0'
        },
        { 
            name: 'Доп. ход', 
            effect: 'Игрок сохраняет ход',
            count: 1,
            icon: '⚡',
            color: '#ff003c'
        }
    ],
    CELL_STATES: {
        EMPTY: 'empty',
        SHIP: 'ship',
        HIT: 'hit',
        MISS: 'miss',
        SUNK: 'sunk',
        SPECIAL: 'special',
        PROTECTED: 'protected',
        REVEALED: 'revealed'
    },
    GAME_PHASES: {
        CLUB_SELECTION: 'clubSelection',
        PLACEMENT: 'placement',
        BATTLE: 'battle',
        GAME_OVER: 'gameOver'
    },
    DIFFICULTY_LEVELS: {
        EASY: { name: 'Новичок', hitChance: 0.15, smartShots: false },
        MEDIUM: { name: 'Опытный', hitChance: 0.25, smartShots: true },
        HARD: { name: 'Адмирал', hitChance: 0.35, smartShots: true }
    }
};

// Сообщения игры
const GAME_MESSAGES = {
    SELECT_CLUB: 'Выберите свой футбольный клуб',
    PLACEMENT_INSTRUCTION: 'Расставьте эмблемы клуба на поле. Нажмите "Перетасовать" для новой расстановки.',
    BATTLE_START: 'Матч начинается! Раскройте схему соперника первым!',
    HIT: 'Попадание!',
    MISS: 'Мимо!',
    SHIP_SUNK: 'Эмблема раскрыта!',
    EXTRA_TURN: 'Дополнительный ход!',
    VICTORY: 'ГОЛ! Вы раскрыли схему соперника!',
    DEFEAT: 'Гол соперника! Ваша схема раскрыта.',
    SPECIAL_CELL_ACTIVATED: 'Специальная ячейка активирована!',
    PROTECTION_ACTIVATED: 'Ячейка защищена! Нужен ещё один ход.',
    ILLUMINATION_ACTIVATED: 'Область подсвечена!',
    INVALID_PLACEMENT: 'Невозможно разместить корабль в этом месте'
};

// Звуки игры
const GAME_SOUNDS = {
    SHOT: 'shot.mp3',
    HIT: 'hit.mp3',
    MISS: 'miss.mp3',
    GOAL: 'goal.mp3',
    SPECIAL: 'special.mp3'
}; 