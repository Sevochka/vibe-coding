// Основной файл игры Овечкин-Пакмен

// Получаем элементы DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const startButton = document.getElementById('startButton');
const mobileControls = document.getElementById('mobileControls');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

// Настраиваем высокое разрешение канваса
function setupHighDPICanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  
  // Получаем размеры из CSS
  const rect = canvas.getBoundingClientRect();
  
  // Устанавливаем атрибуты размеров канваса с учетом DPR
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  // Масштабируем контекст
  ctx.scale(dpr, dpr);
  
  // Устанавливаем размеры CSS обратно
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  
  return dpr;
}

// Применяем высокое разрешение
const dpr = setupHighDPICanvas(canvas);

// Игровые переменные
let gameState = GAME_STATES.IDLE;
let currentLevel = 0;
let score = 0;
let lives = 3;
let powerMode = false;
let powerModeTimer = null;
let lastFrameTime = 0;
let player = null;
let ghosts = [];
let pucksCount = 0;
let pucksCollected = 0;
let playerImage = new Image();
let ghostImage = new Image();
let puckImage = new Image();

// Добавляем обработку ошибок для изображения игрока
playerImage.onload = function() {
  console.log('Изображение Овечкина загружено успешно');
};

playerImage.onerror = function() {
  console.error('Ошибка загрузки изображения Овечкина:', OVI_IMAGE_SRC);
  // Устанавливаем запасной источник, если основной не загрузился
  this.src = './img/backup-ovi.png';
};

// Загружаем изображение для призраков
ghostImage.onload = function() {
  console.log('Изображение противника загружено успешно');
};

ghostImage.onerror = function() {
  console.error('Ошибка загрузки изображения противника:', GHOST_IMAGE_SRC);
};

// Загружаем изображение для шайбы
puckImage.onload = function() {
  console.log('Изображение шайбы загружено успешно');
};

puckImage.onerror = function() {
  console.error('Ошибка загрузки изображения шайбы:', PUCK_IMAGE_SRC);
};

playerImage.src = OVI_IMAGE_SRC;
ghostImage.src = GHOST_IMAGE_SRC;
puckImage.src = PUCK_IMAGE_SRC;
console.log('Попытка загрузить изображения...');

// Класс для игрока
class Player {
  constructor(x, y) {
    this.x = x * CELL_SIZE;
    this.y = y * CELL_SIZE;
    this.targetX = this.x;
    this.targetY = this.y;
    this.direction = DIRECTIONS.NONE;
    this.nextDirection = DIRECTIONS.NONE;
    this.speed = SPEEDS.PLAYER;
    this.size = MODEL_SIZE;
    this.mouthOpen = 0;
    this.mouthDir = 0.1;
    // Центрируем персонажа в ячейке
    this.centerOffsetX = MODEL_OFFSET;
    this.centerOffsetY = MODEL_OFFSET;
  }

  update(deltaTime) {
    // Проверяем следующее направление
    if (this.nextDirection !== DIRECTIONS.NONE) {
      // Получаем текущие координаты в ячейках
      const currentGridX = Math.floor(this.x / CELL_SIZE);
      const currentGridY = Math.floor(this.y / CELL_SIZE);
      
      // Пробуем сменить направление
      const testX = this.x + this.nextDirection.x;
      const testY = this.y + this.nextDirection.y;
      
      // Если в новом направлении нет стены, меняем направление
      if (!checkWallCollision(testX, testY, this.size, this.centerOffsetX, this.centerOffsetY)) {
        // Если нужно, выравниваем позицию на сетке
        if (this.nextDirection.y !== 0 && this.direction.x !== 0) {
          // При смене с горизонтального на вертикальное движение
          this.x = Math.round(this.x / CELL_SIZE) * CELL_SIZE;
        } else if (this.nextDirection.x !== 0 && this.direction.y !== 0) {
          // При смене с вертикального на горизонтальное движение
          this.y = Math.round(this.y / CELL_SIZE) * CELL_SIZE;
        }
        
        this.direction = this.nextDirection;
        this.nextDirection = DIRECTIONS.NONE;
        console.log(`Смена направления на: ${JSON.stringify(this.direction)}`);
      }
    }
    
    // Если есть активное направление, пытаемся двигаться
    if (this.direction !== DIRECTIONS.NONE) {
      // Рассчитываем новую позицию
      const nextX = this.x + this.direction.x * this.speed;
      const nextY = this.y + this.direction.y * this.speed;
      
      // Проверяем столкновение со стеной
      if (!checkWallCollision(nextX, nextY, this.size, this.centerOffsetX, this.centerOffsetY)) {
        // Нет столкновения, двигаемся
        this.x = nextX;
        this.y = nextY;
        
        // Проверка на туннель (переход с одной стороны на другую)
        if (this.x < 0) {
          this.x = canvas.width - CELL_SIZE;
        } else if (this.x >= canvas.width) {
          this.x = 0;
        }
        if (this.y < 0) {
          this.y = canvas.height - CELL_SIZE;
        } else if (this.y >= canvas.height) {
          this.y = 0;
        }
        
        // Анимация рта
        this.mouthOpen += this.mouthDir;
        if (this.mouthOpen >= 0.5 || this.mouthOpen <= 0) {
          this.mouthDir *= -1;
        }
        
        // Сбор шайб
        checkPuckCollection();
      } else {
        // Выравниваем позицию относительно стены, с которой столкнулись
        if (this.direction.x > 0) {  // вправо
          const nextCellX = Math.floor((nextX + this.centerOffsetX + this.size) / CELL_SIZE);
          this.x = nextCellX * CELL_SIZE - this.size - this.centerOffsetX - 1;
        } else if (this.direction.x < 0) {  // влево
          const nextCellX = Math.floor((nextX + this.centerOffsetX) / CELL_SIZE);
          this.x = (nextCellX + 1) * CELL_SIZE - this.centerOffsetX;
        } else if (this.direction.y > 0) {  // вниз
          const nextCellY = Math.floor((nextY + this.centerOffsetY + this.size) / CELL_SIZE);
          this.y = nextCellY * CELL_SIZE - this.size - this.centerOffsetY - 1;
        } else if (this.direction.y < 0) {  // вверх
          const nextCellY = Math.floor((nextY + this.centerOffsetY) / CELL_SIZE);
          this.y = (nextCellY + 1) * CELL_SIZE - this.centerOffsetY;
        }
      }
    }
  }

  draw() {
    ctx.save();
    
    // Определяем угол поворота в зависимости от направления
    let angle = 0;
    if (this.direction === DIRECTIONS.RIGHT) angle = 0;
    else if (this.direction === DIRECTIONS.DOWN) angle = Math.PI / 2;
    else if (this.direction === DIRECTIONS.LEFT) angle = Math.PI;
    else if (this.direction === DIRECTIONS.UP) angle = Math.PI * 3 / 2;
    
    // Рассчитываем точную позицию центра с учетом смещения
    const centerX = this.x + this.centerOffsetX + this.size / 2;
    const centerY = this.y + this.centerOffsetY + this.size / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    
    try {
      // Рисуем картинку Овечкина
      if (playerImage.complete) {
        ctx.drawImage(
          playerImage, 
          -this.size / 2, 
          -this.size / 2, 
          this.size, 
          this.size
        );
      } else {
        // Если изображение не загружено, рисуем круг
        ctx.fillStyle = '#00c78b';
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } catch (err) {
      console.error('Ошибка при отрисовке игрока:', err);
      // Рисуем запасной вариант в случае ошибки
      ctx.fillStyle = '#00c78b';
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  reset(x, y) {
    this.x = x * CELL_SIZE;
    this.y = y * CELL_SIZE;
    this.targetX = this.x;
    this.targetY = this.y;
    this.direction = DIRECTIONS.NONE;
    this.nextDirection = DIRECTIONS.NONE;
  }
}

// Класс для призраков
class Ghost {
  constructor(x, y, color, index) {
    this.x = x * CELL_SIZE;
    this.y = y * CELL_SIZE;
    this.homeX = x;
    this.homeY = y;
    this.color = color;
    this.direction = DIRECTIONS.RIGHT;
    this.speed = SPEEDS.GHOST_NORMAL;
    this.state = 'normal'; // normal, frightened, returning
    this.size = MODEL_SIZE;
    this.eyeDirection = DIRECTIONS.RIGHT;
    this.index = index;
    this.lastDecisionTime = 0; // Время последнего принятия решения
    this.decisionInterval = 500 + index * 200; // Интервал принятия решений (разный для каждого призрака)
    this.targetX = 0; // Целевая координата X
    this.targetY = 0; // Целевая координата Y
    this.stuckCounter = 0; // Счетчик для определения застревания
    this.lastPosition = { x: this.x, y: this.y }; // Последняя позиция
    this.centerOffsetX = MODEL_OFFSET;
    this.centerOffsetY = MODEL_OFFSET;
  }

  update(deltaTime) {
    // Если призрак возвращается домой
    if (this.state === 'returning') {
      const homeX = this.homeX * CELL_SIZE;
      const homeY = this.homeY * CELL_SIZE;
      
      // Если призрак вернулся домой
      if (Math.abs(this.x - homeX) < this.speed && Math.abs(this.y - homeY) < this.speed) {
        this.x = homeX;
        this.y = homeY;
        this.state = 'normal';
        this.speed = SPEEDS.GHOST_NORMAL;
      } else {
        // Двигаемся к дому напрямую
        const angle = Math.atan2(homeY - this.y, homeX - this.x);
        const nextX = this.x + Math.cos(angle) * this.speed;
        const nextY = this.y + Math.sin(angle) * this.speed;
        
        if (!checkWallCollision(nextX, nextY, this.size, this.centerOffsetX, this.centerOffsetY)) {
          this.x = nextX;
          this.y = nextY;
        } else {
          this.chooseDirection();
        }
        
        return;
      }
    }
    
    // Проверка на застревание
    const distanceMoved = Math.sqrt(
      Math.pow(this.x - this.lastPosition.x, 2) + 
      Math.pow(this.y - this.lastPosition.y, 2)
    );
    
    if (distanceMoved < this.speed * 0.5) {
      this.stuckCounter++;
      if (this.stuckCounter > 5) {
        const dirs = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT];
        this.direction = dirs[Math.floor(Math.random() * dirs.length)];
        this.stuckCounter = 0;
      }
    } else {
      this.stuckCounter = 0;
    }
    
    // Запоминаем текущую позицию
    this.lastPosition = { x: this.x, y: this.y };
    
    // Обновляем направление движения
    const currentTime = Date.now();
    if (currentTime - this.lastDecisionTime > this.decisionInterval) {
      this.lastDecisionTime = currentTime;
      
      // Определяем цель в зависимости от состояния
      if (this.state === 'frightened') {
        const playerGridX = Math.floor(player.x / CELL_SIZE);
        const playerGridY = Math.floor(player.y / CELL_SIZE);
        const ghostGridX = Math.floor(this.x / CELL_SIZE);
        const ghostGridY = Math.floor(this.y / CELL_SIZE);
        
        this.targetX = ghostGridX + (ghostGridX - playerGridX) * 2;
        this.targetY = ghostGridY + (ghostGridY - playerGridY) * 2;
      } else {
        this.targetX = Math.floor(player.x / CELL_SIZE);
        this.targetY = Math.floor(player.y / CELL_SIZE);
      }
      
      this.chooseDirection();
    }
    
    // Двигаемся в выбранном направлении
    const nextX = this.x + this.direction.x * this.speed;
    const nextY = this.y + this.direction.y * this.speed;
    
    if (!checkWallCollision(nextX, nextY, this.size, this.centerOffsetX, this.centerOffsetY)) {
      this.x = nextX;
      this.y = nextY;
      
      // Проверка на туннель
      if (this.x < 0) {
        this.x = canvas.width - CELL_SIZE;
      } else if (this.x >= canvas.width) {
        this.x = 0;
      }
      if (this.y < 0) {
        this.y = canvas.height - CELL_SIZE;
      } else if (this.y >= canvas.height) {
        this.y = 0;
      }
    } else {
      this.chooseDirection();
    }
    
    // Обновляем направление глаз
    this.eyeDirection = this.direction;
    
    // Проверяем столкновение с игроком
    checkPlayerGhostCollision(this);
  }

  draw() {
    ctx.save();
    
    // Рассчитываем точную позицию центра с учетом смещения
    const centerX = this.x + this.centerOffsetX + this.size / 2;
    const centerY = this.y + this.centerOffsetY + this.size / 2;
    
    // Определяем угол поворота на основе направления
    let angle = 0;
    if (this.direction === DIRECTIONS.RIGHT) angle = 0;
    else if (this.direction === DIRECTIONS.DOWN) angle = Math.PI / 2;
    else if (this.direction === DIRECTIONS.LEFT) angle = Math.PI;
    else if (this.direction === DIRECTIONS.UP) angle = Math.PI * 3 / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    
    if (this.state === 'frightened') {
      // В испуганном состоянии рисуем синего призрака
      ctx.fillStyle = '#0040fc';
      
      // Мигаем перед окончанием режима power-up
      if (powerModeTimer && powerModeTimer < 3000 && Math.floor(Date.now() / 200) % 2 === 0) {
        ctx.fillStyle = 'white';
      }
      
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Глаза испуганного призрака
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(-this.size / 4, -this.size / 8, this.size / 8, 0, Math.PI * 2);
      ctx.arc(this.size / 4, -this.size / 8, this.size / 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Зрачки
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(-this.size / 4, -this.size / 8, this.size / 16, 0, Math.PI * 2);
      ctx.arc(this.size / 4, -this.size / 8, this.size / 16, 0, Math.PI * 2);
      ctx.fill();
      
      // Рисуем рот в виде волнистой линии
      ctx.strokeStyle = 'white';
      ctx.lineWidth = this.size / 10;
      ctx.beginPath();
      ctx.moveTo(-this.size / 3, this.size / 5);
      ctx.lineTo(-this.size / 6, this.size / 10);
      ctx.lineTo(this.size / 6, this.size / 5);
      ctx.lineTo(this.size / 3, this.size / 10);
      ctx.stroke();
    } else if (this.state === 'returning') {
      // Если призрак возвращается, рисуем его прозрачным
      ctx.globalAlpha = 0.5;
    }
    
    // Рисуем спрайт призрака если он загружен и призрак не в состоянии испуга
    if (ghostImage.complete && this.state !== 'frightened') {
      ctx.drawImage(
        ghostImage,
        -this.size / 2,
        -this.size / 2,
        this.size,
        this.size
      );
    } else if (this.state !== 'frightened') {
      // Запасной вариант - цветной круг
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Глаза
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(-this.size / 4, -this.size / 8, this.size / 8, 0, Math.PI * 2);
      ctx.arc(this.size / 4, -this.size / 8, this.size / 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Зрачки (смотрят в направлении движения)
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(-this.size / 4 + this.eyeDirection.x * this.size / 16, 
              -this.size / 8 + this.eyeDirection.y * this.size / 16, 
              this.size / 16, 0, Math.PI * 2);
      ctx.arc(this.size / 4 + this.eyeDirection.x * this.size / 16, 
              -this.size / 8 + this.eyeDirection.y * this.size / 16, 
              this.size / 16, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  reset() {
    this.x = this.homeX * CELL_SIZE;
    this.y = this.homeY * CELL_SIZE;
    this.direction = DIRECTIONS.RIGHT;
    this.state = 'normal';
    this.speed = SPEEDS.GHOST_NORMAL;
    this.stuckCounter = 0;
  }

  frighten() {
    if (this.state !== 'returning') {
      this.state = 'frightened';
      this.speed = SPEEDS.GHOST_FRIGHTENED;
      
      // Разворачиваем призрака в противоположном направлении
      this.direction = {
        x: -this.direction.x,
        y: -this.direction.y
      };
      
      // Если направление нулевое, выбираем случайное
      if (this.direction.x === 0 && this.direction.y === 0) {
        const dirs = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT];
        this.direction = dirs[Math.floor(Math.random() * dirs.length)];
      }
    }
  }

  returnHome() {
    this.state = 'returning';
    this.speed = SPEEDS.GHOST_RETURNING;
  }

  chooseDirection() {
    const possibleDirections = [];
    const ghostGridX = Math.floor(this.x / CELL_SIZE);
    const ghostGridY = Math.floor(this.y / CELL_SIZE);
    
    // Проверяем все направления
    const directions = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT];
    
    for (const dir of directions) {
      // Пропускаем противоположное направление (если только призрак не застрял)
      if (this.stuckCounter < 5) {
        if (this.direction.x !== 0 && dir.x === -this.direction.x) continue;
        if (this.direction.y !== 0 && dir.y === -this.direction.y) continue;
      }
      
      // Проверяем столкновение со стеной
      const testX = this.x + dir.x * this.speed;
      const testY = this.y + dir.y * this.speed;
      
      if (!checkWallCollision(testX, testY, this.size, this.centerOffsetX, this.centerOffsetY)) {
        possibleDirections.push(dir);
      }
    }
    
    if (possibleDirections.length === 0) {
      // Если нет доступных направлений, разворачиваемся
      this.direction = {
        x: -this.direction.x,
        y: -this.direction.y
      };
      return;
    }
    
    if (this.state === 'frightened') {
      // В напуганном состоянии двигаемся случайно
      this.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    } else {
      // Выбираем направление ближе к цели
      const scoredDirections = possibleDirections.map(dir => {
        const newX = ghostGridX + dir.x;
        const newY = ghostGridY + dir.y;
        
        // Вычисляем манхэттенское расстояние до цели
        const distanceToTarget = Math.abs(newX - this.targetX) + Math.abs(newY - this.targetY);
        
        // Добавляем случайность
        const randomFactor = Math.random() * 3 * (this.index + 1);
        
        return {
          direction: dir,
          score: distanceToTarget + randomFactor
        };
      });
      
      scoredDirections.sort((a, b) => a.score - b.score);
      this.direction = scoredDirections[0].direction;
    }
  }
}

// Вспомогательные функции
function initLevel(levelIndex) {
  console.log(`Инициализация уровня ${levelIndex}...`);
  const level = LEVELS[levelIndex];
  const map = level.map;
  
  // Сбрасываем переменные уровня
  pucksCount = 0;
  pucksCollected = 0;
  ghosts = [];
  
  // Счетчики для разных типов шайб
  let regularPuckCount = 0;
  let powerPuckCount = 0;
  
  // Позиция игрока
  let playerX = 0;
  let playerY = 0;
  let foundPlayer = false;
  
  // Позиции призраков
  const ghostPositions = [];
  
  // Обходим карту для инициализации
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const cell = map[y][x];
      
      if (cell === CELL_TYPES.PUCK) {
        regularPuckCount++;
        pucksCount++;
      } else if (cell === CELL_TYPES.POWER_PUCK) {
        powerPuckCount++;
        pucksCount++;
      } else if (cell === CELL_TYPES.PLAYER_START) {
        playerX = x;
        playerY = y;
        foundPlayer = true;
      } else if (cell === CELL_TYPES.GHOST_START) {
        ghostPositions.push({ x, y });
      }
    }
  }
  
  // Рассчитываем очки за каждую шайбу, чтобы сумма была ровно 895
  if (pucksCount > 0) {
    // Считаем, что энергетическая шайба стоит в 4 раза больше обычной
    const powerPuckMultiplier = 4;
    
    // Вычисляем, сколько "условных шайб" всего на карте
    const effectivePuckCount = regularPuckCount + powerPuckCount * powerPuckMultiplier;
    
    // Вычисляем базовую стоимость обычной шайбы
    const baseScore = MAX_SCORE / effectivePuckCount;
    
    // Устанавливаем значения в SCORE_VALUES
    SCORE_VALUES.PUCK = Math.floor(baseScore);
    SCORE_VALUES.POWER_PUCK = Math.floor(baseScore * powerPuckMultiplier);
    
    console.log(`Очки рассчитаны: ${regularPuckCount} обычных шайб по ${SCORE_VALUES.PUCK} очков и ${powerPuckCount} энергетических по ${SCORE_VALUES.POWER_PUCK} очков. Всего ${pucksCount} шайб.`);
  }
  
  // Создаем игрока
  if (foundPlayer) {
    console.log(`Создаем игрока на координатах: ${playerX}, ${playerY}`);
    player = new Player(playerX, playerY);
  } else {
    console.error('Не найдена стартовая позиция игрока на карте!');
    // Устанавливаем игрока в центр, если не найдена стартовая позиция
    player = new Player(Math.floor(GRID_WIDTH / 2), Math.floor(GRID_HEIGHT / 2));
  }
  
  // Создаем призраков
  console.log(`Создаем ${Math.min(level.ghostCount, ghostPositions.length)} призраков...`);
  for (let i = 0; i < Math.min(level.ghostCount, ghostPositions.length); i++) {
    const pos = ghostPositions[i % ghostPositions.length];
    const ghost = new Ghost(pos.x, pos.y, GHOST_COLORS[i % GHOST_COLORS.length], i);
    ghosts.push(ghost);
  }
  
  console.log(`Инициализация уровня ${levelIndex} завершена. Найдено шайб: ${pucksCount}`);
}

function isWall(x, y) {
  try {
    // Добавляем дополнительные проверки для безопасности
    if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
      console.error('Некорректные координаты для проверки стены:', x, y);
      return true; // Возвращаем true для безопасности
    }
    
    // Округляем координаты до целых чисел для надежности
    x = Math.floor(x);
    y = Math.floor(y);
    
    // Проверяем, находится ли координата в пределах карты
    if (x < 0 || y < 0 || 
        !LEVELS[currentLevel] || 
        !LEVELS[currentLevel].map || 
        y >= LEVELS[currentLevel].map.length || 
        x >= LEVELS[currentLevel].map[y].length) {
      return false; // За пределами карты не считается стеной (для туннелей)
    }
    
    // Проверяем, является ли ячейка стеной
    const cellType = LEVELS[currentLevel].map[y][x];
    const isWallCell = cellType === CELL_TYPES.WALL;
    
    // Добавляем отладочную информацию
    if (isWallCell) {
      console.log(`Обнаружена стена на координатах x:${x}, y:${y}`);
    }
    
    return isWallCell;
  } catch (err) {
    console.error('Ошибка при проверке стены:', err, 'x:', x, 'y:', y);
    // В случае ошибки возвращаем true, чтобы игрок не прошел через непроверенную область
    return true;
  }
}

function checkPuckCollection() {
  const gridX = Math.floor(player.x / CELL_SIZE);
  const gridY = Math.floor(player.y / CELL_SIZE);
  
  // Проверяем наличие шайбы в текущей ячейке
  if (gridX >= 0 && gridY >= 0 && gridY < LEVELS[currentLevel].map.length && gridX < LEVELS[currentLevel].map[gridY].length) {
    const cell = LEVELS[currentLevel].map[gridY][gridX];
    
    if (cell === CELL_TYPES.PUCK) {
      // Обычная шайба
      LEVELS[currentLevel].map[gridY][gridX] = CELL_TYPES.EMPTY;
      
      // Проверяем, является ли эта шайба последней
      if (pucksCollected + 1 >= pucksCount) {
        // Если это последняя шайба, устанавливаем счет ровно в 895
        score = MAX_SCORE;
      } else {
        // Иначе добавляем стандартные очки за шайбу
        score += SCORE_VALUES.PUCK;
      }
      
      scoreElement.textContent = score;
      pucksCollected++;
      
      // Проверяем завершение уровня
      if (pucksCollected >= pucksCount) {
        levelComplete();
      }
    } else if (cell === CELL_TYPES.POWER_PUCK) {
      // Power-up шайба
      LEVELS[currentLevel].map[gridY][gridX] = CELL_TYPES.EMPTY;
      
      // Проверяем, является ли эта шайба последней
      if (pucksCollected + 1 >= pucksCount) {
        // Если это последняя шайба, устанавливаем счет ровно в 895
        score = MAX_SCORE;
      } else {
        // Иначе добавляем стандартные очки за энергетическую шайбу
        score += SCORE_VALUES.POWER_PUCK;
      }
      
      scoreElement.textContent = score;
      pucksCollected++;
      
      // Включаем режим power-up
      activatePowerMode();
      
      // Проверяем завершение уровня
      if (pucksCollected >= pucksCount) {
        levelComplete();
      }
    }
  }
}

function checkPlayerGhostCollision(ghost) {
  const distance = Math.sqrt(
    Math.pow(player.x - ghost.x, 2) + 
    Math.pow(player.y - ghost.y, 2)
  );
  
  if (distance < CELL_SIZE * 0.7) {
    if (ghost.state === 'frightened') {
      // Призрак съеден
      // Не позволяем счету превысить 895
      if (score + SCORE_VALUES.GHOST <= MAX_SCORE) {
        score += SCORE_VALUES.GHOST;
      } else {
        // Ограничиваем счет значением 895
        score = MAX_SCORE;
      }
      scoreElement.textContent = score;
      ghost.returnHome();
    } else if (ghost.state === 'normal') {
      // Игрок пойман
      playerCaught();
    }
  }
}

function activatePowerMode() {
  // Включаем режим power-up
  powerMode = true;
  
  // Призраки становятся испуганными
  for (const ghost of ghosts) {
    ghost.frighten();
  }
  
  // Сбрасываем таймер, если он уже был запущен
  if (powerModeTimer) {
    clearTimeout(powerModeTimer);
  }
  
  // Устанавливаем таймер для отключения режима
  powerModeTimer = setTimeout(() => {
    powerMode = false;
    powerModeTimer = null;
    
    // Возвращаем призраков в нормальное состояние
    for (const ghost of ghosts) {
      if (ghost.state === 'frightened') {
        ghost.state = 'normal';
        ghost.speed = SPEEDS.GHOST_NORMAL;
      }
    }
  }, POWER_UP_DURATION);
}

function playerCaught() {
  lives--;
  livesElement.textContent = lives;
  
  if (lives <= 0) {
    gameOver();
  } else {
    // Сбрасываем позиции игрока и призраков
    for (let y = 0; y < LEVELS[currentLevel].map.length; y++) {
      for (let x = 0; x < LEVELS[currentLevel].map[y].length; x++) {
        if (LEVELS[currentLevel].map[y][x] === CELL_TYPES.PLAYER_START) {
          player.reset(x, y);
        }
      }
    }
    
    // Сбрасываем призраков
    for (const ghost of ghosts) {
      ghost.reset();
    }
  }
}

function gameOver() {
  gameState = GAME_STATES.GAME_OVER;
  startButton.textContent = 'Попробовать снова';
  startButton.style.display = 'block';
}

function levelComplete() {
  // Когда игрок прошел последний уровень
  if (currentLevel >= LEVELS.length - 1) {
    // Все уровни пройдены, счет уже должен быть равен 895
    gameState = GAME_STATES.IDLE;
    startButton.textContent = 'Играть снова';
    startButton.style.display = 'block';
  } else {
    currentLevel++;
    initLevel(currentLevel);
  }
}

// Функции отрисовки
function drawMap() {
  const map = LEVELS[currentLevel].map;
  
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const cell = map[y][x];
      
      // Отрисовываем только стены и шайбы
      if (cell === CELL_TYPES.WALL) {
        // Стена
        ctx.fillStyle = WALL_COLOR;
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      } else if (cell === CELL_TYPES.PUCK) {
        // Шайба
        if (puckImage.complete) {
          const puckSize = CELL_SIZE / 2.5;
          ctx.drawImage(
            puckImage,
            x * CELL_SIZE + (CELL_SIZE - puckSize) / 2,
            y * CELL_SIZE + (CELL_SIZE - puckSize) / 2,
            puckSize,
            puckSize
          );
        } else {
          // Запасной вариант - цветной круг
          ctx.fillStyle = PUCK_COLOR;
          ctx.beginPath();
          ctx.arc(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 6, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (cell === CELL_TYPES.POWER_PUCK) {
        // Усиленная шайба
        if (puckImage.complete) {
          const powerPuckSize = CELL_SIZE / 1.8;
          ctx.drawImage(
            puckImage,
            x * CELL_SIZE + (CELL_SIZE - powerPuckSize) / 2,
            y * CELL_SIZE + (CELL_SIZE - powerPuckSize) / 2,
            powerPuckSize,
            powerPuckSize
          );
          
          // Добавляем ореол для обозначения усиленной шайбы
          ctx.strokeStyle = POWER_PUCK_COLOR;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 3, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Запасной вариант - цветной круг
          ctx.fillStyle = POWER_PUCK_COLOR;
          ctx.beginPath();
          ctx.arc(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  
  ctx.fillStyle = 'white';
  ctx.font = '48px "Sports", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ИГРА ОКОНЧЕНА', canvas.width / (2 * dpr), canvas.height / (2 * dpr) - 24);
  
  ctx.font = '24px "Neoris", "Roboto", sans-serif';
  
  // Особое сообщение при достижении 895 очков (рекорд Овечкина)
  if (score >= MAX_SCORE) {
    ctx.fillStyle = '#ffc300'; // Золотой цвет для рекорда
    ctx.fillText(`Поздравляем! Вы повторили рекорд Овечкина: ${score} шайб!`, canvas.width / (2 * dpr), canvas.height / (2 * dpr) + 24);
  } else {
    ctx.fillStyle = 'white';
    ctx.fillText(`Шайб забил Овечкин: ${score}/${MAX_SCORE}`, canvas.width / (2 * dpr), canvas.height / (2 * dpr) + 24);
  }
}

function drawLevelComplete() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  
  ctx.fillStyle = 'white';
  ctx.font = '48px "Sports", sans-serif';
  ctx.textAlign = 'center';
  
  // Особое сообщение при достижении 895 очков (рекорд Овечкина)
  if (score >= MAX_SCORE) {
    ctx.fillStyle = '#ffc300'; // Золотой цвет для рекорда
    ctx.fillText('РЕКОРД ОВЕЧКИНА!', canvas.width / (2 * dpr), canvas.height / (2 * dpr) - 24);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px "Neoris", "Roboto", sans-serif';
    ctx.fillText(`Вы набрали ${score} шайб - как великий Александр Овечкин!`, canvas.width / (2 * dpr), canvas.height / (2 * dpr) + 24);
  } else {
    ctx.fillText('УРОВЕНЬ ПРОЙДЕН!', canvas.width / (2 * dpr), canvas.height / (2 * dpr) - 24);
    
    ctx.font = '24px "Neoris", "Roboto", sans-serif';
    ctx.fillText(`Количество собранных шайб: ${score}/${MAX_SCORE}`, canvas.width / (2 * dpr), canvas.height / (2 * dpr) + 24);
  }
}

// Главный цикл игры
function gameLoop(timestamp) {
  // Вычисляем delta time для плавной анимации
  if (!lastFrameTime) {
    lastFrameTime = timestamp;
  }
  
  const deltaTime = timestamp - lastFrameTime;
  lastFrameTime = timestamp;
  
  // Очищаем экран и устанавливаем белый фон
  ctx.fillStyle = GAME_FIELD_COLOR;
  ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  
  // Обновляем и отрисовываем в зависимости от состояния игры
  if (gameState === GAME_STATES.PLAYING) {
    // Обновляем игрока
    player.update(deltaTime);
    
    // Обновляем призраков
    for (const ghost of ghosts) {
      ghost.update(deltaTime);
    }
    
    // Отрисовываем карту
    drawMap();
    
    // Отрисовываем игрока
    player.draw();
    
    // Отрисовываем призраков
    for (const ghost of ghosts) {
      ghost.draw();
    }
  } else if (gameState === GAME_STATES.PAUSED) {
    // В режиме паузы отрисовываем текущее состояние игры
    drawMap();
    player.draw();
    for (const ghost of ghosts) {
      ghost.draw();
    }
    
    // Отображаем сообщение о паузе
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    
    ctx.fillStyle = 'white';
    ctx.font = '36px "Sports", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ПАУЗА', canvas.width / (2 * dpr), canvas.height / (2 * dpr));
    ctx.font = '18px "Neoris", "Roboto", sans-serif';
    ctx.fillText('Нажмите пробел для продолжения', canvas.width / (2 * dpr), canvas.height / (2 * dpr) + 40);
  } else if (gameState === GAME_STATES.GAME_OVER) {
    // Отрисовываем карту
    drawMap();
    
    // Отображаем игрока и призраков в их последних позициях
    player.draw();
    for (const ghost of ghosts) {
      ghost.draw();
    }
    
    // Отображаем сообщение о конце игры
    drawGameOver();
  } else if (gameState === GAME_STATES.LEVEL_COMPLETE) {
    // Отрисовываем сообщение о завершении уровня
    drawLevelComplete();
  }
  
  // Продолжаем цикл, если игра не остановлена или не на паузе
  if (gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.LEVEL_COMPLETE || gameState === GAME_STATES.GAME_OVER) {
    requestAnimationFrame(gameLoop);
  }
}

// Инициализация игры
function initGame() {
  // Сбрасываем игровые переменные
  score = 0;
  lives = 3;
  currentLevel = 0;
  gameState = GAME_STATES.PLAYING;
  
  // Обновляем отображение очков и жизней
  scoreElement.textContent = score;
  livesElement.textContent = lives;
  
  // Инициализируем уровень
  initLevel(currentLevel);
  
  // Скрываем кнопку старта
  startButton.style.display = 'none';
  
  // Запускаем игровой цикл
  lastFrameTime = 0;
  requestAnimationFrame(gameLoop);
}

// Обработчики ввода
function handleKeyDown(e) {
  console.log('Нажата клавиша:', e.key, 'Код:', e.keyCode); // Диагностика
  
  if (gameState !== GAME_STATES.PLAYING) {
    console.log('Игра не в режиме PLAYING, состояние:', gameState);
    return;
  }
  
  // Проверяем, что игрок существует
  if (!player) {
    console.error('Ошибка: объект игрока не инициализирован!');
    return;
  }
  
  let direction = null;
  
  // Задаем следующее направление в зависимости от нажатой клавиши
  switch (e.key) {
    case 'ArrowUp':
    case 'Up': // Для старых браузеров
    case 'w':
    case 'W':
      direction = DIRECTIONS.UP;
      break;
    case 'ArrowDown':
    case 'Down': // Для старых браузеров
    case 's':
    case 'S':
      direction = DIRECTIONS.DOWN;
      break;
    case 'ArrowLeft':
    case 'Left': // Для старых браузеров
    case 'a':
    case 'A':
      direction = DIRECTIONS.LEFT;
      break;
    case 'ArrowRight':
    case 'Right': // Для старых браузеров
    case 'd':
    case 'D':
      direction = DIRECTIONS.RIGHT;
      break;
  }
  
  // Проверка на keyCode для кроссбраузерности
  if (!direction && e.keyCode) {
    switch (e.keyCode) {
      case 38: // Стрелка вверх
        direction = DIRECTIONS.UP;
        break;
      case 40: // Стрелка вниз
        direction = DIRECTIONS.DOWN;
        break;
      case 37: // Стрелка влево
        direction = DIRECTIONS.LEFT;
        break;
      case 39: // Стрелка вправо
        direction = DIRECTIONS.RIGHT;
        break;
    }
  }
  
  // Если направление определено, устанавливаем его и предотвращаем стандартное поведение
  if (direction) {
    console.log('Устанавливаем направление:', direction);
    player.nextDirection = direction;
    e.preventDefault();
  }
}

// Инициализация обработчиков событий
function initEventListeners() {
  // Клавиатура - используем и keydown
  window.addEventListener('keydown', handleKeyDown);
  
  // Добавляем обработчик для нажатия на пробел (пауза)
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
      if (gameState === GAME_STATES.PLAYING) {
        gameState = GAME_STATES.PAUSED;
        console.log('Игра на паузе');
      } else if (gameState === GAME_STATES.PAUSED) {
        gameState = GAME_STATES.PLAYING;
        requestAnimationFrame(gameLoop);
        console.log('Игра продолжена');
      }
      e.preventDefault();
    }
  });
  
  // Кнопка запуска игры
  startButton.addEventListener('click', initGame);
  
  // Отображаем мобильное управление на сенсорных устройствах
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    mobileControls.style.display = 'flex';
  }
  
  // Мобильные кнопки управления - используем как touchstart, так и mousedown
  const setupDirectionButton = (btn, direction) => {
    const setDirection = () => {
      if (gameState === GAME_STATES.PLAYING && player) {
        player.nextDirection = direction;
      }
    };
    
    btn.addEventListener('touchstart', setDirection);
    btn.addEventListener('mousedown', setDirection);
    
    // Предотвращаем двойное срабатывание события на мобильных устройствах
    btn.addEventListener('touchend', (e) => e.preventDefault());
  };
  
  setupDirectionButton(upBtn, DIRECTIONS.UP);
  setupDirectionButton(downBtn, DIRECTIONS.DOWN);
  setupDirectionButton(leftBtn, DIRECTIONS.LEFT);
  setupDirectionButton(rightBtn, DIRECTIONS.RIGHT);
  
  // Добавляем жесты свайпа для мобильных устройств
  let touchStartX = 0;
  let touchStartY = 0;
  
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });
  
  document.addEventListener('touchmove', (e) => {
    if (gameState !== GAME_STATES.PLAYING || !player) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    const diffX = touchX - touchStartX;
    const diffY = touchY - touchStartY;
    
    // Если свайп был достаточно длинным
    if (Math.abs(diffX) > 30 || Math.abs(diffY) > 30) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Горизонтальный свайп
        player.nextDirection = diffX > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
      } else {
        // Вертикальный свайп
        player.nextDirection = diffY > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
      }
      
      // Обновляем точку начала свайпа
      touchStartX = touchX;
      touchStartY = touchY;
    }
  });
}

// Проверка загрузки всех ресурсов
function waitForResources(callback) {
  console.log('Проверка загрузки ресурсов...');
  
  let resourcesLoaded = 0;
  const totalResources = 3; // Три изображения для загрузки
  
  function checkComplete() {
    resourcesLoaded++;
    if (resourcesLoaded >= totalResources) {
      console.log('Все ресурсы загружены');
      callback();
    }
  }
  
  // Проверяем изображение игрока
  if (playerImage.complete) {
    console.log('Изображение игрока уже загружено');
    checkComplete();
  } else {
    console.log('Ожидание загрузки изображения игрока...');
    playerImage.onload = function() {
      console.log('Изображение игрока загружено');
      checkComplete();
    };
    
    playerImage.onerror = function() {
      console.warn('Ошибка загрузки изображения игрока');
      checkComplete();
    };
  }
  
  // Проверяем изображение призрака
  if (ghostImage.complete) {
    console.log('Изображение призрака уже загружено');
    checkComplete();
  } else {
    console.log('Ожидание загрузки изображения призрака...');
    ghostImage.onload = function() {
      console.log('Изображение призрака загружено');
      checkComplete();
    };
    
    ghostImage.onerror = function() {
      console.warn('Ошибка загрузки изображения призрака');
      checkComplete();
    };
  }
  
  // Проверяем изображение шайбы
  if (puckImage.complete) {
    console.log('Изображение шайбы уже загружено');
    checkComplete();
  } else {
    console.log('Ожидание загрузки изображения шайбы...');
    puckImage.onload = function() {
      console.log('Изображение шайбы загружено');
      checkComplete();
    };
    
    puckImage.onerror = function() {
      console.warn('Ошибка загрузки изображения шайбы');
      checkComplete();
    };
  }
  
  // Добавляем таймаут для безопасности
  setTimeout(function() {
    if (resourcesLoaded < totalResources) {
      console.warn('Превышено время ожидания загрузки изображений, продолжаем без них');
      callback();
    }
  }, 5000);
}

// Инициализация после загрузки страницы
window.onload = function() {
  console.log('Страница загружена, инициализация игры...');
  
  try {
    // Ждем загрузки всех ресурсов
    waitForResources(() => {
      try {
        // Инициализируем обработчики событий
        initEventListeners();
        
        // Отображаем кнопку старта
        startButton.style.display = 'block';
        
        // Отрисовываем начальный экран
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        
        ctx.fillStyle = '#00c78b';
        ctx.font = '48px "Sports", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ОВЕЧКИН-ПАКМЕН', canvas.width / (2 * dpr), canvas.height / (2 * dpr) - 50);
        
        ctx.font = '24px "Neoris", "Roboto", sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText('Нажмите кнопку "Начать игру"', canvas.width / (2 * dpr), canvas.height / (2 * dpr) + 20);
        
        // Небольшая анимация для Овечкина
        if (playerImage.complete) {
          const size = CELL_SIZE * 3;
          ctx.drawImage(
            playerImage, 
            canvas.width / (2 * dpr) - size / 2, 
            canvas.height / (2 * dpr) + 40, 
            size, 
            size
          );
        } else {
          console.warn('Невозможно отобразить Овечкина, изображение не загружено');
          ctx.fillStyle = '#000000';
          ctx.font = '16px "Neoris", "Roboto", sans-serif';
          ctx.fillText('Изображение загружается...', canvas.width / (2 * dpr), canvas.height / (2 * dpr) + 70);
        }
        
        console.log('Инициализация завершена, игра готова к запуску');
      } catch (err) {
        console.error('Ошибка инициализации игры:', err);
        // Отображаем сообщение об ошибке на экране
        ctx.fillStyle = 'red';
        ctx.font = '20px "Neoris", "Roboto", sans-serif';
        ctx.fillText('Ошибка инициализации игры', canvas.width / (2 * dpr), canvas.height / (2 * dpr) + 100);
      }
    });
  } catch (err) {
    console.error('Критическая ошибка при загрузке игры:', err);
  }
};

// Функция для проверки столкновения со стеной
function checkWallCollision(x, y, size, offsetX, offsetY) {
  // Получаем координаты углов объекта
  const leftX = Math.floor((x + offsetX) / CELL_SIZE);
  const rightX = Math.floor((x + offsetX + size - 1) / CELL_SIZE);
  const topY = Math.floor((y + offsetY) / CELL_SIZE);
  const bottomY = Math.floor((y + offsetY + size - 1) / CELL_SIZE);
  
  // Проверяем наличие стен в каждом углу
  if (isWall(leftX, topY) || isWall(rightX, topY) || 
      isWall(leftX, bottomY) || isWall(rightX, bottomY)) {
    return true;
  }
  
  return false;
}
