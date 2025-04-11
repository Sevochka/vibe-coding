// Класс для создания и управления частицами
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles-container');
        this.blockBreakEffect = document.getElementById('block-break-effect');
        this.active = true;
        
        // Звуки (эмуляция через консоль, в настоящей реализации использовались бы аудиофайлы)
        this.sounds = {
            'dig.grass': 'grass_sound.mp3',
            'dig.stone': 'stone_sound.mp3',
            'dig.wood': 'wood_sound.mp3',
            'random.orb': 'orb_sound.mp3',
            'random.click': 'click_sound.mp3',
            'skeleton.hurt': 'skeleton_sound.mp3',
            'fire.fire': 'fire_sound.mp3'
        };
    }
    
    // Создает случайные частицы, падающие сверху экрана (для фона)
    createRandomParticles() {
        if (!this.active) return;
        
        const particleCount = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'minecraft-particle';
            
            // Случайный тип блока
            const blockTypes = Object.keys(blockEffects);
            const randomType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
            const effect = blockEffects[randomType];
            
            // Случайная позиция
            const x = Math.random() * window.innerWidth;
            const y = -20; // Начинаем немного выше экрана
            
            // Устанавливаем стили
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.backgroundColor = effect.particles[Math.floor(Math.random() * effect.particles.length)];
            
            // Добавляем частицу в контейнер
            this.container.appendChild(particle);
            
            // Удаляем частицу после анимации
            setTimeout(() => {
                if (particle.parentNode === this.container) {
                    this.container.removeChild(particle);
                }
            }, 5000);
        }
        
        // Повторяем создание частиц
        setTimeout(() => this.createRandomParticles(), 1000);
    }
    
    // Создает эффект разбивания блока при нажатии на ответ
    createBlockBreakEffect(x, y, blockType) {
        const effectDiv = this.blockBreakEffect;
        effectDiv.className = 'breaking';
        effectDiv.style.left = `${x}px`;
        effectDiv.style.top = `${y}px`;
        effectDiv.style.backgroundColor = blockEffects[blockType].color;
        
        // Эмуляция звука
        console.log(`Playing sound: ${blockEffects[blockType].soundEffect}`);
        
        // Создаем пиксели разрушения
        this.createBlockPixels(x, y, blockType);
        
        // Удаляем эффект после анимации
        setTimeout(() => {
            effectDiv.className = 'hidden';
        }, 500);
    }
    
    // Создает пиксели, разлетающиеся при разрушении блока
    createBlockPixels(x, y, blockType) {
        const pixelCount = 15;
        const colors = blockEffects[blockType].particles;
        
        for (let i = 0; i < pixelCount; i++) {
            const pixel = document.createElement('div');
            pixel.className = 'block-pixel';
            
            // Случайное смещение и поворот
            const tx = (Math.random() - 0.5) * 100;
            const ty = (Math.random() - 0.5) * 100;
            const rot = Math.random() * 360;
            
            // Устанавливаем стили
            pixel.style.left = `${x}px`;
            pixel.style.top = `${y}px`;
            pixel.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            pixel.style.setProperty('--tx', `${tx}px`);
            pixel.style.setProperty('--ty', `${ty}px`);
            pixel.style.setProperty('--rot', `${rot}deg`);
            
            // Добавляем пиксель в контейнер
            this.container.appendChild(pixel);
            
            // Удаляем пиксель после анимации
            setTimeout(() => {
                if (pixel.parentNode === this.container) {
                    this.container.removeChild(pixel);
                }
            }, 1000);
        }
    }
    
    // Создает частицы для приветственного экрана
    createWelcomeParticles() {
        const particleCount = 30;
        const container = document.getElementById('welcome-screen');
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                if (!this.active || !container.classList.contains('active')) return;
                
                const particle = document.createElement('div');
                particle.className = 'minecraft-particle';
                
                // Случайный тип блока для разнообразия
                const blockTypes = ['grass', 'wood', 'diamond'];
                const randomType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
                const effect = blockEffects[randomType];
                
                // Случайная позиция внутри контейнера
                const rect = container.getBoundingClientRect();
                const x = Math.random() * rect.width;
                const y = Math.random() * rect.height;
                
                // Устанавливаем стили
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.backgroundColor = effect.particles[Math.floor(Math.random() * effect.particles.length)];
                
                // Добавляем частицу в контейнер
                container.appendChild(particle);
                
                // Удаляем частицу после анимации
                setTimeout(() => {
                    if (particle.parentNode === container) {
                        container.removeChild(particle);
                    }
                }, 5000);
            }, i * 200);
        }
    }
    
    // Создает эффект победы с множеством частиц
    createVictoryEffect() {
        const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'minecraft-particle';
                
                // Для победы используем блок-алмаз
                const effect = blockEffects['diamond'];
                
                // Случайная позиция на экране
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                
                // Устанавливаем стили
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.backgroundColor = effect.particles[Math.floor(Math.random() * effect.particles.length)];
                
                // Добавляем частицу в контейнер
                this.container.appendChild(particle);
                
                // Удаляем частицу после анимации
                setTimeout(() => {
                    if (particle.parentNode === this.container) {
                        this.container.removeChild(particle);
                    }
                }, 5000);
            }, i * 50);
        }
    }
    
    // Останавливает все анимации частиц
    stop() {
        this.active = false;
    }
    
    // Запускает систему частиц
    start() {
        this.active = true;
        this.createRandomParticles();
        this.createWelcomeParticles();
    }
}

// Инициализация системы частиц при загрузке страницы
let particleSystem = null;

document.addEventListener('DOMContentLoaded', () => {
    particleSystem = new ParticleSystem();
    particleSystem.start();
}); 