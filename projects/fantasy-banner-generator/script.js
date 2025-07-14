class FantasyBannerGenerator {
    constructor() {
        this.images = {};
        this.canvases = {
            '1575x600': document.getElementById('canvas1575'),
            '522x400': document.getElementById('canvas522'),
            '300x100': document.getElementById('canvas300')
        };
        this.contexts = {};
        
        // Цветовая палитра
        this.colors = {
            white: '#FFFFFF',
            black: '#000000',
            green: '#00D496'
        };
        
        // Инициализация контекстов
        for (const [size, canvas] of Object.entries(this.canvases)) {
            this.contexts[size] = canvas.getContext('2d');
        }
        
        this.init();
    }
    
    // Функция для создания точного фона как в референсе
    createReferenceBackground(ctx, width, height) {
        // Заливаем белым фоном
        ctx.fillStyle = this.colors.white;
        ctx.fillRect(0, 0, width, height);
        
        // Добавляем Rectangle 281 как основу
        if (this.images['Rectangle 281.png']) {
            ctx.drawImage(this.images['Rectangle 281.png'], 0, 0, width, height);
        }
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
        
        // Создаем точный фон как в референсе
        this.createReferenceBackground(ctx, width, height);
        
        // ЛЕВАЯ ЧАСТЬ - Текстовый блок
        const leftMargin = 60;
        const textAreaWidth = 500;
        
        // Логотип Fantasy (верхний левый)
        if (this.images['LOGO_FANTASY.png']) {
            const logoScale = 1.0;
            const logoW = this.images['LOGO_FANTASY.png'].width * logoScale;
            const logoH = this.images['LOGO_FANTASY.png'].height * logoScale;
            ctx.drawImage(this.images['LOGO_FANTASY.png'], leftMargin, 50, logoW, logoH);
        }
        
        // Текст "Новый сезон" (под логотипом)
        if (this.images['Новый сезон.png']) {
            const seasonScale = 1.5;
            const seasonW = this.images['Новый сезон.png'].width * seasonScale;
            const seasonH = this.images['Новый сезон.png'].height * seasonScale;
            ctx.drawImage(this.images['Новый сезон.png'], leftMargin, 120, seasonW, seasonH);
        }
        
        // Основной текст (под "Новый сезон")
        if (this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png']) {
            const textScale = 1.2;
            const textW = Math.min(this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'].width * textScale, textAreaWidth);
            const textH = this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'].height * textScale;
            ctx.drawImage(this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'], 
                         leftMargin, 200, textW, textH);
        }
        
        // ПРАВАЯ ЧАСТЬ - Игроки (снизу, не перекрывая текст)
        const playersScale = 1.0;
        const playerWidth = 180;
        const playersY = height - 280; // От низа вверх
        const playersRightMargin = 60;
        
        // Три игрока справа налево
        if (this.images['CORDOBA.png']) {
            const pw = playerWidth;
            const ph = this.images['CORDOBA.png'].height * (playerWidth / this.images['CORDOBA.png'].width);
            ctx.drawImage(this.images['CORDOBA.png'], width - playersRightMargin - pw, playersY, pw, ph);
        }
        
        if (this.images['BABIC.png']) {
            const pw = playerWidth;
            const ph = this.images['BABIC.png'].height * (playerWidth / this.images['BABIC.png'].width);
            ctx.drawImage(this.images['BABIC.png'], width - playersRightMargin - pw - 200, playersY, pw, ph);
        }
        
        if (this.images['MOSTOVOY.png']) {
            const pw = playerWidth;
            const ph = this.images['MOSTOVOY.png'].height * (playerWidth / this.images['MOSTOVOY.png'].width);
            ctx.drawImage(this.images['MOSTOVOY.png'], width - playersRightMargin - pw - 400, playersY, pw, ph);
        }
        
        // Декоративные элементы (по краям, не мешают основному контенту)
        if (this.images['Vector-3.png']) {
            const v3Scale = 0.8;
            const v3W = this.images['Vector-3.png'].width * v3Scale;
            const v3H = this.images['Vector-3.png'].height * v3Scale;
            ctx.drawImage(this.images['Vector-3.png'], width - v3W - 20, 20, v3W, v3H);
        }
        
        if (this.images['Vector-4.png']) {
            const v4Scale = 0.6;
            const v4W = this.images['Vector-4.png'].width * v4Scale;
            const v4H = this.images['Vector-4.png'].height * v4Scale;
            ctx.drawImage(this.images['Vector-4.png'], 20, height - v4H - 20, v4W, v4H);
        }
    }
    
    // Генерация баннера 522×400 (средний прямоугольный)
    generateBanner522x400() {
        const ctx = this.contexts['522x400'];
        const width = 522;
        const height = 400;
        
        // Очищаем canvas
        ctx.clearRect(0, 0, width, height);
        
        // Создаем точный фон как в референсе
        this.createReferenceBackground(ctx, width, height);
        
        // ЛЕВАЯ ЧАСТЬ - Текстовый блок (пропорционально уменьшенный)
        const leftMargin = 30;
        const textAreaWidth = 250;
        
        // Логотип Fantasy (верхний левый)
        if (this.images['LOGO_FANTASY.png']) {
            const logoScale = 0.6;
            const logoW = this.images['LOGO_FANTASY.png'].width * logoScale;
            const logoH = this.images['LOGO_FANTASY.png'].height * logoScale;
            ctx.drawImage(this.images['LOGO_FANTASY.png'], leftMargin, 30, logoW, logoH);
        }
        
        // Текст "Новый сезон" (под логотипом)
        if (this.images['Новый сезон.png']) {
            const seasonScale = 1.0;
            const seasonW = this.images['Новый сезон.png'].width * seasonScale;
            const seasonH = this.images['Новый сезон.png'].height * seasonScale;
            ctx.drawImage(this.images['Новый сезон.png'], leftMargin, 80, seasonW, seasonH);
        }
        
        // Основной текст (под "Новый сезон")
        if (this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png']) {
            const textScale = 0.8;
            const textW = Math.min(this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'].width * textScale, textAreaWidth);
            const textH = this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'].height * textScale;
            ctx.drawImage(this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'], 
                         leftMargin, 130, textW, textH);
        }
        
        // ПРАВАЯ ЧАСТЬ - Игроки (снизу, не перекрывая текст)
        const playerWidth = 110;
        const playersY = height - 200; // От низа вверх
        const playersRightMargin = 30;
        
        // Два игрока справа налево
        if (this.images['BABIC.png']) {
            const pw = playerWidth;
            const ph = this.images['BABIC.png'].height * (playerWidth / this.images['BABIC.png'].width);
            ctx.drawImage(this.images['BABIC.png'], width - playersRightMargin - pw, playersY, pw, ph);
        }
        
        if (this.images['MOSTOVOY.png']) {
            const pw = playerWidth;
            const ph = this.images['MOSTOVOY.png'].height * (playerWidth / this.images['MOSTOVOY.png'].width);
            ctx.drawImage(this.images['MOSTOVOY.png'], width - playersRightMargin - pw - 130, playersY, pw, ph);
        }
        
        // Декоративные элементы (по краям, не мешают основному контенту)
        if (this.images['Vector-3.png']) {
            const v3Scale = 0.5;
            const v3W = this.images['Vector-3.png'].width * v3Scale;
            const v3H = this.images['Vector-3.png'].height * v3Scale;
            ctx.drawImage(this.images['Vector-3.png'], width - v3W - 15, 15, v3W, v3H);
        }
        
        if (this.images['Vector-4.png']) {
            const v4Scale = 0.4;
            const v4W = this.images['Vector-4.png'].width * v4Scale;
            const v4H = this.images['Vector-4.png'].height * v4Scale;
            ctx.drawImage(this.images['Vector-4.png'], 15, height - v4H - 15, v4W, v4H);
        }
    }
    
    // Генерация баннера 300×100 (узкий горизонтальный)
    generateBanner300x100() {
        const ctx = this.contexts['300x100'];
        const width = 300;
        const height = 100;
        
        // Очищаем canvas
        ctx.clearRect(0, 0, width, height);
        
        // Создаем точный фон как в референсе
        this.createReferenceBackground(ctx, width, height);
        
        // ЛЕВАЯ ЧАСТЬ - Только основные элементы (компактно)
        const leftMargin = 15;
        const textAreaWidth = 150;
        
        // Логотип Fantasy (верхний левый, очень маленький)
        if (this.images['LOGO_FANTASY.png']) {
            const logoScale = 0.3;
            const logoW = this.images['LOGO_FANTASY.png'].width * logoScale;
            const logoH = this.images['LOGO_FANTASY.png'].height * logoScale;
            ctx.drawImage(this.images['LOGO_FANTASY.png'], leftMargin, 10, logoW, logoH);
        }
        
        // Текст "Новый сезон" (рядом с логотипом или под ним)
        if (this.images['Новый сезон.png']) {
            const seasonScale = 0.5;
            const seasonW = this.images['Новый сезон.png'].width * seasonScale;
            const seasonH = this.images['Новый сезон.png'].height * seasonScale;
            ctx.drawImage(this.images['Новый сезон.png'], leftMargin, 35, seasonW, seasonH);
        }
        
        // Основной текст (очень компактно)
        if (this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png']) {
            const textScale = 0.35;
            const textW = Math.min(this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'].width * textScale, textAreaWidth);
            const textH = this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'].height * textScale;
            ctx.drawImage(this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'], 
                         leftMargin, 60, textW, textH);
        }
        
        // ПРАВАЯ ЧАСТЬ - Один игрок (не перекрывая текст)
        const playerWidth = 70;
        const playersY = 10; // Сверху
        const playersRightMargin = 15;
        
        // Один игрок справа
        if (this.images['MOSTOVOY.png']) {
            const pw = playerWidth;
            const ph = this.images['MOSTOVOY.png'].height * (playerWidth / this.images['MOSTOVOY.png'].width);
            // Убеждаемся что игрок помещается по высоте
            const maxHeight = height - 20;
            const finalHeight = Math.min(ph, maxHeight);
            const finalWidth = pw * (finalHeight / ph);
            ctx.drawImage(this.images['MOSTOVOY.png'], width - playersRightMargin - finalWidth, playersY, finalWidth, finalHeight);
        }
        
        // Декоративные элементы (минимальные)
        if (this.images['Vector-4.png']) {
            const v4Scale = 0.2;
            const v4W = this.images['Vector-4.png'].width * v4Scale;
            const v4H = this.images['Vector-4.png'].height * v4Scale;
            ctx.drawImage(this.images['Vector-4.png'], 5, height - v4H - 5, v4W, v4H);
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