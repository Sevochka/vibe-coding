// Плавная прокрутка к форме регистрации
function scrollToRegistration() {
    const registration = document.getElementById('registration');
    registration.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Обработка формы регистрации
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.reg-form');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Анимация кнопки
            submitBtn.style.background = 'var(--sports-green-850)';
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            // Имитация отправки формы
            setTimeout(() => {
                showSuccessMessage();
                form.reset();
                submitBtn.style.background = 'var(--sports-primary-color)';
                submitBtn.textContent = 'Подать заявку';
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Анимация появления элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдение за карточками
    const cards = document.querySelectorAll('.info-card, .gallery-item, .partner-logo');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Счетчик для статистики
    animateCounters();
    
    // Параллакс эффект для hero секции
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const parallaxSpeed = 0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
});

// Показ сообщения об успешной отправке
function showSuccessMessage() {
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--sports-primary-color);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        ">
            <strong>Заявка отправлена!</strong><br>
            Мы свяжемся с вами в ближайшее время.
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 4000);
}

// Анимация счетчиков (если есть статистика)
function animateCounters() {
    const stats = [
        { element: '.stat-participants', target: 250, suffix: '+' },
        { element: '.stat-prizes', target: 100000, suffix: '₽' },
        { element: '.stat-courts', target: 8, suffix: '' }
    ];
    
    stats.forEach(stat => {
        const element = document.querySelector(stat.element);
        if (element) {
            animateNumber(element, 0, stat.target, 2000, stat.suffix);
        }
    });
}

// Анимация числа
function animateNumber(element, start, end, duration, suffix = '') {
    const startTime = Date.now();
    
    function update() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * easeOutQuart(progress));
        element.textContent = current.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Easing функция
function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// Добавление интерактивности к галерее
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Можно добавить модальное окно для просмотра изображений
            const img = item.querySelector('.gallery-img');
            const overlay = item.querySelector('.gallery-overlay p').textContent;
            
            console.log('Открыть изображение:', img.src, 'Описание:', overlay);
        });
    });
});

// Валидация формы в реальном времени
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearErrors(this);
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        showFieldError(field, 'Это поле обязательно для заполнения');
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        showFieldError(field, 'Введите корректный email');
    } else if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        showFieldError(field, 'Введите корректный номер телефона');
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearErrors(field);
    
    field.style.borderColor = 'var(--sports-red-a700)';
    
    const error = document.createElement('div');
    error.className = 'field-error';
    error.style.cssText = `
        color: var(--sports-red-a700);
        font-size: 12px;
        margin-top: 5px;
    `;
    error.textContent = message;
    
    field.parentNode.appendChild(error);
}

function clearErrors(field) {
    field.style.borderColor = 'var(--sports-grey-100)';
    const error = field.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
} 