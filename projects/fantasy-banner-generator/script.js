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
    
    // Функция для создания цветного фона
    createColoredBackground(ctx, width, height) {
        // Создаем современный градиент с зеленого в белый
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, this.colors.green);
        gradient.addColorStop(0.7, this.colors.white);
        gradient.addColorStop(1, this.colors.white);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Добавляем акцентные элементы
        ctx.fillStyle = this.colors.black;
        ctx.globalAlpha = 0.1;
        // Декоративные полосы
        for (let i = 0; i < 3; i++) {
            const stripeY = (height / 4) * (i + 1);
            ctx.fillRect(0, stripeY, width, 2);
        }
        ctx.globalAlpha = 1.0;
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
        
        // Создаем цветной фон с новой палитрой
        this.createColoredBackground(ctx, width, height);
        
        // Добавляем Rectangle 281 как overlay при наличии
        if (this.images['Rectangle 281.png']) {
            ctx.globalAlpha = 0.3;
            ctx.drawImage(this.images['Rectangle 281.png'], 0, 0, width, height);
            ctx.globalAlpha = 1.0;
        }
        
        // Логотип Fantasy (верхний левый угол)
        if (this.images['LOGO_FANTASY.png']) {
            const logoScale = 0.8;
            const logoW = this.images['LOGO_FANTASY.png'].width * logoScale;
            const logoH = this.images['LOGO_FANTASY.png'].height * logoScale;
            ctx.drawImage(this.images['LOGO_FANTASY.png'], 60, 60, logoW, logoH);
        }
        
        // Текст "Новый сезон" (под логотипом)
        if (this.images['Новый сезон.png']) {
            const seasonScale = 1.2;
            const seasonW = this.images['Новый сезон.png'].width * seasonScale;
            const seasonH = this.images['Новый сезон.png'].height * seasonScale;
            ctx.drawImage(this.images['Новый сезон.png'], 60, 150, seasonW, seasonH);
        }
        
        // Основной текст (центр слева)
        if (this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png']) {
            const textScale = 1.5;
            const textW = this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'].width * textScale;
            const textH = this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'].height * textScale;
            ctx.drawImage(this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'], 
                         60, 240, textW, textH);
        }
        
        // Игроки (3 игрока справа, сохраняем пропорции)
        const playersScale = 1.8;
        const playerSpacing = 200;
        const playersStartX = width - (3 * playerSpacing + 50);
        const playersY = 150;
        
        if (this.images['MOSTOVOY.png']) {
            const pw = this.images['MOSTOVOY.png'].width * playersScale;
            const ph = this.images['MOSTOVOY.png'].height * playersScale;
            ctx.drawImage(this.images['MOSTOVOY.png'], playersStartX, playersY, pw, ph);
        }
        
        if (this.images['BABIC.png']) {
            const pw = this.images['BABIC.png'].width * playersScale;
            const ph = this.images['BABIC.png'].height * playersScale;
            ctx.drawImage(this.images['BABIC.png'], playersStartX + playerSpacing, playersY, pw, ph);
        }
        
        if (this.images['CORDOBA.png']) {
            const pw = this.images['CORDOBA.png'].width * playersScale;
            const ph = this.images['CORDOBA.png'].height * playersScale;
            ctx.drawImage(this.images['CORDOBA.png'], playersStartX + playerSpacing * 2, playersY, pw, ph);
        }
        
        // Декоративные элементы (сохраняем пропорции)
        if (this.images['Vector-3.png']) {
            const v3Scale = 1.0;
            const v3W = this.images['Vector-3.png'].width * v3Scale;
            const v3H = this.images['Vector-3.png'].height * v3Scale;
            ctx.drawImage(this.images['Vector-3.png'], width - v3W - 40, 40, v3W, v3H);
        }
        
        if (this.images['Vector-4.png']) {
            const v4Scale = 0.8;
            const v4W = this.images['Vector-4.png'].width * v4Scale;
            const v4H = this.images['Vector-4.png'].height * v4Scale;
            ctx.drawImage(this.images['Vector-4.png'], 40, height - v4H - 40, v4W, v4H);
        }
    }
    
    // Генерация баннера 522×400 (средний прямоугольный)
    generateBanner522x400() {
        const ctx = this.contexts['522x400'];
        const width = 522;
        const height = 400;
        
        // Очищаем canvas
        ctx.clearRect(0, 0, width, height);
        
        // Создаем цветной фон с новой палитрой
        this.createColoredBackground(ctx, width, height);
        
        // Добавляем Rectangle 281 как overlay при наличии
        if (this.images['Rectangle 281.png']) {
            ctx.globalAlpha = 0.3;
            ctx.drawImage(this.images['Rectangle 281.png'], 0, 0, width, height);
            ctx.globalAlpha = 1.0;
        }
        
        // Логотип Fantasy (верхний левый угол)
        if (this.images['LOGO_FANTASY.png']) {
            const logoScale = 0.5;
            const logoW = this.images['LOGO_FANTASY.png'].width * logoScale;
            const logoH = this.images['LOGO_FANTASY.png'].height * logoScale;
            ctx.drawImage(this.images['LOGO_FANTASY.png'], 30, 30, logoW, logoH);
        }
        
        // Текст "Новый сезон" (под логотипом)
        if (this.images['Новый сезон.png']) {
            const seasonScale = 0.8;
            const seasonW = this.images['Новый сезон.png'].width * seasonScale;
            const seasonH = this.images['Новый сезон.png'].height * seasonScale;
            ctx.drawImage(this.images['Новый сезон.png'], 30, 80, seasonW, seasonH);
        }
        
        // Основной текст (центр слева)
        if (this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png']) {
            const textScale = 0.9;
            const textW = this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'].width * textScale;
            const textH = this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'].height * textScale;
            ctx.drawImage(this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'], 
                         30, 130, textW, textH);
        }
        
        // Игроки (2 игрока справа, сохраняем пропорции)
        const playersScale = 1.2;
        const playerSpacing = 130;
        const playersStartX = width - (2 * playerSpacing + 30);
        const playersY = 100;
        
        if (this.images['MOSTOVOY.png']) {
            const pw = this.images['MOSTOVOY.png'].width * playersScale;
            const ph = this.images['MOSTOVOY.png'].height * playersScale;
            ctx.drawImage(this.images['MOSTOVOY.png'], playersStartX, playersY, pw, ph);
        }
        
        if (this.images['BABIC.png']) {
            const pw = this.images['BABIC.png'].width * playersScale;
            const ph = this.images['BABIC.png'].height * playersScale;
            ctx.drawImage(this.images['BABIC.png'], playersStartX + playerSpacing, playersY, pw, ph);
        }
        
        // Декоративные элементы (сохраняем пропорции)
        if (this.images['Vector-3.png']) {
            const v3Scale = 0.6;
            const v3W = this.images['Vector-3.png'].width * v3Scale;
            const v3H = this.images['Vector-3.png'].height * v3Scale;
            ctx.drawImage(this.images['Vector-3.png'], width - v3W - 25, 25, v3W, v3H);
        }
        
        if (this.images['Vector-4.png']) {
            const v4Scale = 0.5;
            const v4W = this.images['Vector-4.png'].width * v4Scale;
            const v4H = this.images['Vector-4.png'].height * v4Scale;
            ctx.drawImage(this.images['Vector-4.png'], 25, height - v4H - 25, v4W, v4H);
        }
    }
    
    // Генерация баннера 300×100 (узкий горизонтальный)
    generateBanner300x100() {
        const ctx = this.contexts['300x100'];
        const width = 300;
        const height = 100;
        
        // Очищаем canvas
        ctx.clearRect(0, 0, width, height);
        
        // Создаем цветной фон с новой палитрой
        this.createColoredBackground(ctx, width, height);
        
        // Добавляем Rectangle 281 как overlay при наличии
        if (this.images['Rectangle 281.png']) {
            ctx.globalAlpha = 0.3;
            ctx.drawImage(this.images['Rectangle 281.png'], 0, 0, width, height);
            ctx.globalAlpha = 1.0;
        }
        
        // Логотип Fantasy (верхний левый угол)
        if (this.images['LOGO_FANTASY.png']) {
            const logoScale = 0.25;
            const logoW = this.images['LOGO_FANTASY.png'].width * logoScale;
            const logoH = this.images['LOGO_FANTASY.png'].height * logoScale;
            ctx.drawImage(this.images['LOGO_FANTASY.png'], 15, 15, logoW, logoH);
        }
        
        // Текст "Новый сезон" (под логотипом)
        if (this.images['Новый сезон.png']) {
            const seasonScale = 0.4;
            const seasonW = this.images['Новый сезон.png'].width * seasonScale;
            const seasonH = this.images['Новый сезон.png'].height * seasonScale;
            ctx.drawImage(this.images['Новый сезон.png'], 15, 40, seasonW, seasonH);
        }
        
        // Основной текст (компактно)
        if (this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png']) {
            const textScale = 0.5;
            const textW = this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'].width * textScale;
            const textH = this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'].height * textScale;
            ctx.drawImage(this.images['Вступайте в разные фэнтези-лиги или создавайте собственный турнир.png'], 
                         15, 60, textW, textH);
        }
        
        // Один игрок справа (сохраняем пропорции)
        if (this.images['MOSTOVOY.png']) {
            const playerScale = 0.8;
            const pw = this.images['MOSTOVOY.png'].width * playerScale;
            const ph = this.images['MOSTOVOY.png'].height * playerScale;
            ctx.drawImage(this.images['MOSTOVOY.png'], width - pw - 15, 20, pw, ph);
        }
        
        // Декоративный элемент (очень маленький)
        if (this.images['Vector-4.png']) {
            const v4Scale = 0.3;
            const v4W = this.images['Vector-4.png'].width * v4Scale;
            const v4H = this.images['Vector-4.png'].height * v4Scale;
            ctx.drawImage(this.images['Vector-4.png'], 10, height - v4H - 10, v4W, v4H);
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