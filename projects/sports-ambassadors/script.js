class AmbassadorsSlider {
    constructor() {
        this.currentSlide = 0;
        this.itemsPerSlide = this.getItemsPerSlide();
        this.totalSlides = Math.ceil(ambassadors.length / this.itemsPerSlide);
        this.isGridView = false;
        
        this.init();
        this.setupEventListeners();
        this.handleResize();
    }

    init() {
        this.renderSlider();
        this.renderGrid();
        this.renderDots();
        this.updateSlider();
    }

    getItemsPerSlide() {
        const width = window.innerWidth;
        if (width <= 360) return 3;
        if (width <= 480) return 4;
        if (width <= 660) return 4;
        return 4;
    }

    createAmbassadorCard(ambassador) {
        const fullName = ambassador.surname 
            ? `${ambassador.name} ${ambassador.surname}` 
            : ambassador.name;
        
        const cardElement = ambassador.link 
            ? document.createElement('a')
            : document.createElement('div');
        
        cardElement.className = `ambassador-card ${!ambassador.link ? 'non-clickable' : ''}`;
        
        if (ambassador.link) {
            cardElement.href = ambassador.link;
            cardElement.target = '_blank';
        }

        cardElement.innerHTML = `
            <img src="${ambassador.image}" alt="${fullName}" class="ambassador-avatar">
            <div class="ambassador-info">
                <div class="ambassador-name">${this.formatName(ambassador.name, ambassador.surname)}</div>
                <div class="ambassador-profession">${ambassador.profession}</div>
                <div class="ambassador-sport">${ambassador.sport}</div>
            </div>
        `;

        return cardElement;
    }

    formatName(name, surname) {
        if (!surname) return name;
        
        // Если имя и фамилия вместе длиннее 12 символов, разбиваем на две строки
        const fullName = `${name} ${surname}`;
        if (fullName.length > 12) {
            return `<span>${name}</span><br><span>${surname}</span>`;
        }
        return fullName;
    }

    renderSlider() {
        const sliderTrack = document.getElementById('sliderTrack');
        sliderTrack.innerHTML = '';

        ambassadors.forEach(ambassador => {
            const card = this.createAmbassadorCard(ambassador);
            sliderTrack.appendChild(card);
        });
    }

    renderGrid() {
        const grid = document.getElementById('ambassadorsGrid');
        grid.innerHTML = '';

        ambassadors.forEach(ambassador => {
            const card = this.createAmbassadorCard(ambassador);
            grid.appendChild(card);
        });
    }

    renderDots() {
        const dotsContainer = document.getElementById('sliderDots');
        dotsContainer.innerHTML = '';

        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `dot ${i === this.currentSlide ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    updateSlider() {
        const sliderTrack = document.getElementById('sliderTrack');
        const cardWidth = 140 + 16; // width + gap
        const offset = -this.currentSlide * this.itemsPerSlide * cardWidth;
        
        sliderTrack.style.transform = `translateX(${offset}px)`;
        
        this.updateDots();
        this.updateButtons();
    }

    updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    updateButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.disabled = this.currentSlide === 0;
        nextBtn.disabled = this.currentSlide >= this.totalSlides - 1;
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateSlider();
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlider();
        }
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }

    toggleView(isGrid) {
        this.isGridView = isGrid;
        const slider = document.querySelector('.ambassadors-slider');
        const grid = document.getElementById('ambassadorsGrid');
        const sliderToggle = document.getElementById('sliderToggle');
        const gridToggle = document.getElementById('gridToggle');

        if (isGrid) {
            slider.classList.add('hidden');
            grid.classList.add('active');
            sliderToggle.classList.remove('active');
            gridToggle.classList.add('active');
        } else {
            slider.classList.remove('hidden');
            grid.classList.remove('active');
            sliderToggle.classList.add('active');
            gridToggle.classList.remove('active');
        }
    }

    handleResize() {
        window.addEventListener('resize', () => {
            const newItemsPerSlide = this.getItemsPerSlide();
            if (newItemsPerSlide !== this.itemsPerSlide) {
                this.itemsPerSlide = newItemsPerSlide;
                this.totalSlides = Math.ceil(ambassadors.length / this.itemsPerSlide);
                this.currentSlide = Math.min(this.currentSlide, this.totalSlides - 1);
                this.renderDots();
                this.updateSlider();
            }
        });
    }

    setupEventListeners() {
        // Slider controls
        document.getElementById('prevBtn').addEventListener('click', () => this.prevSlide());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSlide());

        // View toggle
        document.getElementById('sliderToggle').addEventListener('click', () => this.toggleView(false));
        document.getElementById('gridToggle').addEventListener('click', () => this.toggleView(true));

        // Touch support for mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        const sliderContainer = document.getElementById('sliderContainer');

        sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        sliderContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        sliderContainer.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;

            const diff = startX - currentX;
            const threshold = 50;

            if (diff > threshold) {
                this.nextSlide();
            } else if (diff < -threshold) {
                this.prevSlide();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isGridView) {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            }
        });

        // Auto-play functionality (optional)
        let autoPlayInterval;
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => {
                if (!this.isGridView) {
                    if (this.currentSlide >= this.totalSlides - 1) {
                        this.goToSlide(0);
                    } else {
                        this.nextSlide();
                    }
                }
            }, 5000);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        // Pause auto-play on hover
        const slider = document.querySelector('.ambassadors-slider');
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);

        // Start auto-play initially
        startAutoPlay();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const slider = new AmbassadorsSlider();
    
    // Add some additional animations on page load
    setTimeout(() => {
        document.querySelector('.ambassadors-header').style.animation = 'fadeInUp 0.6s ease forwards';
        document.querySelector('.ambassadors-slider').style.animation = 'fadeInUp 0.6s ease 0.2s forwards';
        document.querySelector('.view-toggle').style.animation = 'fadeInUp 0.6s ease 0.4s forwards';
    }, 100);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .ambassadors-header,
    .ambassadors-slider,
    .view-toggle {
        opacity: 0;
    }
`;
document.head.appendChild(style); 