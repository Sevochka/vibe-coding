class TableManager {
    constructor() {
        this.canvas = document.getElementById('tableCanvas');
        this.animation = new TableAnimation(this.canvas);
        this.currentWeek = 1;
        this.isPlaying = false;
        this.playInterval = null;
        this.autoPlaySpeed = 1500; // время между турами в мс
        
        this.standings = new Map();
        teams.forEach(team => {
            this.standings.set(team.id, {
                points: 0,
                gf: 0,
                ga: 0,
                gd: 0,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0
            });
        });

        this.setupControls();
        this.updateCanvasSize();
        window.addEventListener('resize', () => this.updateCanvasSize());
        
        // Автоматически запускаем анимацию при загрузке
        setTimeout(() => {
            this.startAnimation();
        }, 1000);
    }

    setupControls() {
        const playButton = document.getElementById('playButton');
        const weekSlider = document.getElementById('weekSlider');
        const currentWeek = document.getElementById('currentWeek');

        playButton.addEventListener('click', () => {
            if (this.isPlaying) {
                this.stopAnimation();
                playButton.textContent = 'Воспроизвести';
            } else {
                this.startAnimation();
                playButton.textContent = 'Пауза';
            }
            this.isPlaying = !this.isPlaying;
        });

        weekSlider.addEventListener('input', (e) => {
            this.stopAnimation();
            playButton.textContent = 'Воспроизвести';
            this.isPlaying = false;
            this.currentWeek = parseInt(e.target.value);
            currentWeek.textContent = `Тур ${this.currentWeek}`;
            this.updateToWeek(this.currentWeek);
        });
        
        // Максимальное значение слайдера равно количеству доступных туров
        weekSlider.max = results.length;
    }

    updateCanvasSize() {
        this.animation.updateCanvasSize();
        this.animation.draw();
    }

    startAnimation() {
        if (this.playInterval) return;
        
        this.playInterval = setInterval(() => {
            if (this.currentWeek < results.length) {
                this.currentWeek++;
                document.getElementById('weekSlider').value = this.currentWeek;
                document.getElementById('currentWeek').textContent = `Тур ${this.currentWeek}`;
                this.updateToWeek(this.currentWeek);
            } else {
                // Когда анимация достигает конца, мы перезапускаем её с первого тура
                this.currentWeek = 0;
            }
        }, this.autoPlaySpeed);
    }

    stopAnimation() {
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    }

    updateToWeek(week) {
        // Сбрасываем таблицу
        this.standings.forEach((stats, teamId) => {
            Object.keys(stats).forEach(key => {
                stats[key] = 0;
            });
        });

        // Обновляем статистику для всех матчей до текущей недели
        for (let i = 0; i < week; i++) {
            const weekResults = results[i];
            if (!weekResults) continue;

            weekResults.matches.forEach(match => {
                const homeStats = this.standings.get(match.home);
                const awayStats = this.standings.get(match.away);
                
                if (!homeStats || !awayStats) {
                    console.warn(`Неизвестная команда в матче: ${match.home} vs ${match.away}`);
                    return;
                }
                
                const [homeGoals, awayGoals] = match.score;
                
                // Обновляем статистику домашней команды
                homeStats.played++;
                homeStats.gf += homeGoals;
                homeStats.ga += awayGoals;
                homeStats.gd = homeStats.gf - homeStats.ga;
                
                // Обновляем статистику гостевой команды
                awayStats.played++;
                awayStats.gf += awayGoals;
                awayStats.ga += homeGoals;
                awayStats.gd = awayStats.gf - awayStats.ga;
                
                if (homeGoals > awayGoals) {
                    homeStats.won++;
                    homeStats.points += 3;
                    awayStats.lost++;
                } else if (homeGoals < awayGoals) {
                    awayStats.won++;
                    awayStats.points += 3;
                    homeStats.lost++;
                } else {
                    homeStats.drawn++;
                    awayStats.drawn++;
                    homeStats.points += 1;
                    awayStats.points += 1;
                }
            });
        }

        // Сортируем команды
        const sortedTeams = Array.from(this.standings.entries()).sort((a, b) => {
            if (a[1].points !== b[1].points) {
                return b[1].points - a[1].points;
            }
            if (a[1].gd !== b[1].gd) {
                return b[1].gd - a[1].gd;
            }
            return b[1].gf - a[1].gf;
        });

        // Обновляем анимацию
        this.animation.updateStandings(sortedTeams.map(team => team[0]), week);
        
        // Выводим текущую таблицу в консоль для отладки
        console.log('Тур', week, 'Таблица:', sortedTeams);
    }
    
    // Метод для отображения детальной статистики команды
    showTeamStats(teamId) {
        const stats = this.standings.get(teamId);
        if (!stats) return;
        
        const team = teams.find(t => t.id === teamId);
        
        alert(`
            Команда: ${team.name}
            Очки: ${stats.points}
            Игры: ${stats.played}
            Победы: ${stats.won}
            Ничьи: ${stats.drawn}
            Поражения: ${stats.lost}
            Забитые голы: ${stats.gf}
            Пропущенные голы: ${stats.ga}
            Разница голов: ${stats.gd}
        `);
    }
}

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    const manager = new TableManager();
    manager.updateToWeek(1);
}); 