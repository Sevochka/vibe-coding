// DOM Elements
const faqItems = document.querySelectorAll('.faq-item');
const ctaButtons = document.querySelectorAll('.hero-cta, .nav-cta, .support-btn');

// FAQ Accordion functionality
function initFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// CTA Button click handlers
function initCTAButtons() {
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // Show modal or redirect (placeholder)
            showCTAModal();
        });
    });
}

// Modal functionality (placeholder)
function showCTAModal() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Записаться на курс AI Sprint X2</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>Заполните форму ниже, и мы свяжемся с вами в ближайшее время</p>
                <form class="registration-form">
                    <input type="text" placeholder="Ваше имя" required>
                    <input type="email" placeholder="Email" required>
                    <input type="tel" placeholder="Телефон" required>
                    <textarea placeholder="Расскажите о ваших задачах" rows="3"></textarea>
                    <button type="submit" class="submit-btn">Отправить заявку</button>
                </form>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: #111;
            border: 1px solid rgba(124, 58, 237, 0.3);
            border-radius: 20px;
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 25px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .modal-header h3 {
            color: #7c3aed;
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: #9ca3af;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }
        
        .modal-body {
            padding: 25px;
        }
        
        .modal-body p {
            color: #d1d5db;
            margin-bottom: 25px;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .registration-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .registration-form input,
        .registration-form textarea {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 15px;
            color: #fff;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.3s ease;
        }
        
        .registration-form input:focus,
        .registration-form textarea:focus {
            outline: none;
            border-color: #7c3aed;
            background: rgba(124, 58, 237, 0.1);
        }
        
        .registration-form input::placeholder,
        .registration-form textarea::placeholder {
            color: #9ca3af;
        }
        
        .submit-btn {
            background: linear-gradient(135deg, #7c3aed, #a855f7);
            color: #fff;
            border: none;
            padding: 15px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    
    // Add styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    const form = modal.querySelector('.registration-form');
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success message
        modal.querySelector('.modal-body').innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #7c3aed, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <span style="color: white; font-size: 24px;">✓</span>
                </div>
                <h3 style="color: #7c3aed; margin-bottom: 15px;">Заявка отправлена!</h3>
                <p style="color: #d1d5db; margin-bottom: 25px;">Мы свяжемся с вами в ближайшее время</p>
                <button onclick="closeModal()" class="submit-btn" style="max-width: 200px;">Закрыть</button>
            </div>
        `;
        
        // Auto close after 3 seconds
        setTimeout(closeModal, 3000);
    });
    
    function closeModal() {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.head.removeChild(styleSheet);
        }, 300);
    }
    
    // Make closeModal globally accessible
    window.closeModal = closeModal;
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .audience-card,
        .task-item,
        .learning-category,
        .format-card,
        .module-card,
        .team-member,
        .review-card,
        .faq-item
    `);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Header scroll effect
function initHeaderEffect() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        // Hide header on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Parallax effect for hero background
function initParallax() {
    const heroBackground = document.querySelector('.hero-bg-image');
    
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Floating elements animation
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.task-icon, .format-icon, .category-icon');
    
    floatingElements.forEach((element, index) => {
        // Add random floating animation
        element.style.animationDelay = `${index * 0.2}s`;
        element.classList.add('floating');
    });
    
    // Add floating animation CSS
    const floatingCSS = `
        .floating {
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = floatingCSS;
    document.head.appendChild(styleSheet);
}

// Interactive hover effects
function initHoverEffects() {
    const cards = document.querySelectorAll(`
        .audience-card,
        .task-item,
        .format-card,
        .module-card,
        .team-member,
        .review-card
    `);
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.classList.add('glow');
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.classList.remove('glow');
        });
    });
}

// Progress indicator
function initProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    
    const progressCSS = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(255, 255, 255, 0.1);
            z-index: 10001;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #7c3aed, #a855f7);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = progressCSS;
    document.head.appendChild(styleSheet);
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.progress-fill');
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressFill.style.width = `${Math.min(scrollPercent, 100)}%`;
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initSmoothScroll();
    initCTAButtons();
    initScrollAnimations();
    initHeaderEffect();
    initParallax();
    initFloatingElements();
    initHoverEffects();
    initProgressIndicator();
    
    console.log('AI Sprint X2 website initialized successfully!');
});

// Add some additional utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimized scroll handler
const optimizedScroll = debounce(() => {
    // Additional scroll optimizations can be added here
}, 16);

window.addEventListener('scroll', optimizedScroll);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            window.closeModal();
        }
    }
});

// Add touch support for mobile
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Add touch-specific styles
    const touchCSS = `
        .touch-device .audience-card:hover,
        .touch-device .task-item:hover,
        .touch-device .format-card:hover,
        .touch-device .module-card:hover,
        .touch-device .team-member:hover,
        .touch-device .review-card:hover {
            transform: none;
        }
        
        .touch-device .audience-card:active,
        .touch-device .task-item:active,
        .touch-device .format-card:active,
        .touch-device .module-card:active,
        .touch-device .team-member:active,
        .touch-device .review-card:active {
            transform: scale(0.98);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = touchCSS;
    document.head.appendChild(styleSheet);
}
