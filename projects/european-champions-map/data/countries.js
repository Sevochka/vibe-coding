const countries = {
    'spain': {
        name: 'Испания',
        code: 'ES',
        population: '47.4 млн',
        capital: 'Мадрид'
    },
    'england': {
        name: 'Англия',
        code: 'EN',
        population: '56.3 млн',
        capital: 'Лондон'
    },
    'italy': {
        name: 'Италия',
        code: 'IT',
        population: '59.1 млн',
        capital: 'Рим'
    },
    'germany': {
        name: 'Германия',
        code: 'DE',
        population: '83.2 млн',
        capital: 'Берлин'
    },
    'france': {
        name: 'Франция',
        code: 'FR',
        population: '67.8 млн',
        capital: 'Париж'
    },
    'netherlands': {
        name: 'Нидерланды',
        code: 'NL',
        population: '17.4 млн',
        capital: 'Амстердам'
    },
    'portugal': {
        name: 'Португалия',
        code: 'PT',
        population: '10.3 млн',
        capital: 'Лиссабон'
    },
    'belgium': {
        name: 'Бельгия',
        code: 'BE',
        population: '11.5 млн',
        capital: 'Брюссель'
    },
    'scotland': {
        name: 'Шотландия',
        code: 'SC',
        population: '5.5 млн',
        capital: 'Эдинбург'
    },
    'turkey': {
        name: 'Турция',
        code: 'TR',
        population: '84.3 млн',
        capital: 'Анкара'
    },
    'switzerland': {
        name: 'Швейцария',
        code: 'CH',
        population: '8.7 млн',
        capital: 'Берн'
    },
    'austria': {
        name: 'Австрия',
        code: 'AT',
        population: '9.0 млн',
        capital: 'Вена'
    },
    'czechia': {
        name: 'Чехия',
        code: 'CZ',
        population: '10.7 млн',
        capital: 'Прага'
    },
    'denmark': {
        name: 'Дания',
        code: 'DK',
        population: '5.8 млн',
        capital: 'Копенгаген'
    },
    'norway': {
        name: 'Норвегия',
        code: 'NO',
        population: '5.4 млн',
        capital: 'Осло'
    },
    'sweden': {
        name: 'Швеция',
        code: 'SE',
        population: '10.4 млн',
        capital: 'Стокгольм'
    },
    'poland': {
        name: 'Польша',
        code: 'PL',
        population: '38.0 млн',
        capital: 'Варшава'
    },
    'ukraine': {
        name: 'Украина',
        code: 'UA',
        population: '43.8 млн',
        capital: 'Киев'
    },
    'greece': {
        name: 'Греция',
        code: 'GR',
        population: '10.7 млн',
        capital: 'Афины'
    },
    'croatia': {
        name: 'Хорватия',
        code: 'HR',
        population: '3.9 млн',
        capital: 'Загреб'
    },
    'serbia': {
        name: 'Сербия',
        code: 'RS',
        population: '7.0 млн',
        capital: 'Белград'
    },
    'iceland': {
        name: 'Исландия',
        code: 'IS',
        population: '0.4 млн',
        capital: 'Рейкьявик'
    },
    'finland': {
        name: 'Финляндия',
        code: 'FI',
        population: '5.5 млн',
        capital: 'Хельсинки'
    },
    'russia': {
        name: 'Россия',
        code: 'RU',
        population: '144.1 млн',
        capital: 'Москва'
    },
    'estonia': {
        name: 'Эстония',
        code: 'EE',
        population: '1.3 млн',
        capital: 'Таллин'
    },
    'latvia': {
        name: 'Латвия',
        code: 'LV',
        population: '1.9 млн',
        capital: 'Рига'
    },
    'lithuania': {
        name: 'Литва',
        code: 'LT',
        population: '2.8 млн',
        capital: 'Вильнюс'
    },
    'belarus': {
        name: 'Беларусь',
        code: 'BY',
        population: '9.4 млн',
        capital: 'Минск'
    },
    'moldova': {
        name: 'Молдова',
        code: 'MD',
        population: '2.6 млн',
        capital: 'Кишинёв'
    },
    'romania': {
        name: 'Румыния',
        code: 'RO',
        population: '19.1 млн',
        capital: 'Бухарест'
    },
    'bulgaria': {
        name: 'Болгария',
        code: 'BG',
        population: '6.9 млн',
        capital: 'София'
    },
    'montenegro': {
        name: 'Черногория',
        code: 'ME',
        population: '0.6 млн',
        capital: 'Подгорица'
    },
    'bosnia': {
        name: 'Босния и Герцеговина',
        code: 'BA',
        population: '3.3 млн',
        capital: 'Сараево'
    },
    'slovenia': {
        name: 'Словения',
        code: 'SI',
        population: '2.1 млн',
        capital: 'Любляна'
    },
    'hungary': {
        name: 'Венгрия',
        code: 'HU',
        population: '9.7 млн',
        capital: 'Будапешт'
    },
    'slovakia': {
        name: 'Словакия',
        code: 'SK',
        population: '5.5 млн',
        capital: 'Братислава'
    },
    'luxembourg': {
        name: 'Люксембург',
        code: 'LU',
        population: '0.6 млн',
        capital: 'Люксембург'
    },
    'andorra': {
        name: 'Андорра',
        code: 'AD',
        population: '0.08 млн',
        capital: 'Андорра-ла-Велья'
    },
    'monaco': {
        name: 'Монако',
        code: 'MC',
        population: '0.04 млн',
        capital: 'Монако'
    },
    'wales': {
        name: 'Уэльс',
        code: 'WL',
        population: '3.1 млн',
        capital: 'Кардифф'
    },
    'ireland': {
        name: 'Ирландия',
        code: 'IE',
        population: '5.0 млн',
        capital: 'Дублин'
    }
}; 