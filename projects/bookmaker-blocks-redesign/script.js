// Глобальные переменные для данных
let bookmakerData = null;

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

// Загрузка JSON данных
async function loadBookmakerData() {
    try {
        const response = await fetch('./data/bookmaker_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        bookmakerData = await response.json();
        console.log('Данные загружены:', bookmakerData);
        return bookmakerData;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return null;
    }
}

// Создание блока амбассадора
function createAmbassadorBlock(ambassador) {
    const block = document.createElement('div');
    block.className = 'block-item ambassador-block';
    
    const nameParts = splitName(ambassador.name);
    
    block.innerHTML = `
        ${ambassador.avatar_url ? 
            `<img src="${ambassador.avatar_url}" alt="${ambassador.name}" class="block-avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="placeholder-avatar" style="display: none;">${getInitials(ambassador.name)}</div>` :
            `<div class="placeholder-avatar">${getInitials(ambassador.name)}</div>`
        }
        
        <div class="block-name">
            <span class="name-first">${nameParts.first}</span>
            ${nameParts.last ? `<span class="name-last">${nameParts.last}</span>` : ''}
        </div>
        
        <div class="block-profession">${ambassador.profession}</div>
        
        <div class="category-tag category-${ambassador.category}">${ambassador.category}</div>
        
        <div class="block-bookmaker">Амбассадор ${ambassador.bookmaker}</div>
        
        <div class="block-description">${ambassador.description}</div>
        
        <div class="contract-info">
            <div class="partnership-since">С ${ambassador.partnership_since}</div>
            <div class="contract-value">${ambassador.contract_value}</div>
        </div>
    `;
    
    return block;
}

// Создание блока трансляции
function createBroadcastBlock(broadcast) {
    const block = document.createElement('div');
    block.className = 'block-item broadcast-block';
    
    // Определяем нужно ли разбивать название на строки
    const needMultiLine = broadcast.full_name.length > 20;
    const nameParts = needMultiLine ? splitName(broadcast.full_name) : { first: broadcast.tournament_name, last: '' };
    
    block.innerHTML = `
        ${broadcast.has_live ? '<div class="live-indicator"></div>' : ''}
        
        ${broadcast.logo_url ? 
            `<img src="${broadcast.logo_url}" alt="${broadcast.full_name}" class="block-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="placeholder-logo" style="display: none;">${getInitials(broadcast.full_name)}</div>` :
            `<div class="placeholder-logo">${getInitials(broadcast.full_name)}</div>`
        }
        
        <div class="block-name">
            <span class="name-first">${needMultiLine ? nameParts.first : broadcast.tournament_name}</span>
            ${needMultiLine && nameParts.last ? `<span class="name-last">${nameParts.last}</span>` : ''}
        </div>
        
        <div class="block-type">Турнир • ${broadcast.season}</div>
        
        <div class="block-bookmaker">Трансляции на ${broadcast.bookmaker}</div>
        
        <div class="block-description">${broadcast.description}</div>
        
        <div class="broadcast-info">
            ${broadcast.has_live ? '<div class="live-badge">● LIVE</div>' : ''}
            <div class="viewers">Зрители: ${parseInt(broadcast.viewers_avg).toLocaleString()}</div>
            <div class="matches">Матчей: ${broadcast.matches_count}</div>
        </div>
    `;
    
    return block;
}

// Создание блока партнера
function createPartnerBlock(partner) {
    const block = document.createElement('div');
    block.className = 'block-item partner-block';
    
    const nameParts = splitName(partner.full_name);
    
    block.innerHTML = `
        ${partner.logo_url ? 
            `<img src="${partner.logo_url}" alt="${partner.full_name}" class="block-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="placeholder-logo" style="display: none;">${getInitials(partner.full_name)}</div>` :
            `<div class="placeholder-logo">${getInitials(partner.full_name)}</div>`
        }
        
        <div class="block-name">
            <span class="name-first">${nameParts.first}</span>
            ${nameParts.last ? `<span class="name-last">${nameParts.last}</span>` : ''}
        </div>
        
        <div class="block-type">${partner.type} • ${partner.city}</div>
        
        <div class="partnership-type">${partner.partnership_type}</div>
        
        <div class="block-bookmaker">Партнер ${partner.bookmaker}</div>
        
        <div class="block-description">${partner.description}</div>
        
        <div class="partnership-info">
            <div class="contract-value">${partner.contract_value}</div>
            <div class="contract-duration">${partner.contract_duration}</div>
            <div class="league">${partner.league}</div>
        </div>
    `;
    
    return block;
}

// Функция рендеринга блоков
function renderBlocks() {
    if (!bookmakerData) {
        console.error('Данные не загружены!');
        return;
    }
    
    // Рендер амбассадоров
    const ambassadorsGrid = document.getElementById('ambassadors-grid');
    ambassadorsGrid.innerHTML = '';
    
    bookmakerData.ambassadors.forEach(ambassador => {
        const block = createAmbassadorBlock(ambassador);
        ambassadorsGrid.appendChild(block);
    });
    
    // Рендер трансляций
    const broadcastsGrid = document.getElementById('broadcasts-grid');
    broadcastsGrid.innerHTML = '';
    
    bookmakerData.broadcasts.forEach(broadcast => {
        const block = createBroadcastBlock(broadcast);
        broadcastsGrid.appendChild(block);
    });
    
    // Рендер партнеров
    const partnersGrid = document.getElementById('partners-grid');
    partnersGrid.innerHTML = '';
    
    bookmakerData.partners.forEach(partner => {
        const block = createPartnerBlock(partner);
        partnersGrid.appendChild(block);
    });
}

// Функция инициализации
async function initializeBlocks() {
    // Показываем loader
    document.body.style.opacity = '0.7';
    
    // Загружаем данные
    const data = await loadBookmakerData();
    
    if (!data) {
        console.error('Не удалось загрузить данные!');
        document.body.innerHTML = '<div style="text-align: center; padding: 50px; color: red;">Ошибка загрузки данных</div>';
        return;
    }
    
    // Рендерим блоки
    renderBlocks();
    
    // Добавляем обработчики событий
    addEventListeners();
    
    // Убираем loader
    document.body.style.opacity = '1';
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
            if (placeholder && (placeholder.classList.contains('placeholder-avatar') || placeholder.classList.contains('placeholder-logo'))) {
                placeholder.style.display = 'flex';
            }
        });
    });
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeBlocks); 