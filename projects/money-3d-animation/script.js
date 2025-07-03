// Денежная 3D анимация
class Money3DAnimation {
    constructor() {
        this.scene = document.querySelector('.scene');
        this.football = document.querySelector('.football');
        this.letters = document.querySelectorAll('.letter');
        this.moneyBills = document.querySelectorAll('.money-bill');
        this.ctaBtn = document.querySelector('.cta-btn');
        this.goldParticles = document.querySelector('.gold-particles');
        
        this.clickCount = 0;
        this.isMoneyRaining = false;
        
        this.init();
    }
    
    init() {
        this.setupInteractivity();
        this.setupMoneyEffects();
        this.setupMouseTracking();
        this.setupButtonEffects();
        this.addRandomAnimations();
        this.createDynamicMoney();
        this.playBackgroundSound();
    }
    
    // Интерактивность букв
    setupInteractivity() {
        this.letters.forEach((letter, index) => {
            letter.addEventListener('mouseenter', () => {
                this.animateLetter(letter, index);
                this.createMoneyExplosion(letter);
            });
            
            letter.addEventListener('click', () => {
                this.explodeLetter(letter);
                this.createGoldRain();
            });
        });
    }
    
    // Анимация отдельной буквы с золотым эффектом
    animateLetter(letter, index) {
        const moneyColors = ['#FFD700', '#FFA500', '#FFFF00', '#32CD32', '#00FF00'];
        const randomColor = moneyColors[Math.floor(Math.random() * moneyColors.length)];
        
        letter.style.color = randomColor;
        letter.style.textShadow = `
            0 0 20px ${randomColor}, 
            0 0 40px ${randomColor}, 
            0 0 60px ${randomColor}
        `;
        letter.style.transform = `
            scale(1.4) 
            rotateY(${Math.random() * 360}deg) 
            rotateX(${Math.random() * 360}deg) 
            translateZ(${Math.random() * 50}px)
        `;
        
        // Звук монеты
        this.playMoneySound();
        
        setTimeout(() => {
            letter.style.color = '';
            letter.style.textShadow = '';
            letter.style.transform = '';
        }, 1200);
    }
    
    // Взрыв буквы с золотыми монетами
    explodeLetter(letter) {
        const rect = letter.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Создаем взрыв золотых монет
        for (let i = 0; i < 20; i++) {
            this.createGoldCoin(centerX, centerY);
        }
        
        // Создаем денежные эмодзи
        for (let i = 0; i < 8; i++) {
            this.createMoneyEmoji(centerX, centerY);
        }
        
        // Эффект исчезновения буквы
        letter.style.opacity = '0';
        letter.style.transform = 'scale(3) rotateY(1080deg) rotateX(720deg)';
        
        // Звук взрыва денег
        this.playExplosionSound();
        
        setTimeout(() => {
            letter.style.opacity = '';
            letter.style.transform = '';
        }, 2000);
    }
    
    // Создание золотой монеты
    createGoldCoin(x, y) {
        const coin = document.createElement('div');
        coin.textContent = '🪙';
        coin.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: ${Math.random() * 20 + 15}px;
            pointer-events: none;
            z-index: 1000;
            filter: drop-shadow(0 0 10px #FFD700);
        `;
        
        document.body.appendChild(coin);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150 + 100;
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;
        
        coin.animate([
            {
                transform: 'translate(0, 0) scale(1) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translate(${endX - x}px, ${endY - y}px) scale(0) rotate(720deg)`,
                opacity: 0
            }
        ], {
            duration: 1500,
            easing: 'ease-out'
        }).onfinish = () => {
            coin.remove();
        };
    }
    
    // Создание денежного эмодзи
    createMoneyEmoji(x, y) {
        const emojis = ['💰', '💸', '💵', '💴', '💶', '💷'];
        const emoji = document.createElement('div');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: ${Math.random() * 15 + 20}px;
            pointer-events: none;
            z-index: 999;
            filter: drop-shadow(0 0 8px #32CD32);
        `;
        
        document.body.appendChild(emoji);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 120 + 80;
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;
        
        emoji.animate([
            {
                transform: 'translate(0, 0) scale(1) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translate(${endX - x}px, ${endY - y}px) scale(0) rotate(360deg)`,
                opacity: 0
            }
        ], {
            duration: 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            emoji.remove();
        };
    }
    
    // Создание денежного взрыва возле буквы
    createMoneyExplosion(letter) {
        const rect = letter.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createGoldCoin(centerX, centerY);
            }, i * 100);
        }
    }
    
    // Эффекты для денежных банкнот
    setupMoneyEffects() {
        this.moneyBills.forEach(bill => {
            bill.addEventListener('click', () => {
                this.explodeMoney(bill);
            });
            
            bill.addEventListener('mouseenter', () => {
                bill.style.transform = 'scale(1.5) rotate(10deg)';
                bill.style.filter = 'drop-shadow(0 0 20px #FFD700)';
                this.playMoneySound();
            });
            
            bill.addEventListener('mouseleave', () => {
                bill.style.transform = '';
                bill.style.filter = '';
            });
        });
    }
    
    // Взрыв денежной банкноты
    explodeMoney(bill) {
        const rect = bill.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 15; i++) {
            this.createGoldCoin(centerX, centerY);
            this.createMoneyEmoji(centerX, centerY);
        }
        
        this.playExplosionSound();
    }
    
    // Отслеживание мыши для параллакс эффекта
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
            
            // Параллакс для сцены
            this.scene.style.transform = `
                rotateY(${mouseX * 8}deg) 
                rotateX(${-mouseY * 8}deg)
            `;
            
            // Параллакс для футбольного мяча
            if (this.football) {
                this.football.style.transform = `
                    translateX(${mouseX * 15}px) 
                    translateY(${mouseY * 15}px)
                `;
            }
            
            // Параллакс для денег
            this.moneyBills.forEach(bill => {
                bill.style.transform += ` translateX(${mouseX * 5}px) translateY(${mouseY * 5}px)`;
            });
        });
    }
    
    // Эффекты для кнопки
    setupButtonEffects() {
        if (this.ctaBtn) {
            this.ctaBtn.addEventListener('click', () => {
                this.triggerMoneyExplosion();
                this.clickCount++;
                
                if (this.clickCount >= 3) {
                    this.startMoneyStorm();
                    this.clickCount = 0;
                }
            });
            
            this.ctaBtn.addEventListener('mouseenter', () => {
                this.createButtonGoldRing();
            });
        }
    }
    
    // Денежный взрыв при клике на кнопку
    triggerMoneyExplosion() {
        const rect = this.ctaBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                this.createGoldCoin(centerX, centerY);
                this.createMoneyEmoji(centerX, centerY);
            }, i * 50);
        }
        
        // Эффект тряски с золотым сиянием
        this.ctaBtn.style.animation = 'none';
        this.ctaBtn.offsetHeight;
        this.ctaBtn.style.animation = 'buttonShakeMoney 0.8s ease-in-out';
        this.ctaBtn.style.boxShadow = '0 0 50px #FFD700, 0 0 100px #FFD700';
        
        this.playExplosionSound();
        
        setTimeout(() => {
            this.ctaBtn.style.animation = 'buttonMoney 3s ease-in-out infinite';
            this.ctaBtn.style.boxShadow = '';
        }, 800);
    }
    
    // Золотое кольцо вокруг кнопки
    createButtonGoldRing() {
        const rect = this.ctaBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const radius = 80;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.createGoldCoin(x, y);
        }
    }
    
    // Денежная буря
    startMoneyStorm() {
        if (this.isMoneyRaining) return;
        
        this.isMoneyRaining = true;
        
        const stormInterval = setInterval(() => {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    this.createRandomMoney();
                }, i * 200);
            }
        }, 500);
        
        setTimeout(() => {
            clearInterval(stormInterval);
            this.isMoneyRaining = false;
        }, 5000);
    }
    
    // Создание случайных денег
    createRandomMoney() {
        const x = Math.random() * window.innerWidth;
        const y = -50;
        
        this.createGoldCoin(x, y);
        this.createMoneyEmoji(x, y);
    }
    
    // Динамическое создание денег
    createDynamicMoney() {
        setInterval(() => {
            this.addRandomMoneyEffect();
        }, 3000);
    }
    
    // Добавление случайного денежного эффекта
    addRandomMoneyEffect() {
        const effects = [
            () => this.createGoldRain(),
            () => this.createMoneyWhirlwind(),
            () => this.createSparkleEffect()
        ];
        
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        randomEffect();
    }
    
    // Золотой дождь
    createGoldRain() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                this.createGoldCoin(x, -50);
            }, i * 300);
        }
    }
    
    // Денежный вихрь
    createMoneyWhirlwind() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const radius = 150;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            setTimeout(() => {
                this.createMoneyEmoji(x, y);
            }, i * 150);
        }
    }
    
    // Эффект искр
    createSparkleEffect() {
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: fixed;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                width: 4px;
                height: 4px;
                background: #FFD700;
                border-radius: 50%;
                pointer-events: none;
                z-index: 999;
                box-shadow: 0 0 10px #FFD700;
            `;
            
            document.body.appendChild(sparkle);
            
            sparkle.animate([
                { transform: 'scale(0)', opacity: 1 },
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(0)', opacity: 0 }
            ], {
                duration: 1000,
                delay: i * 100
            }).onfinish = () => {
                sparkle.remove();
            };
        }
    }
    
    // Звуковые эффекты
    playMoneySound() {
        // Создаем короткий звук монеты через Web Audio API
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    }
    
    playExplosionSound() {
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    }
    
    playBackgroundSound() {
        // Легкий фоновый звук (опционально)
        console.log('💰 Money sounds activated!');
    }
    
    // Случайные анимации
    addRandomAnimations() {
        setInterval(() => {
            this.randomLetterGlow();
        }, 4000);
        
        setInterval(() => {
            this.createRandomGoldEffect();
        }, 6000);
    }
    
    // Случайное свечение букв
    randomLetterGlow() {
        const randomLetter = this.letters[Math.floor(Math.random() * this.letters.length)];
        if (randomLetter) {
            randomLetter.style.animation = 'none';
            randomLetter.offsetHeight;
            randomLetter.style.animation = 'letterGoldPulse 1.5s ease-in-out, letterMoney 3s ease-in-out infinite';
        }
    }
    
    // Случайный золотой эффект
    createRandomGoldEffect() {
        const effects = [
            () => this.createSparkleEffect(),
            () => this.createGoldRain(),
            () => this.createMoneyWhirlwind()
        ];
        
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        randomEffect();
    }
}

// Дополнительные CSS анимации через JavaScript
const additionalStyles = `
    @keyframes buttonShakeMoney {
        0%, 100% { transform: translateX(0) scale(1); }
        25% { transform: translateX(-8px) scale(1.02); }
        75% { transform: translateX(8px) scale(1.02); }
    }
    
    @keyframes letterGoldPulse {
        0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px #FFD700); }
        50% { transform: scale(1.3); filter: drop-shadow(0 0 30px #FFD700); }
    }
    
    @keyframes goldShimmer {
        0% { background-position: -100% 0; }
        100% { background-position: 100% 0; }
    }
`;

// Добавляем стили
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new Money3DAnimation();
    
    // Предзагрузка изображений
    const preloadImages = [
        'https://dumpster.cdn.sports.ru/e/01/b6a5c8d6223d46030fe91d0aa70cc.png'
    ];
    
    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    console.log('💰💸💵 Money 3D Animation initialized! 💴💶💷');
}); 