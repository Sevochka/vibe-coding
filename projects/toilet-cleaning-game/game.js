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
        
        this.init();
    }

    init() {
        this.renderCharacters();
        this.setupEventListeners();
        this.canvas = document.getElementById('toiletCanvas');
        this.ctx = this.canvas.getContext('2d');
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
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

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
        // Рисуем туалет с грязью
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Рисуем форму туалета
        this.drawToiletBowl();
        
        // Добавляем грязь
        this.addDirt();
        
        // Подсчитываем общее количество грязных пикселей
        this.countDirtPixels();
    }

    drawToiletBowl() {
        // Рисуем овальную форму туалета
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.ellipse(
            this.canvas.width / 2, 
            this.canvas.height / 2 + 50, 
            180, 120, 0, 0, 2 * Math.PI
        );
        this.ctx.fill();
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Внутренняя часть
        this.ctx.fillStyle = '#f8f8f8';
        this.ctx.beginPath();
        this.ctx.ellipse(
            this.canvas.width / 2, 
            this.canvas.height / 2 + 50, 
            160, 100, 0, 0, 2 * Math.PI
        );
        this.ctx.fill();
    }

    addDirt() {
        // Добавляем случайные пятна грязи
        const dirtSpots = 15;
        
        for (let i = 0; i < dirtSpots; i++) {
            this.addDirtSpot();
        }
    }

    addDirtSpot() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2 + 50;
        
        // Случайная позиция внутри туалета
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 80;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.6; // Эллипс
        
        const spotSize = 20 + Math.random() * 30;
        
        // Градиент для более реалистичного вида
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, spotSize);
        gradient.addColorStop(0, '#4a3728');
        gradient.addColorStop(0.7, '#6b4423');
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, spotSize, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    countDirtPixels() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        
        this.dirtPixels = [];
        
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const alpha = pixels[i + 3];
            
            // Проверяем, является ли пиксель грязью (темные цвета)
            if (alpha > 0 && r < 150 && g < 150 && b < 150) {
                this.dirtPixels.push(i / 4);
            }
        }
        
        this.totalDirtPixels = this.dirtPixels.length;
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

    startDrawing(e) {
        this.isDrawing = true;
        this.draw(e);
    }

    draw(e) {
        if (!this.isDrawing) return;

        const pos = this.getCanvasPosition(e);
        
        // Стираем грязь (круглая область)
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Возвращаем обычный режим рисования
        this.ctx.globalCompositeOperation = 'source-over';
        
        // Проверяем прогресс
        this.checkProgress();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    checkProgress() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        
        let remainingDirt = 0;
        
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const alpha = pixels[i + 3];
            
            if (alpha > 0 && r < 150 && g < 150 && b < 150) {
                remainingDirt++;
            }
        }
        
        const cleanPercent = Math.max(0, Math.floor((1 - remainingDirt / this.totalDirtPixels) * 100));
        
        // Обновляем UI
        document.getElementById('cleanProgress').style.width = cleanPercent + '%';
        document.getElementById('cleanPercentage').textContent = cleanPercent + '%';
        
        // Проверяем победу (95% чистоты)
        if (cleanPercent >= 95) {
            this.endGame();
        }
    }

    endGame() {
        clearInterval(this.gameTimer);
        
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