class FantasyBannerGenerator {
    constructor() {
        this.images = {};
        this.canvases = {
            '1575x600': document.getElementById('canvas1575'),
            '522x400': document.getElementById('canvas522'),
            '300x100': document.getElementById('canvas300')
        };
        this.contexts = {};
        
        // Инициализация контекстов
        for (const [size, canvas] of Object.entries(this.canvases)) {
            this.contexts[size] = canvas.getContext('2d');
        }
        
        this.init();
    }
    
    init() {
        document.getElementById('generateAll').addEventListener('click', () => {
            this.generateAllSizes();
        });
    }
    
    async generateAllSizes() {
        const button = document.getElementById('generateAll');
        const progress = document.getElementById('progress');
        const progressText = progress.querySelector('.progress-text');
        
        button.disabled = true;
        progress.style.display = 'block';
        progressText.textContent = 'Загрузка изображений...';
        
        try {
            // Загружаем все изображения
            await this.loadAllImages();
            
            progressText.textContent = 'Генерация баннеров...';
            
            // Генерируем баннеры для всех размеров
            this.generateBanner1575x600();
            this.generateBanner522x400();
            this.generateBanner300x100();
            
            progressText.textContent = 'Готово!';
            setTimeout(() => {
                progress.style.display = 'none';
            }, 2000);
            
        } catch (error) {
            console.error('Ошибка при генерации:', error);
            progressText.textContent = 'Ошибка при генерации!';
        } finally {
            button.disabled = false;
        }
    }
    
    async loadAllImages() {
        const imageFiles = [
            'MOSTOVOY.png',
            'BABIC.png', 
            'CORDOBA.png',
            'Vector-3.png',
            'Vector-4.png',
            'Rectangle 281.png',
            'LOGO_FANTASY.png',
            'Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png',
            'Новый сезон.png'
        ];
        
        const loadPromises = imageFiles.map(filename => this.loadImage(filename));
        await Promise.all(loadPromises);
    }
    
    loadImage(filename) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images[filename] = img;
                resolve(img);
            };
            img.onerror = reject;
            img.src = `../desighn_resize/${filename}`;
        });
    }
    
    // Генерация баннера 1575×600 (широкий горизонтальный)
    generateBanner1575x600() {
        const ctx = this.contexts['1575x600'];
        const width = 1575;
        const height = 600;
        
        // Очищаем canvas
        ctx.clearRect(0, 0, width, height);
        
        // Фон - Rectangle 281 (растянуть на всю ширину)
        if (this.images['Rectangle 281.png']) {
            ctx.drawImage(this.images['Rectangle 281.png'], 0, 0, width, height);
        }
        
        // Декоративные элементы Vector-3 и Vector-4
        if (this.images['Vector-3.png']) {
            ctx.drawImage(this.images['Vector-3.png'], width - 200, 50, 150, 150);
        }
        
        if (this.images['Vector-4.png']) {
            ctx.drawImage(this.images['Vector-4.png'], 50, height - 120, 100, 100);
        }
        
        // Логотип Fantasy
        if (this.images['LOGO_FANTASY.png']) {
            ctx.drawImage(this.images['LOGO_FANTASY.png'], 50, 40, 120, 60);
        }
        
        // Текст "Новый сезон"
        if (this.images['Новый сезон.png']) {
            ctx.drawImage(this.images['Новый сезон.png'], 50, 120, 200, 40);
        }
        
        // Игроки (3 игрока в ряд)
        const playersWidth = 200;
        const playersHeight = 350;
        const playersY = height - playersHeight - 20;
        
        if (this.images['MOSTOVOY.png']) {
            ctx.drawImage(this.images['MOSTOVOY.png'], width - 650, playersY, playersWidth, playersHeight);
        }
        
        if (this.images['BABIC.png']) {
            ctx.drawImage(this.images['BABIC.png'], width - 430, playersY, playersWidth, playersHeight);
        }
        
        if (this.images['CORDOBA.png']) {
            ctx.drawImage(this.images['CORDOBA.png'], width - 210, playersY, playersWidth, playersHeight);
        }
        
        // Основной текст
        if (this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png']) {
            ctx.drawImage(this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'], 
                         50, 180, 400, 80);
        }
    }
    
    // Генерация баннера 522×400 (средний прямоугольный)
    generateBanner522x400() {
        const ctx = this.contexts['522x400'];
        const width = 522;
        const height = 400;
        
        // Очищаем canvas
        ctx.clearRect(0, 0, width, height);
        
        // Фон
        if (this.images['Rectangle 281.png']) {
            ctx.drawImage(this.images['Rectangle 281.png'], 0, 0, width, height);
        }
        
        // Декоративные элементы (уменьшенные)
        if (this.images['Vector-3.png']) {
            ctx.drawImage(this.images['Vector-3.png'], width - 120, 30, 90, 90);
        }
        
        if (this.images['Vector-4.png']) {
            ctx.drawImage(this.images['Vector-4.png'], 30, height - 80, 60, 60);
        }
        
        // Логотип Fantasy
        if (this.images['LOGO_FANTASY.png']) {
            ctx.drawImage(this.images['LOGO_FANTASY.png'], 30, 25, 80, 40);
        }
        
        // Текст "Новый сезон"
        if (this.images['Новый сезон.png']) {
            ctx.drawImage(this.images['Новый сезон.png'], 30, 80, 120, 25);
        }
        
        // Игроки (2 игрока)
        const playersWidth = 130;
        const playersHeight = 230;
        const playersY = height - playersHeight - 10;
        
        if (this.images['MOSTOVOY.png']) {
            ctx.drawImage(this.images['MOSTOVOY.png'], width - 280, playersY, playersWidth, playersHeight);
        }
        
        if (this.images['BABIC.png']) {
            ctx.drawImage(this.images['BABIC.png'], width - 140, playersY, playersWidth, playersHeight);
        }
        
        // Основной текст (уменьшенный)
        if (this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png']) {
            ctx.drawImage(this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'], 
                         30, 120, 250, 50);
        }
    }
    
    // Генерация баннера 300×100 (узкий горизонтальный)
    generateBanner300x100() {
        const ctx = this.contexts['300x100'];
        const width = 300;
        const height = 100;
        
        // Очищаем canvas
        ctx.clearRect(0, 0, width, height);
        
        // Фон
        if (this.images['Rectangle 281.png']) {
            ctx.drawImage(this.images['Rectangle 281.png'], 0, 0, width, height);
        }
        
        // Логотип Fantasy (маленький)
        if (this.images['LOGO_FANTASY.png']) {
            ctx.drawImage(this.images['LOGO_FANTASY.png'], 10, 10, 50, 25);
        }
        
        // Текст "Новый сезон" (очень маленький)
        if (this.images['Новый сезон.png']) {
            ctx.drawImage(this.images['Новый сезон.png'], 10, 40, 80, 15);
        }
        
        // Один игрок справа
        const playerWidth = 60;
        const playerHeight = 80;
        
        if (this.images['MOSTOVOY.png']) {
            ctx.drawImage(this.images['MOSTOVOY.png'], width - playerWidth - 10, height - playerHeight - 5, 
                         playerWidth, playerHeight);
        }
        
        // Декоративный элемент (очень маленький)
        if (this.images['Vector-4.png']) {
            ctx.drawImage(this.images['Vector-4.png'], width - 40, 10, 30, 30);
        }
        
        // Основной текст (сильно сжатый)
        if (this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png']) {
            ctx.drawImage(this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'], 
                         10, 65, 150, 25);
        }
    }
}

// Функция для скачивания canvas как изображения
function downloadCanvas(canvasId, filename) {
    const canvas = document.getElementById(canvasId);
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new FantasyBannerGenerator();
}); 