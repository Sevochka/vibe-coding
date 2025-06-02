class CarouselManager {
    constructor(carouselType) {
        this.carouselType = carouselType;
        this.wrapper = document.getElementById(`${carouselType}-wrapper`);
        this.pagination = document.getElementById(`${carouselType}-pagination`);
        this.leftArrow = document.querySelector(`[data-carousel="${carouselType}"].carousel-arrow--left`);
        this.rightArrow = document.querySelector(`[data-carousel="${carouselType}"].carousel-arrow--right`);
        
        this.currentPage = 0;
        this.itemsPerPage = this.getItemsPerPage();
        this.totalPages = Math.ceil(recommendationsData.length / this.itemsPerPage);
        
        this.init();
    }
    
    getItemsPerPage() {
        const width = window.innerWidth;
        if (width < 768) {
            return this.carouselType === 'compact' ? 2 : 1;
        }
        return this.carouselType === 'compact' ? 3 : 2;
    }
    
    init() {
        this.renderCards();
        this.renderPagination();
        this.bindEvents();
        this.updateCarousel();
    }
    
    renderCards() {
        this.wrapper.innerHTML = recommendationsData.map(item => this.createCard(item)).join('');
    }
    
    createCard(item) {
        const flameIcon = `
            <svg class="flame-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.34032 1C6.34032 1 6.50553 2.90377 4.90852 4.80753C3.47672 6.54812 1.93478 7.90795 2.70575 10.682C3.47672 13.4561 5.89977 13.9456 5.89977 13.9456C5.89977 13.9456 5.23894 11.4435 7.22143 9.48536C7.22143 9.48536 7.2765 13.1841 10.2502 14C10.2502 14 13.5544 12.5314 13.4993 9.37657C13.4443 6.22176 11.7371 4.58996 11.7371 4.58996C11.7371 4.58996 11.1864 6.27615 9.20392 7.20084C9.20392 7.20084 9.75461 5.841 9.20392 3.88285C8.7083 1.92469 6.34032 1 6.34032 1Z" fill="currentColor"></path>
            </svg>
        `;
        
        switch (this.carouselType) {
            case 'classic':
                return `
                    <a href="#" class="recommendation-card" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.title}" class="card-image" 
                             onerror="this.style.background='var(--sports-grey-50)'; this.style.color='var(--sports-grey-400)'; this.innerHTML='Изображение недоступно';">
                        <div class="card-content">
                            <h3 class="card-title">${item.title}</h3>
                            <div class="card-meta">
                                <span class="card-rating">${item.rating}</span>
                                ${item.hasFlame ? `<span class="card-flame">${flameIcon} ${item.flameCount}</span>` : ''}
                            </div>
                        </div>
                    </a>
                `;
                
            case 'compact':
                return `
                    <a href="#" class="recommendation-card" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.title}" class="card-image"
                             onerror="this.style.background='var(--sports-grey-50)'; this.style.color='var(--sports-grey-400)'; this.innerHTML='Изображение недоступно';">
                        <div class="card-content">
                            <h3 class="card-title">${item.title}</h3>
                            <div class="card-meta">
                                <span class="card-rating">${item.rating}</span>
                                ${item.hasFlame ? `<span class="card-flame">${flameIcon} ${item.flameCount}</span>` : ''}
                            </div>
                        </div>
                    </a>
                `;
                
            case 'minimal':
                return `
                    <a href="#" class="recommendation-card" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.title}" class="card-image"
                             onerror="this.style.background='var(--sports-grey-50)'; this.style.color='var(--sports-grey-400)'; this.innerHTML='Изображение недоступно';">
                        <div class="card-content">
                            <div class="card-category">${item.category}</div>
                            <h3 class="card-title">${item.title}</h3>
                            <div class="card-meta">
                                <span class="card-rating">${item.rating}</span>
                                ${item.hasFlame ? `<span class="card-flame">${flameIcon} ${item.flameCount}</span>` : ''}
                            </div>
                        </div>
                    </a>
                `;
        }
    }
    
    renderPagination() {
        if (!this.pagination) return;
        
        this.pagination.innerHTML = Array.from({ length: this.totalPages }, (_, i) => 
            `<div class="pagination-dot ${i === 0 ? 'active' : ''}" data-page="${i}"></div>`
        ).join('');
    }
    
    bindEvents() {
        // Arrows
        if (this.leftArrow) {
            this.leftArrow.addEventListener('click', () => this.prevPage());
        }
        
        if (this.rightArrow) {
            this.rightArrow.addEventListener('click', () => this.nextPage());
        }
        
        // Pagination dots
        if (this.pagination) {
            this.pagination.addEventListener('click', (e) => {
                if (e.target.classList.contains('pagination-dot')) {
                    const page = parseInt(e.target.dataset.page);
                    this.goToPage(page);
                }
            });
        }
        
        // Touch/swipe support
        let startX = 0;
        let endX = 0;
        
        this.wrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.wrapper.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // минимальный свайп
                if (diff > 0) {
                    this.nextPage();
                } else {
                    this.prevPage();
                }
            }
        });
        
        // Card clicks
        this.wrapper.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.recommendation-card');
            if (card) {
                const id = card.dataset.id;
                this.handleCardClick(id);
            }
        });
        
        // Resize handling
        window.addEventListener('resize', () => {
            const newItemsPerPage = this.getItemsPerPage();
            if (newItemsPerPage !== this.itemsPerPage) {
                this.itemsPerPage = newItemsPerPage;
                this.totalPages = Math.ceil(recommendationsData.length / this.itemsPerPage);
                this.currentPage = Math.min(this.currentPage, this.totalPages - 1);
                this.renderPagination();
                this.updateCarousel();
            }
        });
    }
    
    prevPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updateCarousel();
        }
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.updateCarousel();
        }
    }
    
    goToPage(page) {
        if (page >= 0 && page < this.totalPages) {
            this.currentPage = page;
            this.updateCarousel();
        }
    }
    
    updateCarousel() {
        // Update transform
        const cardWidth = this.wrapper.children[0]?.offsetWidth || 0;
        const gap = parseInt(getComputedStyle(this.wrapper).gap) || 16;
        const offset = this.currentPage * this.itemsPerPage * (cardWidth + gap);
        
        this.wrapper.style.transform = `translateX(-${offset}px)`;
        
        // Update pagination
        if (this.pagination) {
            const dots = this.pagination.querySelectorAll('.pagination-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentPage);
            });
        }
        
        // Update arrows visibility
        if (this.leftArrow) {
            this.leftArrow.style.opacity = this.currentPage === 0 ? '0.5' : '1';
            this.leftArrow.style.pointerEvents = this.currentPage === 0 ? 'none' : 'auto';
        }
        
        if (this.rightArrow) {
            this.rightArrow.style.opacity = this.currentPage === this.totalPages - 1 ? '0.5' : '1';
            this.rightArrow.style.pointerEvents = this.currentPage === this.totalPages - 1 ? 'none' : 'auto';
        }
    }
    
    handleCardClick(id) {
        const item = recommendationsData.find(item => item.id === id);
        if (item) {
            // Имитация клика по статье
            console.log(`Переход к статье: ${item.title}`);
            
            // Анимация клика
            const card = this.wrapper.querySelector(`[data-id="${id}"]`);
            if (card) {
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            }
            
            // Показать уведомление
            this.showNotification(`Открыта статья: ${item.title}`);
        }
    }
    
    showNotification(message) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--sports-primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 199, 139, 0.3);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Удаление через 3 секунды
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Создаем экземпляры каруселей для каждого варианта дизайна
    const classicCarousel = new CarouselManager('classic');
    const compactCarousel = new CarouselManager('compact');
    const minimalCarousel = new CarouselManager('minimal');
    
    // Добавляем плавное появление секций
    const sections = document.querySelectorAll('.design-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    console.log('Карусели рекомендаций инициализированы');
}); 