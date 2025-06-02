// Основная логика игры Морской бой | FONBET
class BattleshipGame {
    constructor() {
        this.currentPhase = GAME_CONFIG.GAME_PHASES.CLUB_SELECTION;
        this.playerClub = null;
        this.opponentClub = null;
        this.playerBoard = [];
        this.opponentBoard = [];
        this.playerShips = [];
        this.opponentShips = [];
        this.specialCells = {
            player: [],
            opponent: []
        };
        this.isPlayerTurn = true;
        this.gameEnded = false;
        this.extraTurns = 0;
        
        this.initializeGame();
    }

    initializeGame() {
        this.renderClubSelection();
        this.bindEvents();
    }

    renderClubSelection() {
        const container = document.getElementById('gameContainer');
        container.innerHTML = `
            <div class="club-selection">
                <h2>${GAME_MESSAGES.SELECT_CLUB}</h2>
                <div class="clubs-grid" id="clubsGrid">
                    ${FOOTBALL_CLUBS.map(club => `
                        <div class="club-card" data-club-id="${club.id}">
                            <span class="club-logo">${club.logo}</span>
                            <div class="club-name">${club.name}</div>
                            <div class="club-country">${club.country}</div>
                            <div class="club-description">${club.description}</div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn" id="startGameBtn" disabled>Начать матч</button>
            </div>
        `;
    }

    bindEvents() {
        // Выбор клуба
        document.addEventListener('click', (e) => {
            if (e.target.closest('.club-card')) {
                this.selectClub(e.target.closest('.club-card').dataset.clubId);
            }
            
            if (e.target.id === 'startGameBtn') {
                this.startGame();
            }
            
            if (e.target.id === 'reshuffleBtn') {
                this.reshuffleShips();
            }
            
            if (e.target.id === 'startBattleBtn') {
                this.startBattle();
            }
            
            if (e.target.id === 'newGameBtn') {
                this.resetGame();
            }
            
            if (e.target.classList.contains('opponent-cell')) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.playerShoot(row, col);
            }
        });
    }

    selectClub(clubId) {
        // Убираем выделение с других клубов
        document.querySelectorAll('.club-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Выделяем выбранный клуб
        document.querySelector(`[data-club-id="${clubId}"]`).classList.add('selected');
        
        this.playerClub = getClubById(clubId);
        this.opponentClub = getRandomOpponent(clubId);
        
        // Активируем кнопку старта
        document.getElementById('startGameBtn').disabled = false;
    }

    startGame() {
        this.currentPhase = GAME_CONFIG.GAME_PHASES.PLACEMENT;
        this.initializeBoards();
        this.generateRandomShipPlacement();
        this.renderGameBoard();
        this.updateGameStatus(GAME_MESSAGES.PLACEMENT_INSTRUCTION);
    }

    initializeBoards() {
        // Создаем пустые доски
        this.playerBoard = Array(GAME_CONFIG.BOARD_SIZE).fill().map(() => 
            Array(GAME_CONFIG.BOARD_SIZE).fill(GAME_CONFIG.CELL_STATES.EMPTY)
        );
        this.opponentBoard = Array(GAME_CONFIG.BOARD_SIZE).fill().map(() => 
            Array(GAME_CONFIG.BOARD_SIZE).fill(GAME_CONFIG.CELL_STATES.EMPTY)
        );
        
        // Инициализируем списки кораблей
        this.playerShips = [];
        this.opponentShips = [];
    }

    generateRandomShipPlacement() {
        // Размещаем корабли игрока
        this.placeShipsRandomly(this.playerBoard, this.playerShips, 'player');
        
        // Размещаем корабли соперника
        this.placeShipsRandomly(this.opponentBoard, this.opponentShips, 'opponent');
        
        // Размещаем специальные ячейки
        this.placeSpecialCells();
    }

    placeShipsRandomly(board, shipsList, owner) {
        shipsList.length = 0;
        
        // Очищаем доску
        for (let i = 0; i < GAME_CONFIG.BOARD_SIZE; i++) {
            for (let j = 0; j < GAME_CONFIG.BOARD_SIZE; j++) {
                board[i][j] = GAME_CONFIG.CELL_STATES.EMPTY;
            }
        }

        GAME_CONFIG.SHIPS.forEach(shipType => {
            for (let i = 0; i < shipType.count; i++) {
                let placed = false;
                let attempts = 0;
                
                while (!placed && attempts < 100) {
                    const row = Math.floor(Math.random() * GAME_CONFIG.BOARD_SIZE);
                    const col = Math.floor(Math.random() * GAME_CONFIG.BOARD_SIZE);
                    const horizontal = Math.random() < 0.5;
                    
                    if (this.canPlaceShip(board, row, col, shipType.size, horizontal)) {
                        const ship = this.placeShip(board, row, col, shipType.size, horizontal, shipType);
                        shipsList.push(ship);
                        placed = true;
                    }
                    attempts++;
                }
            }
        });
    }

    canPlaceShip(board, row, col, size, horizontal) {
        // Проверяем границы
        if (horizontal) {
            if (col + size > GAME_CONFIG.BOARD_SIZE) return false;
        } else {
            if (row + size > GAME_CONFIG.BOARD_SIZE) return false;
        }

        // Проверяем занятость ячеек и соседних ячеек
        for (let i = 0; i < size; i++) {
            const checkRow = horizontal ? row : row + i;
            const checkCol = horizontal ? col + i : col;
            
            // Проверяем саму ячейку и все соседние
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const neighborRow = checkRow + dr;
                    const neighborCol = checkCol + dc;
                    
                    if (neighborRow >= 0 && neighborRow < GAME_CONFIG.BOARD_SIZE &&
                        neighborCol >= 0 && neighborCol < GAME_CONFIG.BOARD_SIZE) {
                        if (board[neighborRow][neighborCol] === GAME_CONFIG.CELL_STATES.SHIP) {
                            return false;
                        }
                    }
                }
            }
        }
        
        return true;
    }

    placeShip(board, row, col, size, horizontal, shipType) {
        const ship = {
            row: row,
            col: col,
            size: size,
            horizontal: horizontal,
            hits: 0,
            sunk: false,
            type: shipType,
            cells: []
        };

        for (let i = 0; i < size; i++) {
            const cellRow = horizontal ? row : row + i;
            const cellCol = horizontal ? col + i : col;
            
            board[cellRow][cellCol] = GAME_CONFIG.CELL_STATES.SHIP;
            ship.cells.push({ row: cellRow, col: cellCol });
        }

        return ship;
    }

    placeSpecialCells() {
        // Размещаем специальные ячейки для игрока
        this.placeSpecialCellsForPlayer('player');
        
        // Размещаем специальные ячейки для соперника
        this.placeSpecialCellsForPlayer('opponent');
    }

    placeSpecialCellsForPlayer(owner) {
        const board = owner === 'player' ? this.playerBoard : this.opponentBoard;
        
        GAME_CONFIG.SPECIAL_CELLS.forEach(specialType => {
            for (let i = 0; i < specialType.count; i++) {
                let placed = false;
                let attempts = 0;
                
                while (!placed && attempts < 50) {
                    const row = Math.floor(Math.random() * GAME_CONFIG.BOARD_SIZE);
                    const col = Math.floor(Math.random() * GAME_CONFIG.BOARD_SIZE);
                    
                    if (board[row][col] === GAME_CONFIG.CELL_STATES.EMPTY) {
                        this.specialCells[owner].push({
                            row: row,
                            col: col,
                            type: specialType.name,
                            activated: false,
                            effect: specialType.effect,
                            icon: specialType.icon
                        });
                        placed = true;
                    }
                    attempts++;
                }
            }
        });
    }

    renderGameBoard() {
        const container = document.getElementById('gameContainer');
        container.innerHTML = `
            <div class="game-board active">
                <div class="game-info">
                    <div class="team-info">
                        <div class="team-logo" style="background: linear-gradient(135deg, ${this.playerClub.colors[0]}, ${this.playerClub.colors[1]})">${this.playerClub.logo}</div>
                        <div class="team-name">${this.playerClub.name}</div>
                    </div>
                    <div class="vs-text">VS</div>
                    <div class="team-info">
                        <div class="team-logo" style="background: linear-gradient(135deg, ${this.opponentClub.colors[0]}, ${this.opponentClub.colors[1]})">${this.opponentClub.logo}</div>
                        <div class="team-name">${this.opponentClub.name}</div>
                    </div>
                </div>

                <div class="game-status" id="gameStatus">
                    <h3>Подготовка к матчу</h3>
                    <p>${GAME_MESSAGES.PLACEMENT_INSTRUCTION}</p>
                </div>

                <div class="ships-panel">
                    <h3>Состав команды</h3>
                    <div class="ships-list" id="shipsList">
                        ${this.renderShipsList()}
                    </div>
                </div>

                <div class="special-cells-panel">
                    <h4>Специальные позиции</h4>
                    <div class="special-cells-list">
                        ${GAME_CONFIG.SPECIAL_CELLS.map(cell => `
                            <div class="special-cell-item">
                                <span class="special-icon">${cell.icon}</span>
                                <span>${cell.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="boards-container">
                    <div class="board-section">
                        <div class="board-title">Ваша схема</div>
                        <div class="board" id="playerBoard">
                            ${this.renderBoard('player')}
                        </div>
                    </div>
                    <div class="board-section">
                        <div class="board-title">Схема соперника</div>
                        <div class="board" id="opponentBoard">
                            ${this.renderBoard('opponent')}
                        </div>
                    </div>
                </div>

                <div class="game-controls">
                    <button class="btn secondary" id="reshuffleBtn">Перетасовать</button>
                    <button class="btn" id="startBattleBtn">Начать матч</button>
                </div>
            </div>

            <div class="modal" id="gameModal">
                <div class="modal-content" id="modalContent">
                </div>
            </div>
        `;
    }

    renderBoard(owner) {
        const board = owner === 'player' ? this.playerBoard : this.opponentBoard;
        const isOpponent = owner === 'opponent';
        const specialCells = this.specialCells[owner];
        
        let html = '';
        
        for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
            for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
                const cellState = board[row][col];
                const specialCell = specialCells.find(sc => sc.row === row && sc.col === col);
                
                let cellClass = 'cell';
                let cellContent = '';
                
                if (isOpponent) {
                    cellClass += ' opponent-cell';
                    if (this.currentPhase === GAME_CONFIG.GAME_PHASES.BATTLE) {
                        if (cellState === GAME_CONFIG.CELL_STATES.HIT) {
                            cellClass += ' hit';
                            cellContent = '💥';
                        } else if (cellState === GAME_CONFIG.CELL_STATES.MISS) {
                            cellClass += ' miss';
                            cellContent = '•';
                        }
                    }
                } else {
                    // Для игрока показываем все корабли
                    if (cellState === GAME_CONFIG.CELL_STATES.SHIP) {
                        cellClass += ' ship';
                        cellContent = this.playerClub.logo;
                    } else if (cellState === GAME_CONFIG.CELL_STATES.HIT) {
                        cellClass += ' hit';
                        cellContent = '💥';
                    } else if (cellState === GAME_CONFIG.CELL_STATES.MISS) {
                        cellClass += ' miss';
                        cellContent = '•';
                    }
                }
                
                // Специальные ячейки
                if (specialCell && !specialCell.activated) {
                    if (!isOpponent || this.currentPhase !== GAME_CONFIG.GAME_PHASES.BATTLE) {
                        cellClass += ' special';
                        cellContent = specialCell.icon;
                    }
                }
                
                html += `<div class="${cellClass}" data-row="${row}" data-col="${col}">${cellContent}</div>`;
            }
        }
        
        return html;
    }

    renderShipsList() {
        return GAME_CONFIG.SHIPS.map(ship => `
            <div class="ship-item">
                <div class="ship-count">${ship.count}</div>
                <div class="ship-name">${ship.name}</div>
            </div>
        `).join('');
    }

    reshuffleShips() {
        this.generateRandomShipPlacement();
        this.renderGameBoard();
        this.updateGameStatus(GAME_MESSAGES.PLACEMENT_INSTRUCTION);
    }

    startBattle() {
        this.currentPhase = GAME_CONFIG.GAME_PHASES.BATTLE;
        this.renderGameBoard();
        this.updateGameStatus(GAME_MESSAGES.BATTLE_START);
    }

    playerShoot(row, col) {
        if (!this.isPlayerTurn || this.gameEnded) return;
        
        const cellState = this.opponentBoard[row][col];
        
        // Проверяем, что ячейка еще не была атакована
        if (cellState === GAME_CONFIG.CELL_STATES.HIT || cellState === GAME_CONFIG.CELL_STATES.MISS) {
            return;
        }
        
        let hit = false;
        let message = '';
        let extraTurn = false;
        
        // Проверяем специальные ячейки
        const specialCell = this.specialCells.opponent.find(sc => sc.row === row && sc.col === col && !sc.activated);
        
        if (specialCell) {
            this.activateSpecialCell(specialCell, 'opponent', row, col);
            extraTurn = true;
        }
        
        // Проверяем попадание в корабль
        if (cellState === GAME_CONFIG.CELL_STATES.SHIP) {
            this.opponentBoard[row][col] = GAME_CONFIG.CELL_STATES.HIT;
            hit = true;
            message = GAME_MESSAGES.HIT;
            
            // Проверяем, потоплен ли корабль
            const ship = this.opponentShips.find(s => 
                s.cells.some(cell => cell.row === row && cell.col === col)
            );
            
            if (ship) {
                ship.hits++;
                if (ship.hits === ship.size) {
                    ship.sunk = true;
                    message = GAME_MESSAGES.SHIP_SUNK;
                    
                    // Проверяем бонус для 3-палубных кораблей
                    if (ship.type.bonus === 'extra_turn') {
                        extraTurn = true;
                        message += ' ' + GAME_MESSAGES.EXTRA_TURN;
                    }
                    
                    // Помечаем все ячейки корабля как потопленные
                    ship.cells.forEach(cell => {
                        this.opponentBoard[cell.row][cell.col] = GAME_CONFIG.CELL_STATES.SUNK;
                    });
                }
            }
            
            // Проверяем победу
            if (this.checkVictory('player')) {
                this.endGame('player');
                return;
            }
        } else {
            this.opponentBoard[row][col] = GAME_CONFIG.CELL_STATES.MISS;
            message = GAME_MESSAGES.MISS;
        }
        
        this.updateGameStatus(message);
        this.renderGameBoard();
        
        // Определяем следующий ход
        if (hit || extraTurn) {
            // Игрок продолжает ход
            this.isPlayerTurn = true;
        } else {
            // Ход переходит к компьютеру
            this.isPlayerTurn = false;
            setTimeout(() => this.computerTurn(), 1000);
        }
    }

    computerTurn() {
        if (this.isPlayerTurn || this.gameEnded) return;
        
        let row, col;
        let attempts = 0;
        
        // Простая стратегия: случайный выбор свободных ячеек
        do {
            row = Math.floor(Math.random() * GAME_CONFIG.BOARD_SIZE);
            col = Math.floor(Math.random() * GAME_CONFIG.BOARD_SIZE);
            attempts++;
        } while ((this.playerBoard[row][col] === GAME_CONFIG.CELL_STATES.HIT || 
                 this.playerBoard[row][col] === GAME_CONFIG.CELL_STATES.MISS) && 
                 attempts < 100);
        
        const cellState = this.playerBoard[row][col];
        let hit = false;
        let message = '';
        
        // Проверяем специальные ячейки
        const specialCell = this.specialCells.player.find(sc => sc.row === row && sc.col === col && !sc.activated);
        
        if (specialCell) {
            if (specialCell.type === 'Защита') {
                // Защищенная ячейка требует два хода
                if (!specialCell.partially_damaged) {
                    specialCell.partially_damaged = true;
                    message = GAME_MESSAGES.PROTECTION_ACTIVATED;
                    this.isPlayerTurn = true;
                    this.updateGameStatus(message);
                    return;
                } else {
                    this.activateSpecialCell(specialCell, 'player', row, col);
                }
            } else {
                this.activateSpecialCell(specialCell, 'player', row, col);
            }
        }
        
        // Проверяем попадание в корабль
        if (cellState === GAME_CONFIG.CELL_STATES.SHIP) {
            this.playerBoard[row][col] = GAME_CONFIG.CELL_STATES.HIT;
            hit = true;
            message = `Соперник попал в ${row + 1}:${col + 1}!`;
            
            // Проверяем, потоплен ли корабль
            const ship = this.playerShips.find(s => 
                s.cells.some(cell => cell.row === row && cell.col === col)
            );
            
            if (ship) {
                ship.hits++;
                if (ship.hits === ship.size) {
                    ship.sunk = true;
                    message = `Соперник потопил вашу эмблему!`;
                    
                    // Помечаем все ячейки корабля как потопленные
                    ship.cells.forEach(cell => {
                        this.playerBoard[cell.row][cell.col] = GAME_CONFIG.CELL_STATES.SUNK;
                    });
                }
            }
            
            // Проверяем поражение
            if (this.checkVictory('opponent')) {
                this.endGame('opponent');
                return;
            }
        } else {
            this.playerBoard[row][col] = GAME_CONFIG.CELL_STATES.MISS;
            message = `Соперник промахнулся по ${row + 1}:${col + 1}`;
        }
        
        this.updateGameStatus(message);
        this.renderGameBoard();
        
        // Определяем следующий ход
        if (hit) {
            // Компьютер продолжает ход
            setTimeout(() => this.computerTurn(), 1000);
        } else {
            // Ход переходит к игроку
            this.isPlayerTurn = true;
        }
    }

    activateSpecialCell(specialCell, owner, row, col) {
        specialCell.activated = true;
        
        switch (specialCell.type) {
            case 'Подсветка':
                this.illuminateArea(row, col, owner);
                break;
            case 'Доп. ход':
                this.updateGameStatus(GAME_MESSAGES.SPECIAL_CELL_ACTIVATED + ' ' + GAME_MESSAGES.EXTRA_TURN);
                break;
            case 'Защита':
                // Обрабатывается в соответствующих методах
                break;
        }
    }

    illuminateArea(centerRow, centerCol, owner) {
        const targetBoard = owner === 'player' ? this.opponentBoard : this.playerBoard;
        
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const row = centerRow + dr;
                const col = centerCol + dc;
                
                if (row >= 0 && row < GAME_CONFIG.BOARD_SIZE && 
                    col >= 0 && col < GAME_CONFIG.BOARD_SIZE) {
                    // Подсвечиваем область (эффект реализуется через CSS)
                    setTimeout(() => {
                        const cell = document.querySelector(
                            `${owner === 'player' ? '#opponentBoard' : '#playerBoard'} .cell[data-row="${row}"][data-col="${col}"]`
                        );
                        if (cell) {
                            cell.classList.add('revealed');
                            setTimeout(() => cell.classList.remove('revealed'), 2000);
                        }
                    }, 100);
                }
            }
        }
        
        this.updateGameStatus(GAME_MESSAGES.ILLUMINATION_ACTIVATED);
    }

    checkVictory(player) {
        const targetShips = player === 'player' ? this.opponentShips : this.playerShips;
        return targetShips.every(ship => ship.sunk);
    }

    endGame(winner) {
        this.gameEnded = true;
        this.currentPhase = GAME_CONFIG.GAME_PHASES.GAME_OVER;
        
        const modal = document.getElementById('gameModal');
        const modalContent = document.getElementById('modalContent');
        
        if (winner === 'player') {
            modalContent.innerHTML = `
                <div class="victory-modal">
                    <h2>⚽ ${GAME_MESSAGES.VICTORY}</h2>
                    <p>${this.playerClub.name} разгромил ${this.opponentClub.name}!</p>
                    <button class="btn" id="newGameBtn">Новый матч</button>
                </div>
            `;
        } else {
            modalContent.innerHTML = `
                <div class="defeat-modal">
                    <h2>😔 ${GAME_MESSAGES.DEFEAT}</h2>
                    <p>${this.opponentClub.name} оказался сильнее ${this.playerClub.name}</p>
                    <button class="btn" id="newGameBtn">Попробовать снова</button>
                </div>
            `;
        }
        
        modal.classList.add('show');
    }

    updateGameStatus(message) {
        const statusElement = document.getElementById('gameStatus');
        if (statusElement) {
            statusElement.innerHTML = `
                <h3>${this.currentPhase === GAME_CONFIG.GAME_PHASES.BATTLE ? 'Матч идёт' : 'Подготовка'}</h3>
                <p>${message}</p>
            `;
        }
    }

    resetGame() {
        this.currentPhase = GAME_CONFIG.GAME_PHASES.CLUB_SELECTION;
        this.playerClub = null;
        this.opponentClub = null;
        this.gameEnded = false;
        this.isPlayerTurn = true;
        this.specialCells = { player: [], opponent: [] };
        
        document.getElementById('gameModal').classList.remove('show');
        this.renderClubSelection();
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new BattleshipGame();
}); 