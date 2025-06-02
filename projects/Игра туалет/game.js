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
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseInCanvas = false;
        
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
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });

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
        this.canvas.addEventListener('mouseenter', (e) => {
            this.isMouseInCanvas = true;
            this.showBrush();
            this.handleMouseMove(e);
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.isMouseInCanvas = false;
            this.hideBrush();
        });

        // Touch события для мобильных устройств
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.isMouseInCanvas = true;
            this.showBrush();
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
            this.isMouseInCanvas = false;
            this.hideBrush();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });
    }

    startGame() {
        if (!this.selectedCharacter) return;

        document.getElementById('characterSelect').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');

        document.getElementById('selectedCharacterAvatar').textContent = this.selectedCharacter.avatar;
        document.getElementById('selectedCharacterName').textContent = this.selectedCharacter.name;

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
        
        // Рисуем реалистичный унитаз сверху
        this.drawRealisticToilet();
        
        // Добавляем реалистичную грязь
        this.addRealisticDirt();
        
        // Подсчитываем грязь
        this.countDirtAreas();
    }

    drawBathroomBackground() {
        // Фон пола
        const floorGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        floorGradient.addColorStop(0, '#f5f5f5');
        floorGradient.addColorStop(1, '#e8e8e8');
        this.ctx.fillStyle = floorGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Рисуем плитку
        this.ctx.strokeStyle = '#d0d0d0';
        this.ctx.lineWidth = 1;
        
        // Горизонтальные линии
        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Вертикальные линии
        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
    }

    drawRealisticToilet() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2 + 20;

        // Тень под унитазом
        this.ctx.fillStyle = 'rgba(0,0,0,0.15)';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + 5, centerY + 5, 220, 160, 0, 0, 2 * Math.PI);
        this.ctx.fill();

        // Основание унитаза (внешний корпус)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, 215, 155, 0, 0, 2 * Math.PI);
        this.ctx.fill();

        // Обводка основания
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, 215, 155, 0, 0, 2 * Math.PI);
        this.ctx.stroke();

        // Внутренняя чаша (основная рабочая область)
        const bowlGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 140);
        bowlGradient.addColorStop(0, '#ffffff');
        bowlGradient.addColorStop(0.7, '#f8f8f8');
        bowlGradient.addColorStop(1, '#f0f0f0');
        
        this.ctx.fillStyle = bowlGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, 180, 130, 0, 0, 2 * Math.PI);
        this.ctx.fill();

        // Обводка внутренней чаши
        this.ctx.strokeStyle = '#d5d5d5';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, 180, 130, 0, 0, 2 * Math.PI);
        this.ctx.stroke();

        // Сливное отверстие (более реалистичное)
        const drainGradient = this.ctx.createRadialGradient(centerX, centerY + 30, 0, centerX, centerY + 30, 40);
        drainGradient.addColorStop(0, '#2a2a2a');
        drainGradient.addColorStop(0.6, '#404040');
        drainGradient.addColorStop(1, '#606060');
        
        this.ctx.fillStyle = drainGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY + 30, 35, 25, 0, 0, 2 * Math.PI);
        this.ctx.fill();

        // Край сливного отверстия
        this.ctx.strokeStyle = '#888';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY + 30, 35, 25, 0, 0, 2 * Math.PI);
        this.ctx.stroke();

        // Блики на керамике (реалистичные отражения)
        this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX - 60, centerY - 40, 35, 20, -0.3, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX - 80, centerY - 20, 20, 40, -0.5, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + 70, centerY - 60, 25, 15, 0.4, 0, 2 * Math.PI);
        this.ctx.fill();

        // Задняя часть унитаза (более объемный вид)
        this.ctx.fillStyle = '#f8f8f8';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY - 100, 100, 30, 0, 0, Math.PI);
        this.ctx.fill();

        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY - 100, 100, 30, 0, 0, Math.PI);
        this.ctx.stroke();
    }

    addRealisticDirt() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2 + 20;
        
        this.dirtAreas = [];

        // Создаем области грязи внутри чаши
        const dirtSpots = 12 + Math.floor(Math.random() * 6);
        
        for (let i = 0; i < dirtSpots; i++) {
            this.addDirtArea(centerX, centerY);
        }

        // Добавляем пятна по краям чаши
        for (let i = 0; i < 8; i++) {
            this.addEdgeDirt(centerX, centerY);
        }

        // Добавляем грязь возле сливного отверстия
        for (let i = 0; i < 4; i++) {
            this.addDrainDirt(centerX, centerY + 30);
        }
    }

    addDirtArea(centerX, centerY) {
        // Случайная позиция внутри туалетной чаши (расширенная зона)
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 120 + 15;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.72;

        // Проверяем, что пятно внутри чаши (более мягкая проверка)
        const distanceFromCenter = Math.sqrt(
            Math.pow((x - centerX) / 180, 2) + Math.pow((y - centerY) / 130, 2)
        );
        
        if (distanceFromCenter > 0.95) return;

        const spotSize = 20 + Math.random() * 25;
        const dirtArea = { 
            x, y, 
            size: spotSize, 
            cleaned: false, 
            id: Math.random(),
            opacity: 0.8 + Math.random() * 0.2
        };
        
        this.dirtAreas.push(dirtArea);
        this.drawDirtSpot(x, y, spotSize, dirtArea.opacity);
    }

    addEdgeDirt(centerX, centerY) {
        // Грязь по краям чаши
        const angle = Math.random() * 2 * Math.PI;
        const radius = 140 + Math.random() * 25;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.72;

        const spotSize = 12 + Math.random() * 18;
        const dirtArea = { 
            x, y, 
            size: spotSize, 
            cleaned: false, 
            id: Math.random(),
            opacity: 0.6 + Math.random() * 0.3
        };
        
        this.dirtAreas.push(dirtArea);
        this.drawDirtSpot(x, y, spotSize, dirtArea.opacity);
    }

    addDrainDirt(centerX, centerY) {
        // Грязь возле сливного отверстия
        const angle = Math.random() * 2 * Math.PI;
        const radius = 40 + Math.random() * 30;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.6;

        const spotSize = 15 + Math.random() * 20;
        const dirtArea = { 
            x, y, 
            size: spotSize, 
            cleaned: false, 
            id: Math.random(),
            opacity: 0.9 + Math.random() * 0.1
        };
        
        this.dirtAreas.push(dirtArea);
        this.drawDirtSpot(x, y, spotSize, dirtArea.opacity);
    }

    drawDirtSpot(x, y, size, opacity = 1) {
        // Создаем неровное пятно грязи с улучшенным реализмом
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
        
        // Более разнообразные оттенки грязи
        const dirtColors = [
            [`rgba(61, 47, 31, ${opacity})`, `rgba(93, 63, 47, ${opacity * 0.7})`],
            [`rgba(74, 55, 40, ${opacity})`, `rgba(107, 68, 35, ${opacity * 0.7})`],
            [`rgba(47, 31, 15, ${opacity})`, `rgba(79, 47, 31, ${opacity * 0.7})`],
            [`rgba(90, 71, 56, ${opacity})`, `rgba(120, 87, 67, ${opacity * 0.7})`],
            [`rgba(45, 35, 25, ${opacity})`, `rgba(75, 55, 35, ${opacity * 0.7})`]
        ];
        
        const colorPair = dirtColors[Math.floor(Math.random() * dirtColors.length)];
        gradient.addColorStop(0, colorPair[0]);
        gradient.addColorStop(0.6, colorPair[1]);
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        
        // Рисуем более органичную форму
        this.ctx.beginPath();
        const points = 6 + Math.floor(Math.random() * 4);
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * 2 * Math.PI;
            const variation = 0.6 + Math.random() * 0.8;
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

        // Добавляем текстуру грязи
        this.ctx.fillStyle = colorPair[0].replace(opacity.toString(), (opacity * 0.3).toString());
        for (let i = 0; i < 3; i++) {
            const dotX = x + (Math.random() - 0.5) * size;
            const dotY = y + (Math.random() - 0.5) * size;
            const dotSize = 1 + Math.random() * 3;
            this.ctx.beginPath();
            this.ctx.arc(dotX, dotY, dotSize, 0, 2 * Math.PI);
            this.ctx.fill();
        }
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
        if (!this.isMouseInCanvas) return;
        
        const pos = this.getCanvasPosition(e);
        this.mouseX = pos.x;
        this.mouseY = pos.y;
        
        // Плавное обновление позиции губки
        this.updateBrushPosition(pos.x, pos.y);
        
        if (this.isDrawing) {
            this.cleanDirt(pos.x, pos.y);
        }
    }

    updateBrushPosition(x, y) {
        if (!this.brushCursor) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const screenX = (x / this.canvas.width * rect.width) + rect.left;
        const screenY = (y / this.canvas.height * rect.height) + rect.top;
        
        // Плавное движение губки с CSS transition
        this.brushCursor.style.left = screenX + 'px';
        this.brushCursor.style.top = screenY + 'px';
        
        // Убеждаемся что губка видна когда мышь в canvas
        if (this.isMouseInCanvas) {
            this.brushCursor.style.opacity = '1';
        }
    }

    showBrush() {
        if (this.brushCursor) {
            this.brushCursor.style.opacity = '1';
            this.brushCursor.style.transition = 'opacity 0.2s ease';
        }
    }

    hideBrush() {
        if (this.brushCursor) {
            this.brushCursor.style.opacity = '0';
            this.brushCursor.style.transition = 'opacity 0.2s ease';
        }
    }

    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getCanvasPosition(e);
        this.cleanDirt(pos.x, pos.y);
        
        // Добавляем эффект "залипания" - увеличиваем губку при нажатии
        if (this.brushCursor) {
            this.brushCursor.style.transform = 'translate(-12px, -12px) scale(1.2)';
            this.brushCursor.style.transition = 'transform 0.1s ease';
        }
    }

    cleanDirt(x, y) {
        const brushSize = 35; // Увеличенный размер губки
        let cleaned = false;
        
        // Проверяем каждую область грязи
        this.dirtAreas.forEach(dirtArea => {
            if (!dirtArea.cleaned) {
                const distance = Math.sqrt(
                    Math.pow(x - dirtArea.x, 2) + Math.pow(y - dirtArea.y, 2)
                );
                
                // Более щедрая зона очистки
                if (distance < brushSize + dirtArea.size / 1.5) {
                    dirtArea.cleaned = true;
                    this.eraseDirtSpot(dirtArea);
                    cleaned = true;
                    
                    // Эффект "блеска" при очистке
                    this.addSparkleEffect(dirtArea.x, dirtArea.y);
                }
            }
        });
        
        if (cleaned) {
            this.updateProgress();
        }
    }

    addSparkleEffect(x, y) {
        // Кратковременный эффект блеска
        this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 8, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Убираем эффект через короткое время
        setTimeout(() => {
            this.ctx.fillStyle = '#fafafa';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 10, 0, 2 * Math.PI);
            this.ctx.fill();
        }, 150);
    }

    eraseDirtSpot(dirtArea) {
        // Стираем пятно более аккуратно
        this.ctx.globalCompositeOperation = 'source-over';
        
        // Рисуем чистый фон того же цвета что и чаша
        const cleanGradient = this.ctx.createRadialGradient(
            dirtArea.x, dirtArea.y, 0, 
            dirtArea.x, dirtArea.y, dirtArea.size + 8
        );
        cleanGradient.addColorStop(0, '#ffffff');
        cleanGradient.addColorStop(0.7, '#f8f8f8');
        cleanGradient.addColorStop(1, 'rgba(248,248,248,0)');
        
        this.ctx.fillStyle = cleanGradient;
        this.ctx.beginPath();
        this.ctx.arc(dirtArea.x, dirtArea.y, dirtArea.size + 8, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Добавляем тонкий блеск чистой поверхности
        this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
        this.ctx.beginPath();
        this.ctx.arc(dirtArea.x - 3, dirtArea.y - 3, dirtArea.size / 4, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    stopDrawing() {
        this.isDrawing = false;
        
        // Возвращаем губку к нормальному размеру
        if (this.brushCursor) {
            this.brushCursor.style.transform = 'translate(-12px, -12px) scale(1)';
            this.brushCursor.style.transition = 'transform 0.2s ease';
        }
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
        this.isMouseInCanvas = false;
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