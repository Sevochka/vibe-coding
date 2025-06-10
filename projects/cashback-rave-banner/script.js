// Создание летающих денег
function createFlyingMoney() {
    const moneyContainer = document.querySelector('.flying-money');
    const moneySymbols = ['₽', '$', '€', '💰', '💸', '💎'];
    
    function createMoney() {
        const money = document.createElement('div');
        money.style.position = 'absolute';
        money.style.fontSize = Math.random() * 15 + 10 + 'px';
        money.style.color = getRandomNeonColor();
        money.style.fontWeight = 'bold';
        money.style.pointerEvents = 'none';
        money.style.textShadow = `0 0 10px ${money.style.color}`;
        money.style.zIndex = '5';
        money.textContent = moneySymbols[Math.floor(Math.random() * moneySymbols.length)];
        
        // Случайная позиция по X
        money.style.left = Math.random() * 100 + '%';
        money.style.top = '-20px';
        
        moneyContainer.appendChild(money);
        
        // Анимация падения
        let position = -20;
        let rotation = 0;
        const speed = Math.random() * 2 + 1;
        const rotationSpeed = Math.random() * 10 + 5;
        
        function animateMoney() {
            position += speed;
            rotation += rotationSpeed;
            money.style.top = position + 'px';
            money.style.transform = `rotate(${rotation}deg)`;
            
            if (position < 620) {
                requestAnimationFrame(animateMoney);
            } else {
                money.remove();
            }
        }
        
        animateMoney();
    }
    
    // Создаем деньги каждые 500-1500ms
    function spawnMoney() {
        createMoney();
        setTimeout(spawnMoney, Math.random() * 1000 + 500);
    }
    
    spawnMoney();
}

// Получение случайного неонового цвета
function getRandomNeonColor() {
    const colors = ['#39ff14', '#ff1493', '#8a2be2', '#00bfff', '#ffff00'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Добавление случайных глитчей
function addRandomGlitches() {
    const banner = document.querySelector('.banner-container');
    
    function glitchEffect() {
        banner.style.filter = 'hue-rotate(' + Math.random() * 360 + 'deg) saturate(1.5)';
        
        setTimeout(() => {
            banner.style.filter = 'none';
        }, 100);
        
        // Следующий глитч через 5-15 секунд
        setTimeout(glitchEffect, Math.random() * 10000 + 5000);
    }
    
    // Начинаем глитчи через 3 секунды
    setTimeout(glitchEffect, 3000);
}

// Добавление звуковых эффектов (визуальная имитация)
function addSoundVisualization() {
    const waves = document.querySelectorAll('.wave');
    
    function pulsateWaves() {
        waves.forEach((wave, index) => {
            const intensity = Math.random() * 0.5 + 0.5;
            wave.style.opacity = intensity;
            wave.style.transform = `scaleY(${intensity * 2})`;
        });
        
        requestAnimationFrame(pulsateWaves);
    }
    
    pulsateWaves();
}

// Интерактивность для кнопки
function setupButtonInteraction() {
    const button = document.querySelector('.rave-button');
    
    button.addEventListener('click', function() {
        // Эффект взрыва пикселей
        createPixelExplosion(button);
        
        // Можно добавить переход на страницу букмекера
        console.log('Переход к букмекеру для получения кэшбэка!');
    });
    
    button.addEventListener('mouseenter', function() {
        // Увеличиваем интенсивность свечения при наведении
        this.style.boxShadow = '0 0 50px var(--neon-green), 0 0 100px var(--neon-pink)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
}

// Создание эффекта взрыва пикселей
function createPixelExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
        const pixel = document.createElement('div');
        pixel.style.position = 'fixed';
        pixel.style.width = '4px';
        pixel.style.height = '4px';
        pixel.style.backgroundColor = getRandomNeonColor();
        pixel.style.left = centerX + 'px';
        pixel.style.top = centerY + 'px';
        pixel.style.pointerEvents = 'none';
        pixel.style.zIndex = '1000';
        pixel.style.boxShadow = `0 0 10px ${pixel.style.backgroundColor}`;
        
        document.body.appendChild(pixel);
        
        const angle = (Math.PI * 2 * i) / 20;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = 0;
        let y = 0;
        let opacity = 1;
        
        function animatePixel() {
            x += vx * 0.02;
            y += vy * 0.02 + 2; // gravity
            opacity -= 0.02;
            
            pixel.style.transform = `translate(${x}px, ${y}px)`;
            pixel.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animatePixel);
            } else {
                pixel.remove();
            }
        }
        
        animatePixel();
    }
}

// Эффект мерцания диско-шара
function setupDiscoEffects() {
    const discoball = document.querySelector('.disco-ball');
    
    setInterval(() => {
        const intensity = Math.random() * 0.5 + 0.5;
        discoball.style.boxShadow = `
            0 0 ${30 * intensity}px var(--neon-pink),
            0 0 ${60 * intensity}px var(--neon-purple),
            0 0 ${90 * intensity}px var(--neon-green)
        `;
    }, 200);
}

// Адаптивные эффекты при изменении размера
function setupResponsiveEffects() {
    function adjustEffects() {
        const banner = document.querySelector('.banner-container');
        const width = banner.offsetWidth;
        
        if (width < 300) {
            // Уменьшаем интенсивность эффектов на маленьких экранах
            banner.style.filter = 'brightness(0.8)';
        } else {
            banner.style.filter = 'none';
        }
    }
    
    window.addEventListener('resize', adjustEffects);
    adjustEffects();
}

// Инициализация всех эффектов
document.addEventListener('DOMContentLoaded', function() {
    createFlyingMoney();
    addRandomGlitches();
    addSoundVisualization();
    setupButtonInteraction();
    setupDiscoEffects();
    setupResponsiveEffects();
    
    console.log('🎉 Букмекерский кэшбэк-рейв запущен! 🎉');
}); 