const VARIANTS_DATA = {
    A: {
        id: 'A',
        name: 'Огонёк (текущий)',
        icon: '🔥',
        description: 'Классический огонёк, который сейчас используется на Sports.ru',
        color: '#ff6b6b',
        backgroundColor: '#fff5f5',
        psychology: 'Символизирует "горячую" тему, эмоциональность'
    },
    B: {
        id: 'B', 
        name: 'Сообщения',
        icon: '💬',
        description: 'Традиционная иконка комментариев - облачко с сообщением',
        color: '#4285f4',
        backgroundColor: '#f0f8ff',
        psychology: 'Прямо указывает на диалог и общение'
    },
    C: {
        id: 'C',
        name: 'Обсуждение', 
        icon: '🗨️',
        description: 'Более детализированная иконка обсуждения',
        color: '#666',
        backgroundColor: '#f5f5f5',
        psychology: 'Подчёркивает серьёзность дискуссии'
    },
    D: {
        id: 'D',
        name: 'Взрыв эмоций',
        icon: '💥',
        description: 'Показывает эмоциональность и активность обсуждений',
        color: '#ff8c00',
        backgroundColor: '#fff0e6',
        psychology: 'Привлекает внимание, создаёт ощущение энергии'
    },
    E: {
        id: 'E',
        name: 'Горячие обсуждения',
        icon: '🌶️',
        description: 'Перец символизирует "острые" дискуссии',
        color: '#dc143c',
        backgroundColor: '#ffe6e6',
        psychology: 'Намекает на спорность и остроту темы'
    },
    F: {
        id: 'F',
        name: 'Активность',
        icon: '⚡',
        description: 'Молния показывает быстроту и активность обсуждений',
        color: '#ffd700',
        backgroundColor: '#fffacd',
        psychology: 'Создаёт ощущение динамики и скорости'
    }
};

// Статистика по умолчанию
const DEFAULT_STATS = {
    A: { clicks: 0, views: 0, ctr: 0 },
    B: { clicks: 0, views: 0, ctr: 0 },
    C: { clicks: 0, views: 0, ctr: 0 },
    D: { clicks: 0, views: 0, ctr: 0 },
    E: { clicks: 0, views: 0, ctr: 0 },
    F: { clicks: 0, views: 0, ctr: 0 }
};

// Тестовые сценарии
const TEST_SCENARIOS = [
    {
        title: 'ЦСКА – снова лучший в баскетболе',
        description: 'Закрыли серию с «Зенитом» в 6 матчах.',
        commentsCount: 5,
        category: 'basketball'
    },
    {
        title: 'Новый трансфер в «Спартаке»',
        description: 'Клуб объявил о подписании защитника.',
        commentsCount: 12,
        category: 'football'
    },
    {
        title: 'Скандал в КХЛ',
        description: 'Арбитр принял спорное решение в матче.',
        commentsCount: 28,
        category: 'hockey'
    }
]; 