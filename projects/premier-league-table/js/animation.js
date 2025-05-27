class TableAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.teamLogos = new Map();
        this.currentPositions = new Map();
        this.targetPositions = new Map();
        this.previousPositions = new Map();
        this.animationProgress = 0;
        this.isAnimating = false;
        this.currentWeek = 1;
        this.showTrails = true;
        this.trailOpacity = 0.3;
        this.teamColors = new Map();
        
        // Задаём цвета для каждой команды
        const colors = [
            '#EF0107', // Arsenal - красный
            '#670E36', // Aston Villa - бордовый
            '#DA291C', // Bournemouth - красный
            '#e30613', // Brentford - красный
            '#0057B8', // Brighton - синий
            '#034694', // Chelsea - синий
            '#1B458F', // Crystal Palace - синий
            '#003399', // Everton - синий
            '#000000', // Fulham - чёрный
            '#0070FF', // Ipswich - синий
            '#003090', // Leicester - синий
            '#C8102E', // Liverpool - красный
            '#6CABDD', // Man City - голубой
            '#DA291C', // Man United - красный
            '#241F20', // Newcastle - чёрно-белый
            '#DD0000', // Nottingham - красный
            '#D71920', // Southampton - красный
            '#132257', // Tottenham - тёмно-синий
            '#7A263A', // West Ham - бордовый
            '#FDB913'  // Wolves - оранжевый
        ];
        
        // Загружаем логотипы команд
        teams.forEach((team, index) => {
            const img = new Image();
            img.src = team.logo;
            img.crossOrigin = 'anonymous'; // Для работы с логотипами с других доменов
            this.teamLogos.set(team.id, img);
            this.currentPositions.set(team.id, { x: 0, y: 0 });
            this.targetPositions.set(team.id, { x: 0, y: 0 });
            this.previousPositions.set(team.id, []);
            this.teamColors.set(team.id, colors[index % colors.length]);
        });
    }

    // Обновляем размеры канваса
    updateCanvasSize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    // Рассчитываем позиции команд на основе их мест в таблице
    calculatePositions(standings) {
        const padding = 40;
        const logoSize = 30;
        const weekWidth = (this.canvas.width - padding * 2) / 38;
        const rowHeight = (this.canvas.height - padding * 2) / 20;

        standings.forEach((teamId, position) => {
            const week = this.currentWeek - 1;
            const x = padding + week * weekWidth;
            const y = padding + position * rowHeight;
            
            // Сохраняем предыдущую позицию для отрисовки следа
            if (this.currentWeek > 1) {
                const currentPos = this.currentPositions.get(teamId);
                if (currentPos) {
                    // Ограничиваем количество сохранённых позиций до 10
                    const prevPositions = this.previousPositions.get(teamId);
                    if (prevPositions.length >= 10) {
                        prevPositions.shift();
                    }
                    prevPositions.push({...currentPos});
                }
            }
            
            this.targetPositions.set(teamId, { x, y });
            
            if (!this.currentPositions.get(teamId)) {
                this.currentPositions.set(teamId, { x, y });
            }
        });
    }

    // Анимируем движение команд
    animate(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = timestamp - this.startTime;
        const duration = 1000; // 1 секунда на анимацию
        
        const progress = Math.min(elapsed / duration, 1);
        // Используем функцию смягчения для более естественного движения
        const easedProgress = this.easeInOutCubic(progress);

        if (progress >= 1) {
            this.isAnimating = false;
            teams.forEach(team => {
                const target = this.targetPositions.get(team.id);
                this.currentPositions.set(team.id, { ...target });
            });
        } else {
            teams.forEach(team => {
                const current = this.currentPositions.get(team.id);
                const target = this.targetPositions.get(team.id);
                
                const x = current.x + (target.x - current.x) * easedProgress;
                const y = current.y + (target.y - current.y) * easedProgress;
                
                this.currentPositions.set(team.id, { x, y });
            });
        }

        this.draw();

        if (this.isAnimating) {
            requestAnimationFrame(this.animate.bind(this));
        }
    }
    
    // Функция плавного перехода (easing function)
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Отрисовываем текущее состояние
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем сетку
        this.drawGrid();
        
        // Рисуем следы движения команд
        if (this.showTrails) {
            this.drawTrails();
        }
        
        // Рисуем логотипы команд
        const logoSize = 30;
        teams.forEach(team => {
            const pos = this.currentPositions.get(team.id);
            const logo = this.teamLogos.get(team.id);
            
            if (logo.complete) {
                this.ctx.drawImage(logo, pos.x - logoSize/2, pos.y - logoSize/2, logoSize, logoSize);
                
                // Подписываем название команды рядом с логотипом
                this.ctx.fillStyle = '#333';
                this.ctx.font = '12px Sports';
                this.ctx.textAlign = 'left';
                this.ctx.fillText(team.name, pos.x + logoSize/2 + 5, pos.y + 4);
            }
        });
    }
    
    // Рисуем следы движения команд
    drawTrails() {
        teams.forEach(team => {
            const positions = this.previousPositions.get(team.id);
            if (!positions || positions.length < 2) return;
            
            const color = this.teamColors.get(team.id);
            
            this.ctx.beginPath();
            this.ctx.moveTo(positions[0].x, positions[0].y);
            
            for (let i = 1; i < positions.length; i++) {
                this.ctx.lineTo(positions[i].x, positions[i].y);
            }
            
            // Добавляем текущую позицию
            const currentPos = this.currentPositions.get(team.id);
            this.ctx.lineTo(currentPos.x, currentPos.y);
            
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = this.trailOpacity;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        });
    }

    // Рисуем сетку и подписи
    drawGrid() {
        const padding = 40;
        const width = this.canvas.width - padding * 2;
        const height = this.canvas.height - padding * 2;
        
        this.ctx.strokeStyle = '#eee';
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px Sports';
        this.ctx.textAlign = 'center';
        
        // Вертикальные линии (туры)
        for (let i = 0; i <= 38; i++) {
            const x = padding + (width / 38) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(x, padding);
            this.ctx.lineTo(x, height + padding);
            this.ctx.stroke();
            
            if (i % 5 === 0 || i === 1 || i === 38) {
                this.ctx.fillText(`Тур ${i}`, x, padding - 10);
            }
        }
        
        // Горизонтальные линии (места)
        for (let i = 0; i <= 20; i++) {
            const y = padding + (height / 20) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(width + padding, y);
            this.ctx.stroke();
            
            this.ctx.textAlign = 'right';
            this.ctx.fillText(`${i + 1}`, padding - 10, y + 4);
        }
        
        // Выделяем зоны вылета, еврокубков и т.д.
        this.drawZones(padding, width, height);
    }
    
    // Рисуем зоны турнирной таблицы (Лига Чемпионов, Лига Европы, вылет)
    drawZones(padding, width, height) {
        const rowHeight = height / 20;
        
        // Лига Чемпионов (места 1-4)
        this.ctx.fillStyle = 'rgba(0, 100, 255, 0.05)';
        this.ctx.fillRect(padding, padding, width, rowHeight * 4);
        
        // Лига Европы (места 5-6)
        this.ctx.fillStyle = 'rgba(255, 165, 0, 0.05)';
        this.ctx.fillRect(padding, padding + rowHeight * 4, width, rowHeight * 2);
        
        // Зона вылета (места 18-20)
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.05)';
        this.ctx.fillRect(padding, padding + rowHeight * 17, width, rowHeight * 3);
        
        // Легенда зон
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = 'rgba(0, 100, 255, 0.8)';
        this.ctx.fillText('Лига Чемпионов', padding, padding - 25);
        
        this.ctx.fillStyle = 'rgba(255, 165, 0, 0.8)';
        this.ctx.fillText('Лига Европы', padding + 120, padding - 25);
        
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        this.ctx.fillText('Зона вылета', padding + 220, padding - 25);
    }

    // Запускаем анимацию для нового состояния таблицы
    updateStandings(standings, week) {
        this.currentWeek = week;
        this.calculatePositions(standings);
        this.isAnimating = true;
        this.startTime = null;
        requestAnimationFrame(this.animate.bind(this));
    }
} 