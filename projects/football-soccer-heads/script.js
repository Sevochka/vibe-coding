// Игровые состояния
const GameStates = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over'
};

// Основной класс игры
class SoccerHeadsGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Игровое состояние
    this.state = GameStates.MENU;
    this.selectedPlayer = null;
    this.selectedAI = null;
    this.score = { player: 0, ai: 0 };
    this.maxScore = 5;
    
    // Таймер игры (1 минута = 60000 мс)
    this.gameTime = 60000;
    this.remainingTime = this.gameTime;
    this.gameStartTime = 0;
    
    // Игровые объекты
    this.player = null;
    this.ai = null;
    this.ball = null;
    this.gravity = 0.5;
    this.friction = 0.98;
    
    // Управление
    this.keys = {};
    this.lastTime = 0;
    
    // Размеры поля
    this.fieldWidth = 640;
    this.fieldHeight = 360;
    this.goalWidth = 80;
    this.goalHeight = 100;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.renderTeams();
    this.resize();
  }
  
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = this.fieldWidth;
    this.canvas.height = this.fieldHeight;
  }
  
  setupEventListeners() {
    // Управление клавиатурой
    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        this.keys.space = true;
      }
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.code === 'Space') {
        e.preventDefault();
        this.keys.space = false;
      }
    });
    
    // Кнопки интерфейса
    document.getElementById('start-game').addEventListener('click', () => {
      this.startGame();
    });
    
    document.getElementById('back-to-menu').addEventListener('click', () => {
      this.backToMenu();
    });
    
    document.getElementById('rematch').addEventListener('click', () => {
      this.startGame();
    });
    
    document.getElementById('new-match').addEventListener('click', () => {
      this.backToMenu();
    });
  }
  
  renderTeams() {
    const teamsGrid = document.querySelector('.teams-grid');
    teamsGrid.innerHTML = '';
    
    teams.forEach(team => {
      const teamCard = document.createElement('div');
      teamCard.className = 'team-card';
      teamCard.dataset.teamId = team.id;
      
      const imageUrl = team.employee ? defaultPlayerImages[team.employee] : defaultPlayerImages.default;
      
      teamCard.innerHTML = `
        <img src="${imageUrl}" alt="${team.players[0].name}" onerror="this.src='${defaultPlayerImages.default}'">
        <div class="team-name">${team.name}</div>
      `;
      
      teamCard.addEventListener('click', () => {
        this.selectTeam(team);
      });
      
      teamsGrid.appendChild(teamCard);
    });
  }
  
  selectTeam(team) {
    const teamCards = document.querySelectorAll('.team-card');
    
    if (!this.selectedPlayer) {
      // Выбираем команду игрока
      this.selectedPlayer = team;
      teamCards.forEach(card => {
        if (card.dataset.teamId === team.id) {
          card.classList.add('selected');
        }
      });
      
      this.updateSelectedTeamDisplay('player', team);
    } else if (!this.selectedAI && this.selectedPlayer.id !== team.id) {
      // Выбираем команду ИИ
      this.selectedAI = team;
      teamCards.forEach(card => {
        if (card.dataset.teamId === team.id) {
          card.classList.add('selected');
        }
      });
      
      this.updateSelectedTeamDisplay('ai', team);
      document.getElementById('start-game').disabled = false;
    }
  }
  
  updateSelectedTeamDisplay(type, team) {
    const selector = type === 'player' ? '.player-team' : '.ai-team';
    const container = document.querySelector(selector);
    
    const imageUrl = team.employee ? defaultPlayerImages[team.employee] : defaultPlayerImages.default;
    
    container.innerHTML = `
      <div class="team-label">${type === 'player' ? 'Ваша команда' : 'Соперник'}</div>
      <div class="selected-team-info">
        <img src="${imageUrl}" alt="${team.players[0].name}" onerror="this.src='${defaultPlayerImages.default}'">
        <div class="selected-team-name">${team.name}</div>
      </div>
    `;
  }
  
  startGame() {
    this.state = GameStates.PLAYING;
    this.score = { player: 0, ai: 0 };
    
    // Сбрасываем таймер
    this.remainingTime = this.gameTime;
    this.gameStartTime = performance.now();
    
    // Переключаем экраны
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';
    
    // Обновляем информацию о командах в игре
    this.updateGameHeader();
    
    // Инициализируем игровые объекты
    this.initGameObjects();
    
    // Запускаем игровой цикл
    this.lastTime = performance.now();
    this.gameLoop();
  }
  
  updateGameHeader() {
    const team1Info = document.querySelector('.team1-info');
    const team2Info = document.querySelector('.team2-info');
    
    const playerImageUrl = this.selectedPlayer.employee ? defaultPlayerImages[this.selectedPlayer.employee] : defaultPlayerImages.default;
    const aiImageUrl = this.selectedAI.employee ? defaultPlayerImages[this.selectedAI.employee] : defaultPlayerImages.default;
    
    team1Info.innerHTML = `
      <div class="team-name">${this.selectedPlayer.name}</div>
      <div class="team-icon">
        <img src="${playerImageUrl}" alt="${this.selectedPlayer.players[0].name}" onerror="this.src='${defaultPlayerImages.default}'">
      </div>
    `;
    
    team2Info.innerHTML = `
      <div class="team-icon">
        <img src="${aiImageUrl}" alt="${this.selectedAI.players[0].name}" onerror="this.src='${defaultPlayerImages.default}'">
      </div>
      <div class="team-name">${this.selectedAI.name}</div>
    `;
    
    this.updateScore();
  }
  
  updateScore() {
    document.querySelector('.score-team1').textContent = this.score.player;
    document.querySelector('.score-team2').textContent = this.score.ai;
  }
  
  updateTimer() {
    const seconds = Math.ceil(this.remainingTime / 1000);
    const timerElement = document.querySelector('.game-timer');
    if (timerElement) {
      timerElement.textContent = `${seconds}с`;
      
      // Меняем цвет при малом времени
      if (seconds <= 10) {
        timerElement.style.color = 'var(--sports-red-a700)';
      } else {
        timerElement.style.color = 'var(--sports-grey-600)';
      }
    }
  }
  
  endGameByTime() {
    this.state = GameStates.GAME_OVER;
    
    // Переключаем на экран результатов
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'flex';
    
    // Обновляем результаты
    this.updateResultScreen(true);
  }
  
  initGameObjects() {
    // Создаем игрока
    this.player = new Player(150, 250, this.selectedPlayer, true);
    
    // Создаем ИИ
    this.ai = new Player(490, 250, this.selectedAI, false);
    
    // Создаем мяч
    this.ball = new Ball(320, 200);
  }
  
  gameLoop(currentTime = 0) {
    if (this.state !== GameStates.PLAYING) return;
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    this.update(deltaTime);
    this.render();
    
    requestAnimationFrame((time) => this.gameLoop(time));
  }
  
  update(deltaTime) {
    // Обновляем таймер
    this.remainingTime = Math.max(0, this.gameTime - (performance.now() - this.gameStartTime));
    
    // Проверяем, закончилось ли время
    if (this.remainingTime <= 0) {
      this.endGameByTime();
      return;
    }
    
    // Обновляем игрока
    this.player.update(this.keys, deltaTime);
    
    // Обновляем ИИ
    this.ai.updateAI(this.ball, deltaTime);
    
    // Обновляем мяч
    this.ball.update(deltaTime);
    
    // Проверяем столкновения
    this.checkCollisions();
    
    // Проверяем голы
    this.checkGoals();
    
    // Ограничиваем игроков полем
    this.constrainPlayers();
    
    // Обновляем отображение времени
    this.updateTimer();
  }
  
  checkCollisions() {
    // Столкновение игрока с мячом
    if (this.checkPlayerBallCollision(this.player, this.ball)) {
      this.handlePlayerBallCollision(this.player, this.ball);
    }
    
    // Столкновение ИИ с мячом
    if (this.checkPlayerBallCollision(this.ai, this.ball)) {
      this.handlePlayerBallCollision(this.ai, this.ball);
    }
  }
  
  checkPlayerBallCollision(player, ball) {
    const dx = player.x - ball.x;
    const dy = player.y - ball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < player.radius + ball.radius;
  }
  
  handlePlayerBallCollision(player, ball) {
    const dx = ball.x - player.x;
    const dy = ball.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < player.radius + ball.radius) {
      // Нормализуем вектор столкновения
      const nx = dx / distance;
      const ny = dy / distance;
      
      // Разделяем объекты
      const overlap = player.radius + ball.radius - distance;
      ball.x += nx * overlap * 0.5;
      ball.y += ny * overlap * 0.5;
      player.x -= nx * overlap * 0.5;
      player.y -= ny * overlap * 0.5;
      
      // Применяем импульс
      const relativeVelocityX = ball.velocityX - player.velocityX;
      const relativeVelocityY = ball.velocityY - player.velocityY;
      const velocityAlongNormal = relativeVelocityX * nx + relativeVelocityY * ny;
      
      if (velocityAlongNormal > 0) return;
      
      const restitution = 0.8;
      const impulse = -(1 + restitution) * velocityAlongNormal;
      const impulseX = impulse * nx;
      const impulseY = impulse * ny;
      
      ball.velocityX += impulseX * 0.8;
      ball.velocityY += impulseY * 0.8;
      player.velocityX -= impulseX * 0.2;
      player.velocityY -= impulseY * 0.2;
    }
  }
  
  checkGoals() {
    // Левые ворота (гол ИИ)
    if (this.ball.x - this.ball.radius < 0 && 
        this.ball.y > (this.fieldHeight - this.goalHeight) / 2 && 
        this.ball.y < (this.fieldHeight + this.goalHeight) / 2) {
      this.score.ai++;
      this.resetPositions();
      this.updateScore();
      
      if (this.score.ai >= this.maxScore) {
        this.endGame();
      }
    }
    
    // Правые ворота (гол игрока)
    if (this.ball.x + this.ball.radius > this.fieldWidth && 
        this.ball.y > (this.fieldHeight - this.goalHeight) / 2 && 
        this.ball.y < (this.fieldHeight + this.goalHeight) / 2) {
      this.score.player++;
      this.resetPositions();
      this.updateScore();
      
      if (this.score.player >= this.maxScore) {
        this.endGame();
      }
    }
  }
  
  resetPositions() {
    this.player.x = 150;
    this.player.y = 250;
    this.player.velocityX = 0;
    this.player.velocityY = 0;
    
    this.ai.x = 490;
    this.ai.y = 250;
    this.ai.velocityX = 0;
    this.ai.velocityY = 0;
    
    this.ball.x = 320;
    this.ball.y = 200;
    this.ball.velocityX = 0;
    this.ball.velocityY = 0;
  }
  
  constrainPlayers() {
    // Ограничиваем игрока
    this.constrainPlayer(this.player);
    this.constrainPlayer(this.ai);
    
    // Ограничиваем мяч
    this.constrainBall();
  }
  
  constrainPlayer(player) {
    if (player.x - player.radius < 0) {
      player.x = player.radius;
      player.velocityX = 0;
    }
    if (player.x + player.radius > this.fieldWidth) {
      player.x = this.fieldWidth - player.radius;
      player.velocityX = 0;
    }
    if (player.y + player.radius > this.fieldHeight) {
      player.y = this.fieldHeight - player.radius;
      player.velocityY = 0;
      player.onGround = true;
    }
  }
  
  constrainBall() {
    const goalY1 = (this.fieldHeight - this.goalHeight) / 2;
    const goalY2 = (this.fieldHeight + this.goalHeight) / 2;
    
    // Боковые стенки (исключая зону ворот)
    if (this.ball.x - this.ball.radius < 0) {
      if (this.ball.y < goalY1 || this.ball.y > goalY2) {
        this.ball.x = this.ball.radius + 1; // Небольшой отступ от стены
        this.ball.velocityX = Math.abs(this.ball.velocityX) * 0.7; // Отскок вправо
      }
    }
    
    if (this.ball.x + this.ball.radius > this.fieldWidth) {
      if (this.ball.y < goalY1 || this.ball.y > goalY2) {
        this.ball.x = this.fieldWidth - this.ball.radius - 1; // Небольшой отступ от стены
        this.ball.velocityX = -Math.abs(this.ball.velocityX) * 0.7; // Отскок влево
      }
    }
    
    // Верхняя и нижняя стенки
    if (this.ball.y - this.ball.radius < 0) {
      this.ball.y = this.ball.radius + 1;
      this.ball.velocityY = Math.abs(this.ball.velocityY) * 0.7; // Отскок вниз
    }
    
    if (this.ball.y + this.ball.radius > this.fieldHeight) {
      this.ball.y = this.fieldHeight - this.ball.radius - 1;
      this.ball.velocityY = -Math.abs(this.ball.velocityY) * 0.7; // Отскок вверх
      this.ball.velocityX *= 0.95; // Трение о землю
    }
    
    // Предотвращаем застревание в углах
    if (this.ball.x < this.ball.radius + 5 && this.ball.y < goalY1) {
      this.ball.velocityX = Math.abs(this.ball.velocityX) + 1;
      this.ball.velocityY = Math.abs(this.ball.velocityY) + 1;
    }
    
    if (this.ball.x > this.fieldWidth - this.ball.radius - 5 && this.ball.y < goalY1) {
      this.ball.velocityX = -Math.abs(this.ball.velocityX) - 1;
      this.ball.velocityY = Math.abs(this.ball.velocityY) + 1;
    }
    
    if (this.ball.x < this.ball.radius + 5 && this.ball.y > goalY2) {
      this.ball.velocityX = Math.abs(this.ball.velocityX) + 1;
      this.ball.velocityY = -Math.abs(this.ball.velocityY) - 1;
    }
    
    if (this.ball.x > this.fieldWidth - this.ball.radius - 5 && this.ball.y > goalY2) {
      this.ball.velocityX = -Math.abs(this.ball.velocityX) - 1;
      this.ball.velocityY = -Math.abs(this.ball.velocityY) - 1;
    }
  }
  
  render() {
    // Очищаем canvas
    this.ctx.clearRect(0, 0, this.fieldWidth, this.fieldHeight);
    
    // Рисуем поле
    this.drawField();
    
    // Рисуем ворота
    this.drawGoals();
    
    // Рисуем игроков
    this.player.draw(this.ctx);
    this.ai.draw(this.ctx);
    
    // Рисуем мяч
    this.ball.draw(this.ctx);
  }
  
  drawField() {
    // Фон поля
    this.ctx.fillStyle = '#4a8f2d';
    this.ctx.fillRect(0, 0, this.fieldWidth, this.fieldHeight);
    
    // Центральная линия
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(this.fieldWidth / 2, 0);
    this.ctx.lineTo(this.fieldWidth / 2, this.fieldHeight);
    this.ctx.stroke();
    
    // Центральный круг
    this.ctx.beginPath();
    this.ctx.arc(this.fieldWidth / 2, this.fieldHeight / 2, 50, 0, Math.PI * 2);
    this.ctx.stroke();
  }
  
  drawGoals() {
    const goalY = (this.fieldHeight - this.goalHeight) / 2;
    const goalDepth = 15;
    
    // Левые ворота
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 4;
    
    // Фон ворот
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(-goalDepth, goalY, goalDepth, this.goalHeight);
    
    // Каркас левых ворот
    this.ctx.beginPath();
    this.ctx.moveTo(0, goalY);
    this.ctx.lineTo(-goalDepth, goalY);
    this.ctx.lineTo(-goalDepth, goalY + this.goalHeight);
    this.ctx.lineTo(0, goalY + this.goalHeight);
    this.ctx.stroke();
    
    // Правые ворота
    // Фон ворот
    this.ctx.fillRect(this.fieldWidth, goalY, goalDepth, this.goalHeight);
    
    // Каркас правых ворот
    this.ctx.beginPath();
    this.ctx.moveTo(this.fieldWidth, goalY);
    this.ctx.lineTo(this.fieldWidth + goalDepth, goalY);
    this.ctx.lineTo(this.fieldWidth + goalDepth, goalY + this.goalHeight);
    this.ctx.lineTo(this.fieldWidth, goalY + this.goalHeight);
    this.ctx.stroke();
    
    // Сетка ворот
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 1;
    
    // Сетка левых ворот
    for (let i = 1; i < 4; i++) {
      const y = goalY + (this.goalHeight / 4) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(-goalDepth, y);
      this.ctx.lineTo(0, y);
      this.ctx.stroke();
    }
    
    // Сетка правых ворот
    for (let i = 1; i < 4; i++) {
      const y = goalY + (this.goalHeight / 4) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(this.fieldWidth, y);
      this.ctx.lineTo(this.fieldWidth + goalDepth, y);
      this.ctx.stroke();
    }
  }
  
  endGame() {
    this.state = GameStates.GAME_OVER;
    
    // Переключаем на экран результатов
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'flex';
    
    // Обновляем результаты
    this.updateResultScreen();
  }
  
  updateResultScreen(timeUp = false) {
    const team1Result = document.querySelector('.team1-result');
    const team2Result = document.querySelector('.team2-result');
    const resultMessage = document.querySelector('.result-message');
    
    const playerImageUrl = this.selectedPlayer.employee ? defaultPlayerImages[this.selectedPlayer.employee] : defaultPlayerImages.default;
    const aiImageUrl = this.selectedAI.employee ? defaultPlayerImages[this.selectedAI.employee] : defaultPlayerImages.default;
    
    team1Result.innerHTML = `
      <div class="team-name">${this.selectedPlayer.name}</div>
      <div class="team-icon">
        <img src="${playerImageUrl}" alt="${this.selectedPlayer.players[0].name}" onerror="this.src='${defaultPlayerImages.default}'">
      </div>
      <div class="final-score">${this.score.player}</div>
    `;
    
    team2Result.innerHTML = `
      <div class="team-icon">
        <img src="${aiImageUrl}" alt="${this.selectedAI.players[0].name}" onerror="this.src='${defaultPlayerImages.default}'">
      </div>
      <div class="team-name">${this.selectedAI.name}</div>
      <div class="final-score">${this.score.ai}</div>
    `;
    
    if (timeUp) {
      if (this.score.player > this.score.ai) {
        resultMessage.innerHTML = `⏰ Время истекло!<br/>🎉 Победа команды ${this.selectedPlayer.name}!`;
        resultMessage.style.color = 'var(--sports-primary-color)';
      } else if (this.score.ai > this.score.player) {
        resultMessage.innerHTML = `⏰ Время истекло!<br/>😔 Победа команды ${this.selectedAI.name}`;
        resultMessage.style.color = 'var(--sports-red-a700)';
      } else {
        resultMessage.innerHTML = `⏰ Время истекло!<br/>🤝 Ничья!`;
        resultMessage.style.color = 'var(--sports-grey-600)';
      }
    } else {
      if (this.score.player > this.score.ai) {
        resultMessage.textContent = `🎉 Победа команды ${this.selectedPlayer.name}!`;
        resultMessage.style.color = 'var(--sports-primary-color)';
      } else {
        resultMessage.textContent = `😔 Победа команды ${this.selectedAI.name}`;
        resultMessage.style.color = 'var(--sports-red-a700)';
      }
    }
  }
  
  backToMenu() {
    this.state = GameStates.MENU;
    this.selectedPlayer = null;
    this.selectedAI = null;
    
    // Сбрасываем выбор команд
    document.querySelectorAll('.team-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    document.querySelector('.player-team').innerHTML = `
      <div class="team-label">Ваша команда</div>
      <div class="team-placeholder">Выберите команду</div>
    `;
    
    document.querySelector('.ai-team').innerHTML = `
      <div class="team-label">Соперник</div>
      <div class="team-placeholder">Выберите команду</div>
    `;
    
    document.getElementById('start-game').disabled = true;
    
    // Переключаем экраны
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
  }
}

// Класс игрока
class Player {
  constructor(x, y, team, isPlayer) {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.radius = 25;
    this.team = team;
    this.isPlayer = isPlayer;
    this.onGround = false;
    this.speed = 3;
    this.jumpPower = 12;
  }
  
  update(keys, deltaTime) {
    if (!this.isPlayer) return;
    
    const acceleration = 0.4;
    const maxSpeed = 4;
    
    // Управление движением с плавным ускорением
    if (keys['ArrowLeft']) {
      this.velocityX -= acceleration;
      this.velocityX = Math.max(this.velocityX, -maxSpeed);
    } else if (keys['ArrowRight']) {
      this.velocityX += acceleration;
      this.velocityX = Math.min(this.velocityX, maxSpeed);
    } else {
      // Плавное торможение
      this.velocityX *= 0.85;
    }
    
    // Прыжок
    if ((keys['ArrowUp'] || keys.space) && this.onGround) {
      this.velocityY = -this.jumpPower;
      this.onGround = false;
    }
    
    // Применяем гравитацию
    this.velocityY += 0.4;
    
    // Ограничиваем максимальную скорость падения
    this.velocityY = Math.min(this.velocityY, 12);
    
    // Обновляем позицию
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
  
  updateAI(ball, deltaTime) {
    if (this.isPlayer) return;
    
    // Простой ИИ: движется к мячу
    const ballDirection = ball.x - this.x;
    const ballDistance = Math.abs(ballDirection);
    
    // Движение к мячу
    if (ballDistance > 10) {
      if (ballDirection > 0) {
        this.velocityX += this.speed * 0.2;
      } else {
        this.velocityX -= this.speed * 0.2;
      }
    }
    
    // Прыжок если мяч близко и выше
    if (ballDistance < 60 && ball.y < this.y - 20 && this.onGround) {
      this.velocityY = -this.jumpPower * 0.8;
      this.onGround = false;
    }
    
    // Применяем гравитацию
    this.velocityY += 0.5;
    
    // Применяем трение
    this.velocityX *= 0.9;
    
    // Обновляем позицию
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
  
  draw(ctx) {
    // Тело (овал)
    ctx.fillStyle = this.team.color;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 15, this.radius * 0.6, this.radius * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Голова (большой круг)
    ctx.fillStyle = '#ffdbac';
    ctx.beginPath();
    ctx.arc(this.x, this.y - 10, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Глаза
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(this.x - 8, this.y - 15, 3, 0, Math.PI * 2);
    ctx.arc(this.x + 8, this.y - 15, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Рот
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y - 5, 8, 0, Math.PI);
    ctx.stroke();
    
    // Ноги
    ctx.fillStyle = this.team.color;
    ctx.beginPath();
    ctx.ellipse(this.x - 10, this.y + 35, 5, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(this.x + 10, this.y + 35, 5, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Класс мяча
class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.radius = 12;
  }
  
  update(deltaTime) {
    // Применяем гравитацию
    this.velocityY += 0.35;
    
    // Применяем сопротивление воздуха
    this.velocityX *= 0.999;
    this.velocityY *= 0.999;
    
    // Ограничиваем скорость мяча
    const maxSpeed = 15;
    if (Math.abs(this.velocityX) > maxSpeed) {
      this.velocityX = Math.sign(this.velocityX) * maxSpeed;
    }
    if (Math.abs(this.velocityY) > maxSpeed) {
      this.velocityY = Math.sign(this.velocityY) * maxSpeed;
    }
    
    // Обновляем позицию
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
  
  draw(ctx) {
    // Мяч
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Узор на мяче
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 2);
    ctx.moveTo(this.x - this.radius * 0.8, this.y);
    ctx.lineTo(this.x + this.radius * 0.8, this.y);
    ctx.moveTo(this.x, this.y - this.radius * 0.8);
    ctx.lineTo(this.x, this.y + this.radius * 0.8);
    ctx.stroke();
  }
}

// Инициализация игры
let game;

document.addEventListener('DOMContentLoaded', () => {
  game = new SoccerHeadsGame();
}); 