class UserProfile {
    constructor() {
        this.currentTab = 'comments';
        this.currentSort = 'date';
        this.currentFilter = 'all';
        
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupSorting();
        this.setupFilters();
        this.loadUserData();
        this.loadTabContent();
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Убираем активные классы
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Добавляем активные классы
                button.classList.add('active');
                document.getElementById(`${tabId}-panel`).classList.add('active');
                
                this.currentTab = tabId;
                this.loadTabContent();
            });
        });
    }

    setupSorting() {
        const sortSelect = document.getElementById('sortSelect');
        sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.loadTabContent();
        });
    }

    setupFilters() {
        // Фильтры для подписок
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const filterButtons = document.querySelectorAll('.filter-btn');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                e.target.classList.add('active');
                this.currentFilter = e.target.getAttribute('data-filter');
                this.loadSubscriptions();
            }
        });

        // Показать все награды
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('show-all-awards')) {
                this.showAllAwards();
            }
        });
    }

    loadUserData() {
        // Загружаем данные пользователя в карточку
        if (typeof userData !== 'undefined') {
            this.populateUserCard(userData);
        }
    }

    populateUserCard(user) {
        // Обновляем аватар
        const avatars = document.querySelectorAll('.user-card-avatar img, .profile-avatar img');
        avatars.forEach(img => {
            img.src = user.avatar;
            img.alt = user.username;
        });

        // Обновляем имя и статус
        document.querySelector('.user-card-header h2').textContent = user.username;
        document.querySelector('.profile-header-info h1').textContent = user.username;
        document.querySelector('.profile-slug').textContent = user.slug;
        document.querySelector('.profile-status').textContent = user.status;

        // Обновляем статистику
        const stats = document.querySelectorAll('.stat-value');
        stats[0].textContent = user.stats.rating;
        stats[1].textContent = user.stats.place;
        stats[2].innerHTML = `⭐ ${user.stats.editorialRating}`;

        // Обновляем информацию
        const infoValues = document.querySelectorAll('.info-value');
        infoValues[0].textContent = user.badge.name;
        infoValues[1].textContent = user.info.registrationDate;
        infoValues[2].textContent = user.info.realName;
        infoValues[3].textContent = user.info.gender;
        infoValues[4].textContent = user.info.age;

        // Обновляем награды (первые 3)
        const awardsList = document.querySelector('.awards-list');
        awardsList.innerHTML = '';
        user.awards.slice(0, 3).forEach(award => {
            const awardEl = document.createElement('div');
            awardEl.className = 'award-item';
            awardEl.innerHTML = `
                <div class="award-icon">${award.icon}</div>
                <span>${award.name}</span>
            `;
            awardsList.appendChild(awardEl);
        });

        // Обновляем описание
        document.querySelector('.user-about p').textContent = user.info.about;

        // Обновляем социальные сети
        const socialLinks = document.querySelector('.social-links');
        socialLinks.innerHTML = '';
        user.socialLinks.forEach(link => {
            const linkEl = document.createElement('a');
            linkEl.href = link.url;
            linkEl.className = `social-link ${link.platform}`;
            linkEl.textContent = link.name;
            linkEl.target = '_blank';
            socialLinks.appendChild(linkEl);
        });

        // Обновляем индикатор онлайн
        const onlineIndicator = document.querySelector('.online-indicator');
        if (user.isOnline) {
            onlineIndicator.style.display = 'block';
        } else {
            onlineIndicator.style.display = 'none';
        }
    }

    loadTabContent() {
        switch (this.currentTab) {
            case 'comments':
                this.loadComments();
                break;
            case 'posts':
                this.loadPosts();
                break;
            case 'subscriptions':
                this.loadSubscriptions();
                break;
            case 'followers':
                this.loadFollowers();
                break;
            default:
                break;
        }
    }

    loadComments() {
        if (typeof commentsData === 'undefined') return;
        
        const container = document.getElementById('commentsList');
        let comments = [...commentsData];
        
        // Сортировка
        if (this.currentSort === 'rating') {
            comments.sort((a, b) => b.rating - a.rating);
        } else {
            comments.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        container.innerHTML = '';
        
        comments.forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'content-card';
            
            const ratingClass = comment.rating > 0 ? 'positive' : comment.rating < 0 ? 'negative' : '';
            
            commentEl.innerHTML = `
                <div class="card-header">
                    <div class="card-date">${this.formatDate(comment.date)}</div>
                    <div class="card-rating ${ratingClass}">
                        ${comment.rating > 0 ? '+' : ''}${comment.rating}
                    </div>
                </div>
                <div class="card-content">
                    <p>${comment.text}</p>
                    <a href="${comment.link}" class="card-link">${comment.articleTitle}</a>
                </div>
            `;
            
            container.appendChild(commentEl);
        });
    }

    loadPosts() {
        if (typeof postsData === 'undefined') return;
        
        const container = document.getElementById('postsList');
        let posts = [...postsData.posts];
        
        // Сортировка
        if (this.currentSort === 'rating') {
            posts.sort((a, b) => b.views - a.views); // Сортируем по просмотрам
        } else {
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        container.innerHTML = '';
        
        posts.forEach(post => {
            const postEl = document.createElement('div');
            postEl.className = 'content-card';
            
            postEl.innerHTML = `
                <div class="card-header">
                    <div class="card-date">${this.formatDate(post.date)}</div>
                    <div class="card-rating positive">👁 ${post.views}</div>
                </div>
                <div class="card-content">
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            
            container.appendChild(postEl);
        });
    }

    loadSubscriptions() {
        if (typeof postsData === 'undefined') return;
        
        const container = document.getElementById('subscriptionsList');
        let subscriptions = [];
        
        // Фильтрация подписок
        switch (this.currentFilter) {
            case 'blogs':
                subscriptions = postsData.subscriptions.blogs;
                break;
            case 'tags':
                subscriptions = postsData.subscriptions.tags;
                break;
            case 'users':
                subscriptions = postsData.subscriptions.users;
                break;
            default:
                subscriptions = [
                    ...postsData.subscriptions.blogs.map(item => ({...item, type: 'blog'})),
                    ...postsData.subscriptions.tags.map(item => ({...item, type: 'tag'})),
                    ...postsData.subscriptions.users.map(item => ({...item, type: 'user'}))
                ];
        }
        
        container.innerHTML = '';
        
        subscriptions.forEach(sub => {
            const subEl = document.createElement('div');
            subEl.className = 'content-card';
            
            const typeIcon = sub.type === 'blog' ? '📝' : sub.type === 'tag' ? '🏷️' : '👤';
            
            subEl.innerHTML = `
                <div class="card-content">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>${typeIcon}</span>
                        <div>
                            <h4>${sub.name}</h4>
                            ${sub.description ? `<p>${sub.description}</p>` : ''}
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(subEl);
        });
    }

    loadFollowers() {
        if (typeof postsData === 'undefined') return;
        
        const container = document.getElementById('followersList');
        const followers = postsData.followers;
        
        container.innerHTML = '';
        
        followers.forEach(follower => {
            const followerEl = document.createElement('div');
            followerEl.className = 'content-card';
            
            followerEl.innerHTML = `
                <div class="card-content">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <img src="${follower.avatar}" alt="${follower.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                        <div>
                            <h4>${follower.name}</h4>
                            <p style="color: var(--sports-grey-600); font-size: 14px;">${follower.status}</p>
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(followerEl);
        });
    }

    showAllAwards() {
        if (typeof userData === 'undefined') return;
        
        const awardsList = document.querySelector('.awards-list');
        awardsList.innerHTML = '';
        
        userData.awards.forEach(award => {
            const awardEl = document.createElement('div');
            awardEl.className = 'award-item';
            awardEl.title = award.description;
            awardEl.innerHTML = `
                <div class="award-icon">${award.icon}</div>
                <span>${award.name}</span>
            `;
            awardsList.appendChild(awardEl);
        });
        
        // Скрываем кнопку
        document.querySelector('.show-all-awards').style.display = 'none';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Вчера';
        if (diffDays <= 7) return `${diffDays} дней назад`;
        if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} недель назад`;
        
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new UserProfile();
}); 