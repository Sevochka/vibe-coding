// Утилиты для работы с именами и заглушками
function splitName(fullName) {
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length >= 2) {
        return {
            first: nameParts[0],
            last: nameParts.slice(1).join(' ')
        };
    }
    return {
        first: fullName,
        last: ''
    };
}

function getInitials(name) {
    return name.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
}

function createPlaceholderElement(name, isLogo = false) {
    const placeholder = document.createElement('div');
    placeholder.className = isLogo ? 'placeholder-logo' : 'placeholder-avatar';
    placeholder.textContent = getInitials(name);
    return placeholder;
}

// Создание блока амбассадора
function createAmbassadorBlock(ambassador) {
    const block = document.createElement('div');
    block.className = 'block-item ambassador-block';
    
    const nameParts = splitName(ambassador.fullName);
    
    block.innerHTML = `
        ${ambassador.avatar ? 
            `<img src="${ambassador.avatar}" alt="${ambassador.fullName}" class="block-avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="placeholder-avatar" style="display: none;">${getInitials(ambassador.fullName)}</div>` :
            `<div class="placeholder-avatar">${getInitials(ambassador.fullName)}</div>`
        }
        
        <div class="block-name">
            <span class="name-first">${nameParts.first}</span>
            ${nameParts.last ? `<span class="name-last">${nameParts.last}</span>` : ''}
        </div>
        
        <div class="block-profession">${ambassador.profession}</div>
        
        <div class="category-tag category-${ambassador.category}">${ambassador.category}</div>
        
        <div class="block-bookmaker">Амбассадор ${ambassador.bookmaker}</div>
        
        <div class="block-description">${ambassador.description}</div>
    `;
    
    return block;
}

// Создание блока трансляции
function createBroadcastBlock(broadcast) {
    const block = document.createElement('div');
    block.className = 'block-item broadcast-block';
    
    // Определяем нужно ли разбивать название на строки
    const needMultiLine = broadcast.fullName.length > 20;
    const nameParts = needMultiLine ? splitName(broadcast.fullName) : { first: broadcast.name, last: '' };
    
    block.innerHTML = `
        ${broadcast.hasLiveBroadcast ? '<div class="live-indicator"></div>' : ''}
        
        ${broadcast.logo ? 
            `<img src="${broadcast.logo}" alt="${broadcast.fullName}" class="block-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="placeholder-logo" style="display: none;">${getInitials(broadcast.fullName)}</div>` :
            `<div class="placeholder-logo">${getInitials(broadcast.fullName)}</div>`
        }
        
        <div class="block-name">
            <span class="name-first">${needMultiLine ? nameParts.first : broadcast.name}</span>
            ${needMultiLine && nameParts.last ? `<span class="name-last">${nameParts.last}</span>` : ''}
        </div>
        
        <div class="block-type">Турнир</div>
        
        <div class="block-bookmaker">Трансляции на ${broadcast.bookmaker}</div>
        
        <div class="block-description">${broadcast.description}</div>
        
        ${broadcast.hasLiveBroadcast ? '<div style="font-size: 10px; color: var(--sports-red-a700); font-weight: 600; text-transform: uppercase;">● Live</div>' : ''}
    `;
    
    return block;
}

// Создание блока партнера
function createPartnerBlock(partner) {
    const block = document.createElement('div');
    block.className = 'block-item partner-block';
    
    const nameParts = splitName(partner.fullName);
    
    block.innerHTML = `
        ${partner.logo ? 
            `<img src="${partner.logo}" alt="${partner.fullName}" class="block-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="placeholder-logo" style="display: none;">${getInitials(partner.fullName)}</div>` :
            `<div class="placeholder-logo">${getInitials(partner.fullName)}</div>`
        }
        
        <div class="block-name">
            <span class="name-first">${nameParts.first}</span>
            ${nameParts.last ? `<span class="name-last">${nameParts.last}</span>` : ''}
        </div>
        
        <div class="block-type">${partner.type}</div>
        
        <div class="partnership-type">${partner.partnershipType}</div>
        
        <div class="block-bookmaker">Партнер ${partner.bookmaker}</div>
        
        <div class="block-description">${partner.description}</div>
    `;
    
    return block;
}

// Функция рендеринга блоков
function renderBlocks() {
    // Рендер амбассадоров
    const ambassadorsGrid = document.getElementById('ambassadors-grid');
    ambassadorsGrid.innerHTML = '';
    
    ambassadors.forEach(ambassador => {
        const block = createAmbassadorBlock(ambassador);
        ambassadorsGrid.appendChild(block);
    });
    
    // Рендер трансляций
    const broadcastsGrid = document.getElementById('broadcasts-grid');
    broadcastsGrid.innerHTML = '';
    
    broadcasts.forEach(broadcast => {
        const block = createBroadcastBlock(broadcast);
        broadcastsGrid.appendChild(block);
    });
    
    // Рендер партнеров
    const partnersGrid = document.getElementById('partners-grid');
    partnersGrid.innerHTML = '';
    
    partners.forEach(partner => {
        const block = createPartnerBlock(partner);
        partnersGrid.appendChild(block);
    });
}

// Функция инициализации
function initializeBlocks() {
    // Проверяем доступность данных
    if (typeof ambassadors === 'undefined' || typeof broadcasts === 'undefined' || typeof partners === 'undefined') {
        console.error('Данные не загружены! Убедитесь что все data файлы подключены.');
        return;
    }
    
    // Рендерим блоки
    renderBlocks();
    
    // Добавляем обработчики событий
    addEventListeners();
}

// Обработчики событий
function addEventListeners() {
    // Обработка кликов по блокам
    document.querySelectorAll('.block-item').forEach(block => {
        block.addEventListener('click', function() {
            console.log('Клик по блоку:', this);
            // Здесь можно добавить логику обработки кликов
        });
    });
    
    // Обработка ошибок загрузки изображений
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = this.nextElementSibling;
            if (placeholder && placeholder.classList.contains('placeholder-avatar', 'placeholder-logo')) {
                placeholder.style.display = 'flex';
            }
        });
    });
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeBlocks); 