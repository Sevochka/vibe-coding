// Константы игры
const CELL_SIZE = 30;
const GRID_WIDTH = 22;
const GRID_HEIGHT = 22;
const WALL_COLOR = '#1f6650';
const PUCK_COLOR = '#00a0f0';
const POWER_PUCK_COLOR = '#ffc300';
const GHOST_COLORS = [
  '#ff003c', // красный
  '#ffc300', // желтый
  '#00a0f0', // голубой
  '#964ba0'  // фиолетовый
];

// Изображения
const OVI_IMAGE_SRC = 'https://dumpster.cdn.sports.ru/b/01/a0446c96262bf627643979d401805.png';

// Направления
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
  NONE: { x: 0, y: 0 }
};

// Состояния игры
const GAME_STATES = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  LEVEL_COMPLETE: 'levelComplete'
};

// Типы ячеек
const CELL_TYPES = {
  EMPTY: 0,
  WALL: 1,
  PUCK: 2,
  POWER_PUCK: 3,
  PLAYER_START: 4,
  GHOST_START: 5
};

// Очки
const SCORE_VALUES = {
  PUCK: 10,
  POWER_PUCK: 50,
  GHOST: 200
};

// Длительность эффекта power-up (в миллисекундах)
const POWER_UP_DURATION = 10000;

// Скорости
const SPEEDS = {
  PLAYER: 5,
  GHOST_NORMAL: 3,
  GHOST_FRIGHTENED: 2,
  GHOST_RETURNING: 8
}; 