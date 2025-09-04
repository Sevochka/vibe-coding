// Otello Homepage Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Search form functionality
    const searchInputs = document.querySelectorAll('.search-input');
    const searchButton = document.querySelector('.btn-search');
    
    // Add focus effects to search fields
    searchInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.background = 'var(--sports-primary-light-color-hover)';
            this.parentElement.style.borderColor = 'var(--sports-primary-color)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.background = 'var(--sports-grey-50)';
            this.parentElement.style.borderColor = 'transparent';
        });
    });
    
    // Search button click handler
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get search values
        const location = searchInputs[0].value;
        const dates = searchInputs[1].value;
        const guests = searchInputs[2].value;
        
        // Simple validation
        if (!location.trim()) {
            alert('Пожалуйста, укажите город или направление');
            searchInputs[0].focus();
            return;
        }
        
        // Simulate search
        this.textContent = 'Поиск...';
        this.disabled = true;
        
        setTimeout(() => {
            alert(`Поиск отелей в "${location}" на ${dates || 'выбранные даты'} для ${guests || '2 гостей, 1 номер'}`);
            this.textContent = 'Найти';
            this.disabled = false;
        }, 1500);
    });
    
    // Deal cards hover effects
    const dealCards = document.querySelectorAll('.deal-card');
    dealCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Favorite buttons functionality
    const favoriteButtons = document.querySelectorAll('.deal-favorite');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (this.textContent === '♡') {
                this.textContent = '♥';
                this.style.color = 'var(--sports-red-a700)';
                this.style.background = 'var(--sports-red-50)';
            } else {
                this.textContent = '♡';
                this.style.color = '';
                this.style.background = 'rgba(255, 255, 255, 0.9)';
            }
        });
    });
    
    // Smooth scroll for navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add active state visual feedback
            this.style.color = 'var(--sports-primary-color)';
            setTimeout(() => {
                this.style.color = '';
            }, 300);
        });
    });
    
    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add transition to header
    header.style.transition = 'transform 0.3s ease';
    
    // Offer cards click animation
    const offerCards = document.querySelectorAll('.offer-card');
    offerCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('btn-search')) {
                const originalText = this.textContent;
                this.textContent = '...';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 1000);
            }
        });
    });
    
    // Dynamic date placeholder
    const dateInput = searchInputs[1];
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const formatDate = (date) => {
            return date.toLocaleDateString('ru-RU', { 
                day: 'numeric', 
                month: 'short' 
            });
        };
        
        dateInput.placeholder = `${formatDate(today)} — ${formatDate(tomorrow)}`;
    }
    
    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');
        
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
    }
    
    // Add ripple CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Apply ripple effect to primary buttons
    const primaryButtons = document.querySelectorAll('.btn-primary, .btn-search');
    primaryButtons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Logo animation on hover
    const logo = document.querySelector('.logo-text');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    console.log('🏨 Otello homepage loaded successfully!');
});
