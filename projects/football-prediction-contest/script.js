class PredictionContest {
    constructor() {
        this.currentTour = 1;
        this.userBets = new Map();
        this.totalStake = 0;
        this.userStats = {
            totalPoints: 0,
            totalBets: 0,
            winRate: 0
        };

        this.init();
    }

    init() {
        console.log('Инициализация конкурса прогнозов...');
        this.showWelcomeModal();
        this.setupEventListeners();
        this.renderTourMatches(this.currentTour);
        this.updateStats();
        console.log('Инициализация завершена');
    }

    showWelcomeModal() {
        const modal = document.getElementById('welcomeModal');
        if (modal) {
            // Для демонстрации показываем поп-ап всегда
            // const isFirstVisit = !localStorage.getItem('predictionContest_visited');
            
            // if (isFirstVisit) {
                modal.style.display = 'flex';
            // } else {
            //     modal.style.display = 'none';
            // }
        }
    }

    setupEventListeners() {
        // Поп-ап события
        const closeModal = document.getElementById('closeModal');
        const startPlaying = document.getElementById('startPlaying');
        const modal = document.getElementById('welcomeModal');

        console.log('Элементы поп-апа:', { closeModal, startPlaying, modal });

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                console.log('Кнопка закрытия нажата');
                modal.style.display = 'none';
                localStorage.setItem('predictionContest_visited', 'true');
            });
        }

        if (startPlaying) {
            startPlaying.addEventListener('click', () => {
                console.log('Кнопка "Начать играть" нажата');
                modal.style.display = 'none';
                localStorage.setItem('predictionContest_visited', 'true');
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    localStorage.setItem('predictionContest_visited', 'true');
                }
            });
        }

        // Навигация по турам
        document.querySelectorAll('.tour-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tourNumber = parseInt(e.target.dataset.tour);
                this.switchTour(tourNumber);
            });
        });

        // Подтверждение всех ставок
        const submitAllBtn = document.getElementById('submitAllBets');
        if (submitAllBtn) {
            submitAllBtn.addEventListener('click', () => {
                this.submitAllBets();
            });
        }
    }

    switchTour(tourNumber) {
        this.currentTour = tourNumber;
        
        // Обновляем активную кнопку тура
        document.querySelectorAll('.tour-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tour="${tourNumber}"]`).classList.add('active');

        // Обновляем deadline
        const deadlineEl = document.querySelector('.tour-deadline strong');
        deadlineEl.textContent = toursData[tourNumber].deadline;

        // Рендерим матчи тура
        this.renderTourMatches(tourNumber);
    }

    renderTourMatches(tourNumber) {
        const container = document.getElementById('matchesContainer');
        const tourMatches = toursData[tourNumber].matches;
        
        container.innerHTML = '';

        if (tourMatches.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--sports-grey-600);">
                    <h3>Матчи этого тура скоро появятся</h3>
                    <p>Следите за обновлениями!</p>
                </div>
            `;
            return;
        }

        tourMatches.forEach(matchId => {
            const match = matchesData.find(m => m.id === matchId);
            if (match) {
                const matchElement = this.createMatchCard(match);
                container.appendChild(matchElement);
            }
        });
    }

    createMatchCard(match) {
        const card = document.createElement('div');
        card.className = `match-card ${match.temperature} ${match.rivalry ? 'rivalry' : ''}`;
        card.dataset.matchId = match.id;

        const homeScore = match.homeScore !== null ? match.homeScore : '-';
        const awayScore = match.awayScore !== null ? match.awayScore : '-';
        const isFinished = match.finished;
        const statusClass = match.status === 'live' ? 'live' : '';

        card.innerHTML = `
            <div class="match-header">
                <div class="match-info">
                    <div class="match-time">${match.time}</div>
                    <div class="match-temperature ${match.temperature}">
                        ${match.temperature === 'hot' ? '🔥 Горячий' : match.temperature === 'cold' ? '🧊 Холодный' : '⚡ Обычный'}
                    </div>
                    ${match.rivalry ? '<div class="rivalry-badge">⚔️ Дерби</div>' : ''}
                </div>
                <div class="match-status ${statusClass}">
                    ${isFinished ? 'Завершен' : match.status === 'live' ? 'Live' : 'Ожидается'}
                </div>
            </div>
            
            <div class="match-teams">
                <div class="team home-team" data-team="home" data-match="${match.id}">
                    <div class="team-logo">${teamLogos[match.homeTeam] || '⚽'}</div>
                    <div class="team-info">
                        <div class="team-name">${match.homeTeam}</div>
                        <div class="team-stats">
                            <span class="position">#${match.homeStats.position}</span>
                            <span class="goals">${match.homeStats.goals}г</span>
                        </div>
                        <div class="team-form">${this.renderForm(match.homeForm)}</div>
                    </div>
                    <div class="team-odds">
                        <span class="odds-value">${match.odds.win}</span>
                        <span class="odds-label">П1</span>
                    </div>
                </div>
                
                <div class="vs-section">
                    ${isFinished ? 
                        `<div class="match-score">${homeScore}:${awayScore}</div>` : 
                        `<div class="vs-content">
                            <div class="animated-ball">⚽</div>
                            <div class="vs-text">VS</div>
                            <div class="draw-option" data-outcome="draw" data-match="${match.id}">
                                <span class="draw-odds">${match.odds.draw}</span>
                                <span class="draw-label">Ничья</span>
                            </div>
                        </div>`
                    }
                </div>
                
                <div class="team away-team" data-team="away" data-match="${match.id}">
                    <div class="team-odds">
                        <span class="odds-value">${match.odds.lose}</span>
                        <span class="odds-label">П2</span>
                    </div>
                    <div class="team-info">
                        <div class="team-name">${match.awayTeam}</div>
                        <div class="team-stats">
                            <span class="position">#${match.awayStats.position}</span>
                            <span class="goals">${match.awayStats.goals}г</span>
                        </div>
                        <div class="team-form">${this.renderForm(match.awayForm)}</div>
                    </div>
                    <div class="team-logo">${teamLogos[match.awayTeam] || '⚽'}</div>
                </div>
            </div>
            
            ${!isFinished ? this.createPredictionPanel(match) : ''}
        `;

        return card;
    }

    renderForm(form) {
        return form.split('').map(result => {
            const color = result === 'W' ? 'green' : result === 'D' ? 'yellow' : 'red';
            const symbol = result === 'W' ? '●' : result === 'D' ? '●' : '●';
            return `<span class="form-dot ${color}">${symbol}</span>`;
        }).join('');
    }

    createPredictionPanel(match) {
        const multiplier = match.temperature === 'hot' ? 1.5 : match.temperature === 'cold' ? 0.8 : 1.0;
        const rivalryBonus = match.rivalry ? 0.2 : 0;
        const totalMultiplier = (multiplier + rivalryBonus).toFixed(1);

        return `
            <div class="prediction-panel">
                <div class="prediction-header">
                    <h3>🎯 Игровая механика прогнозирования</h3>
                    <div class="match-multiplier">
                        <span class="multiplier-label">Множитель матча:</span>
                        <span class="multiplier-value">×${totalMultiplier}</span>
                        ${match.temperature === 'hot' ? '<span class="bonus-tag hot">🔥 Горячий</span>' : ''}
                        ${match.rivalry ? '<span class="bonus-tag rivalry">⚔️ Дерби</span>' : ''}
                    </div>
                </div>

                <div class="prediction-game">
                    <div class="prediction-step active" data-step="1">
                        <div class="step-header">
                            <span class="step-number">1</span>
                            <span class="step-title">Выберите исход</span>
                        </div>
                        <div class="interactive-field">
                            <div class="field-line"></div>
                            <div class="prediction-ball" id="ball-${match.id}">⚽</div>
                            <div class="goal-areas">
                                <div class="goal-area left" data-outcome="win" data-match="${match.id}">
                                    <div class="goal-post">🥅</div>
                                    <div class="team-selection">
                                        <span class="team-name">${match.homeTeam}</span>
                                        <span class="odds-display">${match.odds.win}</span>
                                    </div>
                                </div>
                                <div class="goal-area center" data-outcome="draw" data-match="${match.id}">
                                    <div class="draw-zone">⚖️</div>
                                    <div class="team-selection">
                                        <span class="team-name">Ничья</span>
                                        <span class="odds-display">${match.odds.draw}</span>
                                    </div>
                                </div>
                                <div class="goal-area right" data-outcome="lose" data-match="${match.id}">
                                    <div class="goal-post">🥅</div>
                                    <div class="team-selection">
                                        <span class="team-name">${match.awayTeam}</span>
                                        <span class="odds-display">${match.odds.lose}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="prediction-step" data-step="2">
                        <div class="step-header">
                            <span class="step-number">2</span>
                            <span class="step-title">Прогноз на голы</span>
                        </div>
                        <div class="goals-predictor">
                            <div class="goals-slider">
                                <div class="slider-track">
                                    <div class="slider-progress"></div>
                                </div>
                                <div class="goals-options">
                                    <div class="goal-option" data-total="under" data-match="${match.id}">
                                        <span class="goal-icon">📉</span>
                                        <span class="goal-text">ТМ 2.5</span>
                                        <span class="goal-odds">${match.odds.under}</span>
                                    </div>
                                    <div class="goal-center">
                                        <span class="goals-display">2.5</span>
                                        <span class="goals-label">голов</span>
                                    </div>
                                    <div class="goal-option" data-total="over" data-match="${match.id}">
                                        <span class="goal-icon">📈</span>
                                        <span class="goal-text">ТБ 2.5</span>
                                        <span class="goal-odds">${match.odds.over}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="prediction-step" data-step="3">
                        <div class="step-header">
                            <span class="step-number">3</span>
                            <span class="step-title">Уверенность в прогнозе</span>
                        </div>
                        <div class="confidence-selector">
                            <div class="confidence-scale">
                                <input type="range" min="50" max="500" value="100" class="confidence-slider" data-stake="${match.id}">
                                <div class="confidence-labels">
                                    <span>Слабо</span>
                                    <span>Уверен</span>
                                    <span>Очень уверен</span>
                                </div>
                            </div>
                            <div class="stake-display">
                                <span class="stake-amount">100</span>
                                <span class="stake-currency">очков</span>
                            </div>
                            <div class="potential-win">
                                <span class="win-label">Потенциальный выигрыш:</span>
                                <span class="win-amount" id="potential-${match.id}">0</span>
                                <span class="win-currency">очков</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="prediction-summary" id="summary-${match.id}" style="display: none;">
                    <div class="summary-content">
                        <div class="selected-outcome"></div>
                        <div class="selected-total"></div>
                        <div class="selected-stake"></div>
                        <div class="final-multiplier">Итоговый множитель: ×<span id="final-mult-${match.id}">1.0</span></div>
                    </div>
                </div>

                <button class="mega-confirm-btn" data-confirm="${match.id}" disabled>
                    <span class="btn-icon">🚀</span>
                    <span class="btn-text">Запустить прогноз!</span>
                    <span class="btn-glow"></span>
                </button>
            </div>
        `;
    }

    selectOutcome(matchId, outcome) {
        // Убираем активность с других элементов исхода
        document.querySelectorAll(`[data-match="${matchId}"]`).forEach(element => {
            if (element.dataset.outcome || element.dataset.team) {
                element.classList.remove('selected', 'win', 'draw', 'lose');
            }
        });
        
        // Активируем выбранный элемент
        const goalArea = document.querySelector(`[data-match="${matchId}"][data-outcome="${outcome}"]`);
        const team = document.querySelector(`[data-match="${matchId}"][data-team="${outcome === 'win' ? 'home' : outcome === 'lose' ? 'away' : ''}"]`);
        const drawOption = document.querySelector(`[data-match="${matchId}"][data-outcome="draw"]`);
        
        const selectedElement = goalArea || team || drawOption;
        if (selectedElement) {
            selectedElement.classList.add('selected');
        }
        
        // Анимация мяча к выбранной цели
        const ball = document.getElementById(`ball-${matchId}`);
        if (ball) {
            this.animateBallToGoal(ball, outcome);
        }
        
        // Сохраняем выбор
        if (!this.userBets.has(matchId)) {
            this.userBets.set(matchId, {});
        }
        this.userBets.get(matchId).outcome = outcome;

        this.updateConfirmButton(matchId);
        this.showNotification(`Выбран исход: ${outcome === 'win' ? 'П1' : outcome === 'draw' ? 'Ничья' : 'П2'}`, 'info');
    }

    animateBallToGoal(ball, outcome) {
        ball.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        if (outcome === 'win') {
            ball.style.transform = 'translate(-150%, -50%) scale(1.2)';
        } else if (outcome === 'lose') {
            ball.style.transform = 'translate(50%, -50%) scale(1.2)';
        } else {
            ball.style.transform = 'translate(-50%, -50%) scale(1.3)';
        }
        
        setTimeout(() => {
            ball.style.transition = 'all 0.5s ease';
            ball.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 800);
    }

    selectTotal(matchId, total) {
        // Сбрасываем предыдущий выбор для этого матча
        document.querySelectorAll(`[data-match="${matchId}"][data-total]`).forEach(btn => {
            btn.classList.remove('selected');
        });

        // Выделяем выбранный тотал
        const selectedBtn = document.querySelector(`[data-match="${matchId}"][data-total="${total}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }

        // Анимируем прогресс слайдера
        const sliderProgress = document.querySelector(`[data-match-id="${matchId}"] .slider-progress`);
        if (sliderProgress) {
            sliderProgress.style.width = total === 'under' ? '25%' : '75%';
        }

        // Сохраняем выбор
        if (!this.userBets.has(matchId)) {
            this.userBets.set(matchId, {});
        }
        this.userBets.get(matchId).total = total;

        this.updateConfirmButton(matchId);
        this.showNotification(`Выбран тотал: ${total === 'over' ? 'ТБ 2.5' : 'ТМ 2.5'}`, 'info');
    }

    activateNextStep(matchId, stepNumber) {
        const steps = document.querySelectorAll(`[data-match-id="${matchId}"] .prediction-step`);
        
        steps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.classList.add('active');
                step.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else if (index + 1 < stepNumber) {
                step.classList.remove('active');
                step.style.opacity = '0.8';
            }
        });
    }

    updateConfidence(matchId, confidence) {
        const stakeAmount = document.querySelector(`[data-match-id="${matchId}"] .stake-amount`);
        const potentialWin = document.getElementById(`potential-${matchId}`);
        const finalMult = document.getElementById(`final-mult-${matchId}`);
        
        if (stakeAmount) {
            stakeAmount.textContent = confidence;
        }
        
        // Вычисляем потенциальный выигрыш
        const bet = this.userBets.get(matchId);
        if (bet && bet.outcome && bet.total) {
            const match = matchesData.find(m => m.id === matchId);
            const outcomeOdds = bet.outcome === 'win' ? match.odds.win : 
                              bet.outcome === 'draw' ? match.odds.draw : match.odds.lose;
            const totalOdds = bet.total === 'over' ? match.odds.over : match.odds.under;
            
            const multiplier = match.temperature === 'hot' ? 1.5 : match.temperature === 'cold' ? 0.8 : 1.0;
            const rivalryBonus = match.rivalry ? 0.2 : 0;
            const totalMultiplier = multiplier + rivalryBonus;
            
            const potential = Math.round(confidence * outcomeOdds * totalOdds * totalMultiplier);
            
            if (potentialWin) {
                potentialWin.textContent = potential;
            }
            if (finalMult) {
                finalMult.textContent = (totalMultiplier * outcomeOdds * totalOdds).toFixed(2);
            }
        }
        
        // Сохраняем ставку
        if (!this.userBets.has(matchId)) {
            this.userBets.set(matchId, {});
        }
        this.userBets.get(matchId).stake = parseInt(confidence);

        this.updateConfirmButton(matchId);
    }

    updateStake(matchId) {
        const stakeInput = document.querySelector(`input[data-stake="${matchId}"]`);
        const stake = parseInt(stakeInput.value) || 0;
        
        if (!this.userBets.has(matchId)) {
            this.userBets.set(matchId, {});
        }
        this.userBets.get(matchId).stake = stake;

        this.updateConfirmButton(matchId);
    }

    updateConfirmButton(matchId) {
        const bet = this.userBets.get(matchId);
        const confirmBtn = document.querySelector(`[data-confirm="${matchId}"]`);
        const summaryDiv = document.getElementById(`summary-${matchId}`);
        
        if (bet && bet.outcome && bet.total && bet.stake > 0) {
            // Активируем кнопку
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.classList.add('active');
            }
            
            // Показываем итоговую сводку
            if (summaryDiv) {
                const match = matchesData.find(m => m.id === matchId);
                const outcomeText = bet.outcome === 'win' ? 'П1' : bet.outcome === 'draw' ? 'Ничья' : 'П2';
                const totalText = bet.total === 'over' ? 'ТБ 2.5' : 'ТМ 2.5';
                
                summaryDiv.style.display = 'block';
                summaryDiv.querySelector('.summary-content').innerHTML = `
                    <div class="selected-outcome">✅ Исход: ${outcomeText}</div>
                    <div class="selected-total">⚽ Голы: ${totalText}</div>
                    <div class="selected-stake">💰 Ставка: ${bet.stake} очков</div>
                    <div class="final-multiplier">Итоговый множитель: ×<span id="final-mult-${matchId}">1.0</span></div>
                `;
            }
        } else {
            // Деактивируем кнопку
            if (confirmBtn) {
                confirmBtn.disabled = true;
                confirmBtn.classList.remove('active');
            }
            
            // Скрываем итоговую сводку
            if (summaryDiv) {
                summaryDiv.style.display = 'none';
            }
        }
    }

    confirmBet(matchId) {
        const bet = this.userBets.get(matchId);
        if (!bet || !bet.outcome || !bet.total || bet.stake <= 0) {
            return;
        }

        // Помечаем ставку как подтвержденную
        bet.confirmed = true;
        
        // Блокируем карточку матча
        const matchCard = document.querySelector(`[data-match-id="${matchId}"]`);
        matchCard.classList.add('selected');
        
        // Отключаем все кнопки в этом матче
        matchCard.querySelectorAll('button, input').forEach(element => {
            element.disabled = true;
        });

        // Обновляем итоговую панель
        this.updateSummaryPanel();
        
        // Показываем уведомление
        this.showNotification('Прогноз подтвержден!', 'success');
    }

    updateSummaryPanel() {
        const confirmedBets = Array.from(this.userBets.entries()).filter(([id, bet]) => bet.confirmed);
        const summaryPanel = document.getElementById('summaryPanel');
        const selectedBets = document.getElementById('selectedBets');
        const totalStake = document.getElementById('totalStake');

        if (confirmedBets.length === 0) {
            summaryPanel.style.display = 'none';
            return;
        }

        summaryPanel.style.display = 'block';
        
        selectedBets.innerHTML = '';
        let total = 0;

        confirmedBets.forEach(([matchId, bet]) => {
            const match = matchesData.find(m => m.id === matchId);
            const betItem = document.createElement('div');
            betItem.className = 'bet-item';
            
            const outcomeText = bet.outcome === 'win' ? 'П1' : bet.outcome === 'draw' ? 'Ничья' : 'П2';
            const totalText = bet.total === 'over' ? 'ТБ 2.5' : 'ТМ 2.5';
            
            betItem.innerHTML = `
                <div>
                    <strong>${match.homeTeam} - ${match.awayTeam}</strong><br>
                    ${outcomeText}, ${totalText}
                </div>
                <div>
                    <strong>${bet.stake}</strong>
                </div>
            `;
            
            selectedBets.appendChild(betItem);
            total += bet.stake;
        });

        totalStake.textContent = total;
        this.totalStake = total;
    }

    submitAllBets() {
        const confirmedBets = Array.from(this.userBets.entries()).filter(([id, bet]) => bet.confirmed);
        
        if (confirmedBets.length === 0) {
            this.showNotification('Нет подтвержденных прогнозов', 'error');
            return;
        }

        // Симулируем отправку данных
        this.userStats.totalBets += confirmedBets.length;
        this.updateStats();
        
        // Очищаем подтвержденные ставки
        confirmedBets.forEach(([matchId]) => {
            this.userBets.delete(matchId);
        });
        
        // Скрываем итоговую панель
        document.getElementById('summaryPanel').style.display = 'none';
        
        this.showNotification(`Отправлено ${confirmedBets.length} прогнозов!`, 'success');
    }

    updateStats() {
        document.getElementById('totalPoints').textContent = this.userStats.totalPoints;
        document.getElementById('totalBets').textContent = this.userStats.totalBets;
        document.getElementById('winRate').textContent = this.userStats.winRate + '%';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'var(--sports-primary-color)' : 
                       type === 'error' ? 'var(--sports-red-a700)' :
                       type === 'info' ? 'var(--sports-cyan-A700)' : 'var(--sports-grey-600)';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 25px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            z-index: 1001;
            font-weight: bold;
            animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            font-family: var(--ui-font-family-heading);
            min-width: 200px;
            text-align: center;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2500);
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    const app = new PredictionContest();
    
    // Добавляем стили для анимаций уведомлений
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Устанавливаем обработчики событий для новой игровой механики
    document.addEventListener('click', (e) => {
        // Выбор команды или ничьи в интерактивном поле и карточках команд
        const goalArea = e.target.closest('.goal-area');
        const team = e.target.closest('.team');
        const drawOption = e.target.closest('.draw-option');
        
        if (goalArea || team || drawOption) {
            const matchId = parseInt((goalArea || team || drawOption).dataset.match);
            const outcome = (goalArea || team || drawOption).dataset.outcome || 
                          (team ? team.dataset.team === 'home' ? 'win' : 'lose' : null);
            
            if (matchId && outcome) {
                app.selectOutcome(matchId, outcome);
                app.activateNextStep(matchId, 2);
            }
        }
        
        // Выбор тотала в предикторе голов
        const goalOption = e.target.closest('.goal-option');
        if (goalOption) {
            const matchId = parseInt(goalOption.dataset.match);
            const total = goalOption.dataset.total;
            app.selectTotal(matchId, total);
            app.activateNextStep(matchId, 3);
        }
        
        // Подтверждение прогноза (мега-кнопка)
        const confirmBtn = e.target.closest('.mega-confirm-btn');
        if (confirmBtn && !confirmBtn.disabled) {
            const matchId = parseInt(confirmBtn.dataset.confirm);
            app.confirmBet(matchId);
        }
        
        // Старые кнопки для совместимости
        if (e.target.matches('.outcome-btn')) {
            const matchId = parseInt(e.target.dataset.match);
            const outcome = e.target.dataset.outcome;
            app.selectOutcome(matchId, outcome);
        }
        
        if (e.target.matches('.total-btn')) {
            const matchId = parseInt(e.target.dataset.match);
            const total = e.target.dataset.total;
            app.selectTotal(matchId, total);
        }
        
        if (e.target.matches('.confirm-btn.active')) {
            const matchId = parseInt(e.target.dataset.confirm);
            app.confirmBet(matchId);
        }
    });
    
    // Слайдер уверенности
    document.addEventListener('input', (e) => {
        if (e.target.matches('.confidence-slider')) {
            const matchId = parseInt(e.target.dataset.stake);
            app.updateConfidence(matchId, e.target.value);
        }
        
        // Старый обработчик для совместимости
        if (e.target.matches('input[data-stake]')) {
            const matchId = parseInt(e.target.dataset.stake);
            app.updateStake(matchId);
        }
    });
}); 