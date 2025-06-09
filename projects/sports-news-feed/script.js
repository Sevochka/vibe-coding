// Основной функционал спортивной ленты Sports.ru
class SportsNewsFeed {
    constructor() {
        this.userInterests = this.loadUserInterests();
        this.currentPage = 0;
        this.newsPerPage = 5;
        this.currentSuggestions = [];
        this.readNews = new Set();
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.renderNews();
        this.updateSuggestions();
        this.bindEvents();
        this.startAutoUpdate();
        this.updateScrollIndicator();
        
        // Показываем модальное окно настроек при первом запуске
        if (this.userInterests.length === 0) {
            setTimeout(() => this.openSettings(), 1000);
        }
    }
    
    // Загрузка интересов пользователя из localStorage
    loadUserInterests() {
        const saved = localStorage.getItem('sportsInterests');
        return saved ? JSON.parse(saved) : [];
    }
    
    // Сохранение интересов пользователя
    saveUserInterests() {
        localStorage.setItem('sportsInterests', JSON.stringify(this.userInterests));
    }
    
    // Отрисовка новостей
    renderNews() {
        const newsFeed = document.getElementById('newsFeed');
        const startIndex = this.currentPage * this.newsPerPage;
        const endIndex = startIndex + this.newsPerPage;
        
        // Фильтруем новости по интересам пользователя
        let filteredNews = this.getFilteredNews();
        const newsToShow = filteredNews.slice(startIndex, endIndex);
        
        if (this.currentPage === 0) {
            newsFeed.innerHTML = '';
        }
        
        newsToShow.forEach(news => {
            const newsElement = this.createNewsElement(news);
            newsFeed.appendChild(newsElement);
        });
        
        this.updateLoadMoreButton(filteredNews.length, endIndex);
    }
    
    // Получение отфильтрованных новостей
    getFilteredNews() {
        if (this.userInterests.length === 0) {
            return sportsNews;
        }
        
        const userCategoryNames = this.userInterests.map(interest => 
            sportsCategories.find(cat => cat.id === interest)?.name
        ).filter(Boolean);
        
        const filtered = sportsNews.filter(news => 
            userCategoryNames.includes(news.category)
        );
        
        // Если отфильтрованных новостей мало, добавляем популярные
        if (filtered.length < 5) {
            const popular = getPopularNews().filter(news => 
                !filtered.find(f => f.id === news.id)
            );
            return [...filtered, ...popular];
        }
        
        return filtered;
    }
    
    // Создание элемента новости
    createNewsElement(news) {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.dataset.newsId = news.id;
        
        const category = sportsCategories.find(cat => cat.name === news.category);
        const categoryColor = category ? category.color : '#00c78b';
        
        newsItem.innerHTML = `
            <div class="news-time">${formatNewsTime(news.datetime)}</div>
            <div class="news-content">${news.content}</div>
            <div class="news-meta">
                <span class="news-category" style="background-color: ${categoryColor}20; color: ${categoryColor};">
                    ${category ? category.emoji : '📰'} ${news.category}
                </span>
                <div class="news-reactions">
                    ${news.reactions.map(reaction => 
                        `<button class="reaction-btn" data-reaction="${reaction}">${reaction}</button>`
                    ).join('')}
                </div>
            </div>
        `;
        
        // Добавляем обработчик клика для отметки как прочитанной
        newsItem.addEventListener('click', () => {
            this.markAsRead(news.id, news.category);
            this.updateSuggestionsBasedOnReading();
        });
        
        return newsItem;
    }
    
    // Отметка новости как прочитанной
    markAsRead(newsId, category) {
        this.readNews.add(newsId);
        const newsElement = document.querySelector(`[data-news-id="${newsId}"]`);
        if (newsElement) {
            newsElement.style.opacity = '0.7';
        }
        
        // Обновляем подсказки на основе прочитанной категории
        const categoryId = sportsCategories.find(cat => cat.name === category)?.id;
        if (categoryId && !this.userInterests.includes(categoryId)) {
            // Предлагаем добавить категорию в интересы
            this.suggestAddingInterest(categoryId);
        }
    }
    
    // Предложение добавить интерес
    suggestAddingInterest(categoryId) {
        const category = sportsCategories.find(cat => cat.id === categoryId);
        if (!category) return;
        
        const suggestion = document.createElement('div');
        suggestion.className = 'interest-suggestion';
        suggestion.innerHTML = `
            <div style="background: var(--sports-primary-light-color-hover); padding: 12px; border-radius: 8px; margin: 10px 0;">
                <p>Заметили, что вас интересует ${category.emoji} ${category.name}. Добавить в интересы?</p>
                <button onclick="this.parentElement.parentElement.remove(); newsFeedApp.addInterest('${categoryId}')" 
                        style="background: var(--sports-primary-color); color: white; border: none; padding: 6px 12px; border-radius: 4px; margin-right: 8px;">
                    Да
                </button>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: var(--sports-grey-400); color: white; border: none; padding: 6px 12px; border-radius: 4px;">
                    Нет
                </button>
            </div>
        `;
        
        document.getElementById('newsFeed').insertBefore(suggestion, document.getElementById('newsFeed').firstChild);
    }
    
    // Добавление интереса
    addInterest(categoryId) {
        if (!this.userInterests.includes(categoryId)) {
            this.userInterests.push(categoryId);
            this.saveUserInterests();
            this.renderNews();
            this.updateSuggestions();
        }
    }
    
    // Обновление кнопки "Загрузить ещё"
    updateLoadMoreButton(totalNews, loadedNews) {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadedNews >= totalNews) {
            loadMoreBtn.textContent = 'Все новости загружены';
            loadMoreBtn.disabled = true;
            loadMoreBtn.style.opacity = '0.6';
        } else {
            loadMoreBtn.textContent = 'Загрузить ещё';
            loadMoreBtn.disabled = false;
            loadMoreBtn.style.opacity = '1';
        }
    }
    
    // Обновление подсказок
    updateSuggestions() {
        const suggestions = getSuggestionsByInterests(this.userInterests);
        this.currentSuggestions = suggestions;
        this.renderSuggestions();
    }
    
    // Обновление подсказок на основе прочитанного
    updateSuggestionsBasedOnReading() {
        const readCategories = Array.from(this.readNews).map(newsId => {
            const news = sportsNews.find(n => n.id === parseInt(newsId));
            const category = sportsCategories.find(cat => cat.name === news?.category);
            return category?.id;
        }).filter(Boolean);
        
        if (readCategories.length > 0) {
            const newSuggestions = updateSuggestionsBasedOnReading(readCategories);
            if (newSuggestions.length > 0) {
                this.currentSuggestions = newSuggestions;
                this.renderSuggestions();
            }
        }
    }
    
    // Отрисовка подсказок
    renderSuggestions() {
        const container = document.getElementById('suggestionsContainer');
        container.innerHTML = '';
        
        this.currentSuggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'suggestion-btn';
            button.textContent = suggestion.text;
            button.onclick = () => window.open(suggestion.url, '_blank');
            container.appendChild(button);
        });
    }
    
    // Привязка событий
    bindEvents() {
        // Кнопка "Загрузить ещё"
        document.querySelector('.load-more-btn').addEventListener('click', () => {
            if (!this.isLoading) {
                this.loadMoreNews();
            }
        });
        
        // Кнопка настроек
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.openSettings();
        });
        
        // Модальное окно
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeSettings();
        });
        
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeSettings();
            }
        });
        
        document.getElementById('saveInterests').addEventListener('click', () => {
            this.saveSettings();
        });
        
        // Навигационные кнопки
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.navigatePage(-1);
        });
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            this.navigatePage(1);
        });
        
        // Скролл
        window.addEventListener('scroll', () => {
            this.updateScrollIndicator();
            this.checkAutoLoad();
        });
        
        // Обработчики реакций
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('reaction-btn')) {
                this.handleReaction(e.target);
            }
        });
    }
    
    // Загрузка дополнительных новостей
    loadMoreNews() {
        this.isLoading = true;
        const loadMoreBtn = document.querySelector('.load-more-btn');
        loadMoreBtn.textContent = 'Загрузка...';
        loadMoreBtn.classList.add('loading');
        
        // Имитация загрузки
        setTimeout(() => {
            this.currentPage++;
            this.renderNews();
            this.isLoading = false;
            loadMoreBtn.classList.remove('loading');
        }, 800);
    }
    
    // Автоматическая подгрузка при прокрутке
    checkAutoLoad() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (scrollTop + windowHeight >= documentHeight - 200) {
            if (!this.isLoading && !document.querySelector('.load-more-btn').disabled) {
                this.loadMoreNews();
            }
        }
    }
    
    // Навигация по страницам
    navigatePage(direction) {
        const newPage = this.currentPage + direction;
        if (newPage >= 0) {
            this.currentPage = newPage;
            this.renderNews();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Обработка реакций
    handleReaction(button) {
        const reaction = button.dataset.reaction;
        button.style.transform = 'scale(1.3)';
        button.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
        
        // Можно добавить аналитику реакций
        console.log(`Reaction: ${reaction}`);
    }
    
    // Обновление индикатора прокрутки
    updateScrollIndicator() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        const thumb = document.querySelector('.scroll-thumb');
        thumb.style.height = Math.min(Math.max(scrollPercent, 5), 100) + '%';
    }
    
    // Открытие настроек
    openSettings() {
        const modal = document.getElementById('modalOverlay');
        const interestsGrid = document.getElementById('interestsGrid');
        
        // Заполняем сетку интересов
        interestsGrid.innerHTML = '';
        sportsCategories.forEach(category => {
            const item = document.createElement('div');
            item.className = 'interest-item';
            if (this.userInterests.includes(category.id)) {
                item.classList.add('selected');
            }
            
            item.innerHTML = `
                <input type="checkbox" id="interest-${category.id}" 
                       ${this.userInterests.includes(category.id) ? 'checked' : ''}>
                <label for="interest-${category.id}">${category.emoji} ${category.name}</label>
            `;
            
            item.addEventListener('click', () => {
                const checkbox = item.querySelector('input');
                checkbox.checked = !checkbox.checked;
                item.classList.toggle('selected', checkbox.checked);
            });
            
            interestsGrid.appendChild(item);
        });
        
        modal.classList.add('active');
    }
    
    // Закрытие настроек
    closeSettings() {
        document.getElementById('modalOverlay').classList.remove('active');
    }
    
    // Сохранение настроек
    saveSettings() {
        const checkboxes = document.querySelectorAll('#interestsGrid input[type="checkbox"]');
        this.userInterests = [];
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const categoryId = checkbox.id.replace('interest-', '');
                this.userInterests.push(categoryId);
            }
        });
        
        this.saveUserInterests();
        this.currentPage = 0;
        this.renderNews();
        this.updateSuggestions();
        this.closeSettings();
        
        // Показываем уведомление
        this.showNotification('Настройки сохранены!');
    }
    
    // Показ уведомления
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--sports-primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Автоматическое обновление новостей
    startAutoUpdate() {
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% шанс появления новой новости
                this.simulateNewNews();
            }
        }, 30000); // Каждые 30 секунд
    }
    
    // Симуляция новой новости
    simulateNewNews() {
        const newNewsTemplates = [
            {
                content: `🔴 BREAKING: Новая сенсационная новость в мире спорта! <a href="https://www.sports.ru/" target="_blank">Подробности здесь</a>`,
                category: "Футбол",
                reactions: ["🔥", "⚡", "😱"]
            },
            {
                content: `⚽ Голы, сэйвы, эмоции! <a href="https://www.sports.ru/" target="_blank">Лучшие моменты дня</a> в нашем обзоре.`,
                category: "Хоккей", 
                reactions: ["🏒", "👏", "🎯"]
            }
        ];
        
        const template = newNewsTemplates[Math.floor(Math.random() * newNewsTemplates.length)];
        const newNews = {
            id: Date.now(),
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            datetime: new Date().toISOString(),
            content: template.content,
            category: template.category,
            reactions: template.reactions,
            priority: "high"
        };
        
        // Добавляем в начало массива новостей
        sportsNews.unshift(newNews);
        
        // Если пользователь на первой странице, обновляем ленту
        if (this.currentPage === 0) {
            this.renderNews();
        }
        
        // Показываем уведомление о новой новости
        this.showNotification('📰 Новая новость добавлена!');
    }
}

// Инициализация приложения
let newsFeedApp;

document.addEventListener('DOMContentLoaded', () => {
    newsFeedApp = new SportsNewsFeed();
});

// Добавляем CSS анимации
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
    
    .interest-suggestion {
        animation: slideIn 0.5s ease;
    }
`;
document.head.appendChild(style); 