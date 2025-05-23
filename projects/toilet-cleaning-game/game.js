class ToiletCleaningGame {
    constructor() {
        this.selectedCharacter = null;
        this.gameStartTime = null;
        this.gameTimer = null;
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.dirtPixels = [];
        this.totalDirtPixels = 0;
        this.cleanedPixels = 0;
        this.brushCursor = null;
        this.dirtAreas = [];
        
        this.init();
    }

    init() {
        this.renderCharacters();
        this.setupEventListeners();
        this.canvas = document.getElementById('toiletCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.brushCursor = document.getElementById('brushCursor');
        this.setupCanvas();
    }

    renderCharacters() {
        const grid = document.querySelector('.characters-grid');
        grid.innerHTML = '';

        characters.forEach(character => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.dataset.characterId = character.id;
            
            card.innerHTML = `
                <div class="character-avatar">${character.avatar}</div>
                <div class="character-name">${character.name}</div>
                <div class="character-desc">${character.description}</div>
            `;

            card.addEventListener('click', () => this.selectCharacter(character));
            grid.appendChild(card);
        });
    }

    selectCharacter(character) {
        // Убираем выделение со всех карточек
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Выделяем выбранную карточку
        document.querySelector(`[data-character-id="${character.id}"]`).classList.add('selected');
        
        this.selectedCharacter = character;
        document.getElementById('startGame').disabled = false;
    }

    setupEventListeners() {
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('resetGame').addEventListener('click', () => this.resetGame());
        document.getElementById('playAgain').addEventListener('click', () => this.resetGame());
    }

    setupCanvas() {
        // Настройка Canvas для рисования и стирания
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        this.canvas.addEventListener('mouseenter', () => this.showBrush());
        this.canvas.addEventListener('mouseleave', () => this.hideBrush());

        // Touch события для мобильных устройств
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });
    }

    startGame() {
        if (!this.selectedCharacter) return;

        // Скрываем экран выбора персонажа
        document.getElementById('characterSelect').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');

        // Устанавливаем информацию о игроке
        document.getElementById('selectedCharacterAvatar').textContent = this.selectedCharacter.avatar;
        document.getElementById('selectedCharacterName').textContent = this.selectedCharacter.name;

        // Инициализируем игру
        this.gameStartTime = Date.now();
        this.startTimer();
        this.initializeToilet();
    }

    startTimer() {
        this.gameTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('gameTimer').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    initializeToilet() {
        // Очищаем canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем фон ванной комнаты
        this.drawBathroomBackground();
        
        // Рисуем детализированный туалет
        this.drawDetailedToilet();
        
        // Добавляем реалистичную грязь
        this.addRealisticDirt();
        
        // Подсчитываем грязь
        this.countDirtAreas();
    }

    drawBathroomBackground() {
        // Фон плитки
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#f8f8f8');
        gradient.addColorStop(1, '#e8e8e8');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Рисуем плитку (опционально)
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.canvas.width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawDetailedToilet() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2 + 60;

        // Основа туалета (белая керамика)
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, 200, 140, 0, 0, 2 * Math.PI);
        this.ctx.fill();

        // Тень основы
        this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + 3, centerY + 3, 200, 140, 0, 0, 2 * Math.PI);
        this.ctx.fill();

        // Основа туалета повторно (поверх тени)
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, 200, 140, 0, 0, 2 * Math.PI);
        this.ctx.fill();

        // Внешний ободок
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, 200, 140, 0, 0, 2 * Math.PI);
        this.ctx.stroke();

        // Внутренняя чаша (место где будет грязь)
        this.ctx.fillStyle = '#fafafa';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, 170, 110, 0, 0, 2 * Math.PI);
        this.ctx.fill();

        // Внутренний ободок
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, 170, 110, 0, 0, 2 * Math.PI);
        this.ctx.stroke();

        // Сливное отверстие
        this.ctx.fillStyle = '#444';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY + 20, 30, 20, 0, 0, 2 * Math.PI);
        this.ctx.fill();

        // Блики на керамике
        this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX - 50, centerY - 30, 40, 20, 0, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + 60, centerY - 50, 20, 35, 0, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    addRealisticDirt() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2 + 60;
        
        this.dirtAreas = [];

        // Создаем несколько областей грязи
        const dirtSpots = 8 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < dirtSpots; i++) {
            this.addDirtArea(centerX, centerY);
        }

        // Добавляем пятна по краям
        for (let i = 0; i < 6; i++) {
            this.addEdgeDirt(centerX, centerY);
        }
    }

    addDirtArea(centerX, centerY) {
        // Случайная позиция внутри туалетной чаши
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 100 + 20; // От 20 до 120 пикселей от центра
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.7; // Эллиптическая форма

        // Проверяем, что пятно внутри чаши
        const distanceFromCenter = Math.sqrt(
            Math.pow((x - centerX) / 170, 2) + Math.pow((y - centerY) / 110, 2)
        );
        
        if (distanceFromCenter > 1) return; // Пятно за пределами чаши

        const spotSize = 25 + Math.random() * 35;
        const dirtArea = { x, y, size: spotSize, cleaned: false, id: Math.random() };
        
        this.dirtAreas.push(dirtArea);
        this.drawDirtSpot(x, y, spotSize);
    }

    addEdgeDirt(centerX, centerY) {
        // Грязь по краям чаши
        const angle = Math.random() * 2 * Math.PI;
        const radius = 140 + Math.random() * 20; // Ближе к краю
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.7;

        const spotSize = 15 + Math.random() * 20;
        const dirtArea = { x, y, size: spotSize, cleaned: false, id: Math.random() };
        
        this.dirtAreas.push(dirtArea);
        this.drawDirtSpot(x, y, spotSize);
    }

    drawDirtSpot(x, y, size) {
        // Создаем неровное пятно грязи
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
        
        // Разные оттенки коричневого
        const colors = [
            ['#3d2f1f', '#5d3f2f'],
            ['#4a3728', '#6b4423'],
            ['#2f1f0f', '#4f2f1f'],
            ['#5a4738', '#7a5743']
        ];
        
        const colorPair = colors[Math.floor(Math.random() * colors.length)];
        gradient.addColorStop(0, colorPair[0]);
        gradient.addColorStop(0.6, colorPair[1]);
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        
        // Рисуем неровную форму
        this.ctx.beginPath();
        const points = 8;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * 2 * Math.PI;
            const variation = 0.7 + Math.random() * 0.6;
            const radius = size * variation;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    countDirtAreas() {
        this.totalDirtPixels = this.dirtAreas.length;
        this.cleanedPixels = 0;
    }

    getCanvasPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    handleMouseMove(e) {
        const pos = this.getCanvasPosition(e);
        this.updateBrushPosition(pos.x, pos.y);
        
        if (this.isDrawing) {
            this.cleanDirt(pos.x, pos.y);
        }
    }

    updateBrushPosition(x, y) {
        const rect = this.canvas.getBoundingClientRect();
        this.brushCursor.style.left = (x / this.canvas.width * rect.width) + rect.left + 'px';
        this.brushCursor.style.top = (y / this.canvas.height * rect.height) + rect.top + 'px';
    }

    showBrush() {
        this.brushCursor.style.opacity = '1';
    }

    hideBrush() {
        this.brushCursor.style.opacity = '0';
    }

    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getCanvasPosition(e);
        this.cleanDirt(pos.x, pos.y);
    }

    cleanDirt(x, y) {
        const brushSize = 25;
        let cleaned = false;
        
        // Проверяем каждую область грязи
        this.dirtAreas.forEach(dirtArea => {
            if (!dirtArea.cleaned) {
                const distance = Math.sqrt(
                    Math.pow(x - dirtArea.x, 2) + Math.pow(y - dirtArea.y, 2)
                );
                
                // Если ершик достаточно близко к пятну грязи
                if (distance < brushSize + dirtArea.size / 2) {
                    dirtArea.cleaned = true;
                    this.eraseDirtSpot(dirtArea);
                    cleaned = true;
                }
            }
        });
        
        if (cleaned) {
            this.updateProgress();
        }
    }

    eraseDirtSpot(dirtArea) {
        // Стираем пятно, рисуя чистую область поверх
        this.ctx.globalCompositeOperation = 'source-over';
        
        // Рисуем чистый фон
        this.ctx.fillStyle = '#fafafa';
        this.ctx.beginPath();
        this.ctx.arc(dirtArea.x, dirtArea.y, dirtArea.size + 5, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Добавляем блеск чистой поверхности
        this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
        this.ctx.beginPath();
        this.ctx.arc(dirtArea.x - 5, dirtArea.y - 5, dirtArea.size / 3, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    updateProgress() {
        const cleanedCount = this.dirtAreas.filter(area => area.cleaned).length;
        const cleanPercent = Math.floor((cleanedCount / this.totalDirtPixels) * 100);
        
        // Обновляем UI
        document.getElementById('cleanProgress').style.width = cleanPercent + '%';
        document.getElementById('cleanPercentage').textContent = cleanPercent + '%';
        
        // Проверяем победу (100% чистоты)
        if (cleanPercent >= 100) {
            this.endGame();
        }
    }

    endGame() {
        clearInterval(this.gameTimer);
        this.hideBrush();
        
        const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Определяем категорию времени
        let messageCategory = 'slow';
        if (elapsed < timeThresholds.fast) {
            messageCategory = 'fast';
        } else if (elapsed < timeThresholds.medium) {
            messageCategory = 'medium';
        }
        
        // Случайное сообщение из категории
        const messages = victoryMessages[messageCategory];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Показываем экран победы
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('victoryScreen').classList.add('active');
        
        document.getElementById('victoryAvatar').textContent = this.selectedCharacter.avatar;
        document.getElementById('victoryCharacterName').textContent = this.selectedCharacter.name;
        document.getElementById('victoryTime').textContent = timeString;
        document.getElementById('victoryMessage').textContent = randomMessage;
    }

    resetGame() {
        // Сбрасываем все состояния
        clearInterval(this.gameTimer);
        this.selectedCharacter = null;
        this.gameStartTime = null;
        this.cleanedPixels = 0;
        this.totalDirtPixels = 0;
        this.dirtAreas = [];
        this.hideBrush();
        
        // Сбрасываем UI
        document.getElementById('victoryScreen').classList.remove('active');
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('characterSelect').classList.add('active');
        
        document.getElementById('startGame').disabled = true;
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Очищаем Canvas
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Сбрасываем прогресс
        document.getElementById('cleanProgress').style.width = '0%';
        document.getElementById('cleanPercentage').textContent = '0%';
        document.getElementById('gameTimer').textContent = '0:00';
    }
}

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    new ToiletCleaningGame();
}); 