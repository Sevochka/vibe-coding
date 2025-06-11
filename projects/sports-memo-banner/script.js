class MemoGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.foundPairs = 0;
        this.totalPairs = 8;
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
        this.cards = createGameCards();
        this.flippedCards = [];
        this.moves = 0;
        this.foundPairs = 0;
        this.gameStarted = false;
        this.hintUsed = false;
        
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
        
        cardDiv.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front">${card.symbol}</div>
        `;
        
        cardDiv.addEventListener('click', () => this.handleCardClick(card.id));
        
        return cardDiv;
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
            }, 1000);
        }
    }
    
    flipCard(cardId) {
        const card = this.cards.find(c => c.id === cardId);
        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
        
        card.isFlipped = true;
        this.flippedCards.push(cardId);
        
        cardElement.classList.add('flipped', 'flipping');
        
        setTimeout(() => {
            cardElement.classList.remove('flipping');
        }, 600);
    }
    
    checkForMatch() {
        const [firstCardId, secondCardId] = this.flippedCards;
        const firstCard = this.cards.find(c => c.id === firstCardId);
        const secondCard = this.cards.find(c => c.id === secondCardId);
        
        if (firstCard.symbol === secondCard.symbol) {
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
    }
    
    unflipCards(cardId1, cardId2) {
        const card1 = this.cards.find(c => c.id === cardId1);
        const card2 = this.cards.find(c => c.id === cardId2);
        const cardElement1 = document.querySelector(`[data-card-id="${cardId1}"]`);
        const cardElement2 = document.querySelector(`[data-card-id="${cardId2}"]`);
        
        card1.isFlipped = false;
        card2.isFlipped = false;
        
        cardElement1.classList.remove('flipped');
        cardElement2.classList.remove('flipped');
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
        }, 500);
    }
    
    showHint() {
        if (this.hintUsed || this.foundPairs === this.totalPairs) {
            return;
        }
        
        // Находим первую неоткрытую пару
        const unmatchedCards = this.cards.filter(card => !card.isMatched && !card.isFlipped);
        
        if (unmatchedCards.length >= 2) {
            const firstSymbol = unmatchedCards[0].symbol;
            const matchingCard = unmatchedCards.find(card => 
                card.symbol === firstSymbol && card.id !== unmatchedCards[0].id
            );
            
            if (matchingCard) {
                const cardElement1 = document.querySelector(`[data-card-id="${unmatchedCards[0].id}"]`);
                const cardElement2 = document.querySelector(`[data-card-id="${matchingCard.id}"]`);
                
                // Подсвечиваем карточки
                cardElement1.style.boxShadow = '0 0 20px var(--sports-yellow-A700)';
                cardElement2.style.boxShadow = '0 0 20px var(--sports-yellow-A700)';
                
                setTimeout(() => {
                    cardElement1.style.boxShadow = '';
                    cardElement2.style.boxShadow = '';
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
    }
    
    hideWinOverlay() {
        this.winOverlay.classList.add('hidden');
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new MemoGame();
}); 