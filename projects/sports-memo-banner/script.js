class MemoGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.foundPairs = 0;
        this.totalPairs = 5;
        this.gameStarted = false;
        this.gameTimer = null;
        this.startTime = null;
        this.hintUsed = false;
        
        this.initializeElements();
        this.initializeGame();
        this.bindEvents();
    }
    
    initializeElements() {
        this.gridElement = document.getElementById('memo-grid');
        this.movesElement = document.getElementById('moves');
        this.foundPairsElement = document.getElementById('found-pairs');
        this.timerElement = document.getElementById('timer');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.hintBtn = document.getElementById('hint-btn');
        this.winOverlay = document.getElementById('win-overlay');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.finalMovesElement = document.getElementById('final-moves');
        this.finalTimeElement = document.getElementById('final-time');
    }
    
    bindEvents() {
        this.newGameBtn.addEventListener('click', () => this.initializeGame());
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.playAgainBtn.addEventListener('click', () => {
            this.hideWinOverlay();
            this.initializeGame();
        });
    }
    
    initializeGame() {
        console.log('🎮 Инициализация игры...');
        this.cards = createGameCards();
        console.log('📦 Создано карточек:', this.cards.length);
        console.log('🃏 Данные карточек:', this.cards.map(c => ({ id: c.id, symbol: c.symbol.name, image: c.symbol.image })));
        
        this.flippedCards = [];
        this.moves = 0;
        this.foundPairs = 0;
        this.gameStarted = false;
        this.hintUsed = false;
        
        // Сброс кнопки подсказки
        this.hintBtn.textContent = 'Подсказка';
        this.hintBtn.disabled = false;
        this.hintBtn.style.opacity = '1';
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        this.updateStats();
        this.renderGrid();
        this.hideWinOverlay();
    }
    
    renderGrid() {
        this.gridElement.innerHTML = '';
        
        this.cards.forEach(card => {
            const cardElement = this.createCardElement(card);
            this.gridElement.appendChild(cardElement);
        });
    }
    
    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'memo-card';
        cardDiv.dataset.cardId = card.id;
        
        if (card.isMatched) {
            cardDiv.classList.add('matched');
        } else if (card.isFlipped) {
            cardDiv.classList.add('flipped');
        }
        
        // Задняя сторона карточки (синий фон с логотипом Sports.ru)
        const cardBack = `
            <div class="card-face card-back">
                <div class="card-back-header">
                    <div class="card-back-logo">S</div>
                    <div class="card-back-year">2024</div>
                </div>
                <div class="card-back-footer">
                    <div class="card-back-brand">sports.ru</div>
                    <div class="card-back-pattern">///////////</div>
                </div>
            </div>
        `;
        
        // Передняя сторона карточки с ФОТОГРАФИЕЙ ИГРОКА
        const cardFront = `
            <div class="card-face card-front" style="background: linear-gradient(135deg, ${card.symbol.color} 0%, ${this.darkenColor(card.symbol.color, 20)} 100%);">
                <div class="card-inner">
                    <div class="card-corner top-left"></div>
                    <div class="card-content">
                        <img src="${card.symbol.image}" 
                             alt="${card.symbol.name}" 
                             class="card-player-photo"
                             loading="eager"
                             onload="console.log('Изображение загружено:', '${card.symbol.name}')"
                             onerror="console.error('Ошибка загрузки изображения:', '${card.symbol.image}'); this.style.display='none';" />
                    </div>
                    <div class="card-player-name">${card.symbol.name}</div>
                    <div class="card-corner bottom-right"></div>
                </div>
            </div>
        `;
        
        cardDiv.innerHTML = cardBack + cardFront;
        cardDiv.addEventListener('click', () => this.handleCardClick(card.id));
        
        return cardDiv;
    }
    
    // Утилита для затемнения цвета
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#",""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    handleCardClick(cardId) {
        const card = this.cards.find(c => c.id === cardId);
        
        // Проверяем, можно ли кликнуть по карточке
        if (card.isFlipped || card.isMatched || this.flippedCards.length >= 2) {
            return;
        }
        
        // Начинаем игру при первом клике
        if (!this.gameStarted) {
            this.startGame();
        }
        
        // Переворачиваем карточку
        this.flipCard(cardId);
        
        // Проверяем совпадение, если открыты 2 карточки
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            
            setTimeout(() => {
                this.checkForMatch();
            }, 1200); // Увеличено время для просмотра карточек
        }
    }
    
    flipCard(cardId) {
        const card = this.cards.find(c => c.id === cardId);
        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
        
        console.log('🔄 Переворачиваем карточку:', { cardId, playerName: card.symbol.name, imagePath: card.symbol.image });
        
        card.isFlipped = true;
        this.flippedCards.push(cardId);
        
        cardElement.classList.add('flipped', 'flipping');
        console.log('✅ Добавлены классы: flipped, flipping к карточке', cardId);
        
        setTimeout(() => {
            cardElement.classList.remove('flipping');
            console.log('🎯 Анимация завершена для карточки', cardId);
        }, 800);
    }
    
    checkForMatch() {
        const [firstCardId, secondCardId] = this.flippedCards;
        const firstCard = this.cards.find(c => c.id === firstCardId);
        const secondCard = this.cards.find(c => c.id === secondCardId);
        
        if (firstCard.symbol.id === secondCard.symbol.id) {
            // Совпадение найдено
            this.markAsMatched(firstCardId, secondCardId);
            this.foundPairs++;
            
            if (this.foundPairs === this.totalPairs) {
                this.endGame();
            }
        } else {
            // Совпадения нет, переворачиваем карточки обратно
            this.unflipCards(firstCardId, secondCardId);
        }
        
        this.flippedCards = [];
        this.updateStats();
    }
    
    markAsMatched(cardId1, cardId2) {
        const card1 = this.cards.find(c => c.id === cardId1);
        const card2 = this.cards.find(c => c.id === cardId2);
        const cardElement1 = document.querySelector(`[data-card-id="${cardId1}"]`);
        const cardElement2 = document.querySelector(`[data-card-id="${cardId2}"]`);
        
        card1.isMatched = true;
        card2.isMatched = true;
        
        cardElement1.classList.add('matched');
        cardElement2.classList.add('matched');
        
        // Звуковой эффект успеха (если поддерживается)
        this.playSuccessSound();
    }
    
    unflipCards(cardId1, cardId2) {
        const card1 = this.cards.find(c => c.id === cardId1);
        const card2 = this.cards.find(c => c.id === cardId2);
        const cardElement1 = document.querySelector(`[data-card-id="${cardId1}"]`);
        const cardElement2 = document.querySelector(`[data-card-id="${cardId2}"]`);
        
        card1.isFlipped = false;
        card2.isFlipped = false;
        
        // Добавляем анимацию переворота обратно
        cardElement1.classList.add('flipping');
        cardElement2.classList.add('flipping');
        
        setTimeout(() => {
            cardElement1.classList.remove('flipped', 'flipping');
            cardElement2.classList.remove('flipped', 'flipping');
        }, 400);
    }
    
    playSuccessSound() {
        // Создаем короткий звуковой сигнал через Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            // Звук не поддерживается, игнорируем
        }
    }
    
    startGame() {
        this.gameStarted = true;
        this.startTime = Date.now();
        
        this.gameTimer = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    
    endGame() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        
        setTimeout(() => {
            this.showWinOverlay();
        }, 800);
    }
    
    showHint() {
        if (this.hintUsed || this.foundPairs === this.totalPairs) {
            return;
        }
        
        // Находим первую неоткрытую пару
        const unmatchedCards = this.cards.filter(card => !card.isMatched && !card.isFlipped);
        
        if (unmatchedCards.length >= 2) {
            const firstSymbol = unmatchedCards[0].symbol.id;
            const matchingCard = unmatchedCards.find(card => 
                card.symbol.id === firstSymbol && card.id !== unmatchedCards[0].id
            );
            
            if (matchingCard) {
                const cardElement1 = document.querySelector(`[data-card-id="${unmatchedCards[0].id}"]`);
                const cardElement2 = document.querySelector(`[data-card-id="${matchingCard.id}"]`);
                
                // Подсвечиваем карточки
                cardElement1.classList.add('hint');
                cardElement2.classList.add('hint');
                
                setTimeout(() => {
                    cardElement1.classList.remove('hint');
                    cardElement2.classList.remove('hint');
                }, 2000);
                
                this.hintUsed = true;
                this.hintBtn.textContent = 'Подсказка использована';
                this.hintBtn.disabled = true;
                this.hintBtn.style.opacity = '0.5';
            }
        }
    }
    
    updateStats() {
        this.movesElement.textContent = this.moves;
        this.foundPairsElement.textContent = this.foundPairs;
    }
    
    updateTimer() {
        if (!this.startTime) return;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        this.timerElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    showWinOverlay() {
        this.finalMovesElement.textContent = this.moves;
        this.finalTimeElement.textContent = this.timerElement.textContent;
        this.winOverlay.classList.remove('hidden');
        
        // Добавляем конфетти эффект
        this.createConfetti();
    }
    
    createConfetti() {
        // Простой эффект конфетти
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.width = '6px';
                confetti.style.height = '6px';
                confetti.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                confetti.style.animation = `fall ${Math.random() * 2 + 2}s linear forwards`;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 4000);
            }, i * 50);
        }
        
        // Добавляем CSS анимацию для падения
        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes fall {
                    0% {
                        transform: translateY(-10px) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    hideWinOverlay() {
        this.winOverlay.classList.add('hidden');
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new MemoGame();
}); 