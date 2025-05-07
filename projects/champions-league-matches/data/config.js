const CONFIG = {
    // ID сезона Лиги Чемпионов 2024-2025
    seasonId: 'champions_league_24-25',
    
    // Максимальное количество матчей для отображения
    maxMatches: 10,
    
    // Дата, до которой показываем матчи (3 месяца вперед)
    getDateLimit: () => {
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + 3);
        return futureDate.toISOString().split('T')[0];
    },
    
    // Базовый URL для GraphQL API
    apiUrl: 'https://www.sports.ru/gql/graphql/',
    
    // Шаблон для перевода месяцев
    months: {
        '01': 'января',
        '02': 'февраля',
        '03': 'марта',
        '04': 'апреля',
        '05': 'мая',
        '06': 'июня',
        '07': 'июля',
        '08': 'августа',
        '09': 'сентября',
        '10': 'октября',
        '11': 'ноября',
        '12': 'декабря'
    },
    
    // Функция для форматирования даты в удобный вид
    formatDate: (dateString) => {
        if (!dateString) return '';
        
        const [year, month, day] = dateString.split('-');
        return `${parseInt(day)} ${CONFIG.months[month]} ${year}`;
    },
    
    // Функция для форматирования времени
    formatTime: (timeString) => {
        if (!timeString) return 'TBD';
        
        const time = timeString.split('T')[1].substring(0, 5);
        return time;
    }
}; 