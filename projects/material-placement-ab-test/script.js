class MaterialPlacementABTest {
    constructor() {
        this.stats = this.loadStats();
        this.totalViews = 0;
        this.init();
    }

    // Загружаем статистику из localStorage
    loadStats() {
        const savedStats = localStorage.getItem('material-placement-ab-test-stats');
        return savedStats ? JSON.parse(savedStats) : { ...DEFAULT_STATS };
    }

    // Сохраняем статистику в localStorage
    saveStats() {
        localStorage.setItem('material-placement-ab-test-stats', JSON.stringify(this.stats));
    }

    // Инициализация
    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.trackViews();
    }

    // Настраиваем обработчики событий
    setupEventListeners() {
        // Клики по счетчикам комментариев
        document.querySelectorAll('.comment-count').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const variant = this.getVariantFromElement(element);
                this.trackClick(variant, element);
            });
        });

        // Кнопка сброса
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetStats();
        });

        // Кнопка экспорта
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportResults();
        });

        // Наведение мыши для имитации просмотров
        document.querySelectorAll('.material-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                const variant = item.dataset.variant;
                this.trackView(variant);
            });
        });
    }

    // Получаем ID варианта из элемента
    getVariantFromElement(element) {
        const classList = Array.from(element.classList);
        const variantClass = classList.find(cls => cls.startsWith('variant-'));
        return variantClass ? variantClass.split('-')[1].toUpperCase() : null;
    }

    // Отслеживаем клик
    trackClick(variant, element) {
        if (!variant) return;

        this.stats[variant].clicks++;
        this.saveStats();
        this.updateDisplay();
        this.animateClick(element);

        // Отправляем событие для аналитики
        this.sendAnalyticsEvent('material_comment_click', {
            variant: variant,
            icon: VARIANTS_DATA[variant].icon,
            name: VARIANTS_DATA[variant].name,
            materialTitle: MATERIAL_DATA.title
        });

        // Показываем уведомление
        this.showNotification(`Клик по варианту ${variant} (${VARIANTS_DATA[variant].name})`, 'info');
    }

    // Отслеживаем просмотр
    trackView(variant) {
        if (!variant) return;

        this.stats[variant].views++;
        this.totalViews++;
        this.saveStats();
        this.updateDisplay();
    }

    // Анимация клика
    animateClick(element) {
        element.classList.add('clicked');
        setTimeout(() => {
            element.classList.remove('clicked');
        }, 600);
    }

    // Рассчитываем CTR
    calculateCTR(variant) {
        const { clicks, views } = this.stats[variant];
        return views > 0 ? Math.round((clicks / views) * 100) : 0;
    }

    // Обновляем отображение статистики
    updateDisplay() {
        Object.keys(this.stats).forEach(variant => {
            const clicksElement = document.getElementById(`clicks-${variant.toLowerCase()}`);
            const ctrElement = document.getElementById(`ctr-${variant.toLowerCase()}`);

            if (clicksElement) {
                clicksElement.textContent = this.stats[variant].clicks;
            }

            if (ctrElement) {
                const ctr = this.calculateCTR(variant);
                ctrElement.textContent = `${ctr}%`;
            }
        });

        this.updateSummary();
    }

    // Обновляем общую сводку
    updateSummary() {
        const totalClicks = Object.values(this.stats).reduce((sum, stat) => sum + stat.clicks, 0);
        const leader = this.findLeader();

        document.getElementById('total-clicks').textContent = totalClicks;
        document.getElementById('leader-variant').textContent = leader ? 
            `Вариант ${leader} (${VARIANTS_DATA[leader].name})` : '-';
    }

    // Находим лидера по кликам
    findLeader() {
        let maxClicks = 0;
        let leader = null;

        Object.entries(this.stats).forEach(([variant, stats]) => {
            if (stats.clicks > maxClicks) {
                maxClicks = stats.clicks;
                leader = variant;
            }
        });

        return leader;
    }

    // Сбрасываем статистику
    resetStats() {
        if (confirm('Вы уверены, что хотите сбросить всю статистику?')) {
            this.stats = { ...DEFAULT_STATS };
            this.totalViews = 0;
            this.saveStats();
            this.updateDisplay();

            this.showNotification('Статистика сброшена', 'success');
        }
    }

    // Экспортируем результаты
    exportResults() {
        const results = {
            timestamp: new Date().toISOString(),
            testType: 'material_placement_comment_icons',
            materialData: MATERIAL_DATA,
            totalViews: this.totalViews,
            variants: Object.entries(this.stats).map(([variant, stats]) => ({
                variant,
                name: VARIANTS_DATA[variant].name,
                icon: VARIANTS_DATA[variant].icon,
                description: VARIANTS_DATA[variant].description,
                psychology: VARIANTS_DATA[variant].psychology,
                clicks: stats.clicks,
                views: stats.views,
                ctr: this.calculateCTR(variant)
            })),
            leader: this.findLeader(),
            summary: {
                totalClicks: Object.values(this.stats).reduce((sum, stat) => sum + stat.clicks, 0),
                averageCTR: this.calculateAverageCTR(),
                bestPerformingVariant: this.getBestPerformingVariant()
            },
            recommendations: this.generateRecommendations()
        };

        // Создаём и скачиваем файл
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `material-placement-ab-test-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showNotification('Результаты экспортированы', 'success');
    }

    // Рассчитываем средний CTR
    calculateAverageCTR() {
        const variants = Object.keys(this.stats);
        const totalCTR = variants.reduce((sum, variant) => sum + this.calculateCTR(variant), 0);
        return Math.round(totalCTR / variants.length);
    }

    // Находим лучший вариант по CTR
    getBestPerformingVariant() {
        let maxCTR = 0;
        let bestVariant = null;

        Object.entries(this.stats).forEach(([variant, stats]) => {
            const ctr = this.calculateCTR(variant);
            if (ctr > maxCTR && stats.views > 0) {
                maxCTR = ctr;
                bestVariant = variant;
            }
        });

        return bestVariant ? {
            variant: bestVariant,
            name: VARIANTS_DATA[bestVariant].name,
            ctr: maxCTR
        } : null;
    }

    // Генерируем рекомендации
    generateRecommendations() {
        const totalClicks = Object.values(this.stats).reduce((sum, stat) => sum + stat.clicks, 0);
        const bestVariant = this.getBestPerformingVariant();
        
        if (totalClicks < 10) {
            return 'Недостаточно данных для формирования рекомендаций. Продолжите тестирование.';
        }

        if (!bestVariant) {
            return 'Все варианты показывают схожие результаты. Рекомендуется продолжить тестирование.';
        }

        return `Рекомендуется использовать вариант ${bestVariant.variant} (${bestVariant.name}) с CTR ${bestVariant.ctr}%. ${VARIANTS_DATA[bestVariant.variant].psychology}`;
    }

    // Показываем уведомление
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? 'var(--sports-primary-color)' : 'var(--sports-blue-A700)'};
            color: white;
            border-radius: 6px;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            font-size: 14px;
            line-height: 1.4;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Отправляем событие аналитики
    sendAnalyticsEvent(eventName, parameters) {
        console.log('Analytics Event:', eventName, parameters);
        // Интеграция с системами аналитики
    }
}

// Добавляем CSS для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Инициализируем тест при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.materialPlacementABTest = new MaterialPlacementABTest();
}); 