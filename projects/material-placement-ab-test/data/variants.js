const VARIANTS_DATA = {
    A: {
        id: 'A',
        name: 'Огонёк (текущий)',
        icon: '🔥',
        description: 'Классический огонёк, который сейчас используется на Sports.ru',
        color: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        psychology: 'Символизирует "горячую" тему, эмоциональность'
    },
    B: {
        id: 'B', 
        name: 'Сообщения',
        icon: '💬',
        description: 'Традиционная иконка комментариев - облачко с сообщением',
        color: '#4285f4',
        backgroundColor: 'rgba(66, 133, 244, 0.1)',
        psychology: 'Прямо указывает на диалог и общение'
    },
    C: {
        id: 'C',
        name: 'Обсуждение', 
        icon: '🗨️',
        description: 'Более детализированная иконка обсуждения',
        color: '#666',
        backgroundColor: 'rgba(102, 102, 102, 0.1)',
        psychology: 'Подчёркивает серьёзность дискуссии'
    },
    D: {
        id: 'D',
        name: 'Взрыв эмоций',
        icon: '💥',
        description: 'Показывает эмоциональность и активность обсуждений',
        color: '#ff8c00',
        backgroundColor: 'rgba(255, 140, 0, 0.1)',
        psychology: 'Привлекает внимание, создаёт ощущение энергии'
    },
    E: {
        id: 'E',
        name: 'Горячие обсуждения',
        icon: '🌶️',
        description: 'Перец символизирует "острые" дискуссии',
        color: '#dc143c',
        backgroundColor: 'rgba(220, 20, 60, 0.1)',
        psychology: 'Намекает на спорность и остроту темы'
    },
    F: {
        id: 'F',
        name: 'Активность',
        icon: '⚡',
        description: 'Молния показывает быстроту и активность обсуждений',
        color: '#ffd700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
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

// Данные материала (копия из реального плейсмента)
const MATERIAL_DATA = {
    title: '«Даллас» уволил главного тренера – хотя он среди самых кубковых в истории. Почему?',
    description: 'Кажется, Дебур начал психовать.',
    time: '3 минуты назад',
    category: 'Трибуна',
    commentsCount: 1,
    imageUrl: 'https://photobooth.cdn.sports.ru/preset/message/3/1d/afc8defad4de48ea22612605630a0.jpeg?s=2x',
    imageAlt: '«Даллас» уволил главного тренера'
}; 