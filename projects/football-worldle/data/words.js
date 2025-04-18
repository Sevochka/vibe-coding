const gameWords = {
  // Уровень новичка - простые футбольные термины
  beginner: [
    "ГОЛ", "МЯЧ", "ПАС", "АУТ", "МАТЧ", "ТАЙМ", "ИГРА", "ПОЛЕ", 
    "УДАР", "СЧЕТ", "ФОРА", "ФИНТ", "СЫСК", "ТЕМП", "НОЖКА", "ТРАВА",
    "СУДЬЯ", "СВИСТ", "ВОРОТ", "КУБОК", "СЕТКА"
  ],
  
  // Средний уровень - игроки и команды
  intermediate: [
    "ЗЕНИТ", "ЦСКА", "СПАРТАК", "РОСТОВ", "ЛОКО", "РУБИН", "ДИНАМО", "КРЫЛЬЯ",
    "МЕССИ", "РОНАЛДУ", "МБАППЕ", "ХОЛАНД", "АКИНФЕЕВ", "ДЗЮБА", "ГИЛЕРМЕ", "МИРАНЧУК",
    "КОКОРИН", "ГЛУШАКОВ", "БЕНЗЕМА", "МОДРИЧ", "НЕЙМАР", "ЛЕВАНДОВСКИ"
  ],
  
  // Продвинутый уровень - сложные футбольные термины
  advanced: [
    "ОФСАЙД", "ПЕНАЛЬТИ", "ШТРАФНОЙ", "ПОДКАТ", "ПРЕССИНГ", "ПЕРЕДАЧА", "ФЛАНГ", "ПОДБОР",
    "КОНТРАТАКА", "НАВЕС", "ДРИБЛИНГ", "ПЕРСОНАЛ", "БЛОКИРОВКА", "ДИСКВАЛИФИКАЦИЯ",
    "ТАКТИКА", "ЗАМЕНА", "ЖЕЛТАЯ", "КРАСНАЯ", "СТАДИОН", "ТРИБУНА"
  ],
  
  // Легендарный уровень - легенды футбола и сложные термины
  legendary: [
    "ЯШИН", "ПЕЛЕ", "МАРАДОНА", "БЕККЕНБАУЭР", "ПЛАТИНИ", "КРУИФФ", "БУФФОН",
    "РОНАЛЬДИНЬО", "ЗИДАН", "КАСИЛЬЯС", "ХАВИ", "ИНЬЕСТА", "РИКЕЛЬМЕ", 
    "КАНТОНА", "БЭЙЛ", "МАКЕЛЕЛЕ", "ФЕРГЮСОН", "ВИЛЛАШ-БОАШ", "МОУРИНЬЮ", "ГВАРДИОЛА"
  ],
  
  // Слова для тематического режима "День чемпионов"
  champions: [
    "ФРАНЦИЯ", "ИТАЛИЯ", "БРАЗИЛИЯ", "ГЕРМАНИЯ", "АРГЕНТИНА", "ИСПАНИЯ", "УРУГВАЙ", "АНГЛИЯ",
    "РОНАЛДУ", "ГЕТЦЕ", "ЗИДАН", "ИНЬЕСТА", "БЕРГКАМП", "МАРАДОНА", "РАМОС", "РАУЛЬ",
    "РИКАРДО", "ПЛАТИНИ", "РОНАЛЬДИНЬО", "РИВАЛДО", "ФАЛЬКАО", "ПЕЛЕ"
  ],
  
  // Слова для тематического режима "День трансферов"
  transfers: [
    "НЕЙМАР", "МБАППЕ", "ПОГБА", "РОНАЛДУ", "АЗАР", "ГРИЗМАНН", "ЛУКАКУ", "ТЕВЕС",
    "ПСЖ", "РЕАЛ", "БАРСА", "ЮВЕНТУС", "ЧЕЛСИ", "СИТИ", "БАВАРИЯ", "БОРУССИЯ",
    "АТЛЕТИКО", "МИЛАН", "ИНТЕР", "ЛИВЕРПУЛЬ", "АРСЕНАЛ", "ЮНАЙТЕД"
  ],
  
  // Слова для тематического режима "День стадионов"
  stadiums: [
    "КАМП НОУ", "УЭМБЛИ", "ЭНФИЛД", "САНТЬЯГО", "ОЛИМПИКО", "ДУБАЙ", "ЛУЖНИКИ", "ФИШТ",
    "ГАЗПРОМ", "ПАРК", "САН-СИРО", "АЛЬЯНЦ", "ЭМИРЕЙТС", "ПЕТРОВСКИЙ", "МАРАКАНА",
    "МЕСТАЛЬЯ", "ИПСВИЧ", "ДОНБАСС", "БОЛАНЬО", "ВИСЕНТЕ"
  ]
};

// Описания уровней сложности
const difficultyLevels = [
  { name: "Аматор", points: 0, description: "Новичок в футбольном мире" },
  { name: "Болельщик", points: 200, description: "Следит за играми и знает основы" },
  { name: "Любитель", points: 500, description: "Хорошо понимает футбол" },
  { name: "Профессионал", points: 1000, description: "Мог бы стать футбольным аналитиком" },
  { name: "Футбольный эксперт", points: 2000, description: "Энциклопедия футбольных знаний" },
  { name: "Легенда", points: 3500, description: "Ваш футбольный интеллект поражает!" }
];

// Достижения игрока
const achievements = [
  { id: "first_goal", name: "Первый гол", description: "Отгадано первое слово", icon: "⚽" },
  { id: "hat_trick", name: "Хет-трик", description: "Три слова подряд без ошибок", icon: "🎩" },
  { id: "clean_sheet", name: "Сухой матч", description: "Слово угадано без единой ошибки", icon: "🧤" },
  { id: "super_save", name: "Супер сейв", description: "Угадано слово на последней попытке", icon: "🦸‍♂️" },
  { id: "free_kick", name: "Штрафной удар", description: "Использована подсказка", icon: "🎯" },
  { id: "champions_league", name: "Лига Чемпионов", description: "Набрано 500 очков", icon: "🏆" },
  { id: "golden_boot", name: "Золотая бутса", description: "Отгадано 10 слов подряд", icon: "👞" },
  { id: "ball_control", name: "Контроль мяча", description: "5 слов без использования подсказок", icon: "🔄" },
  { id: "golden_ball", name: "Золотой мяч", description: "Достигнут уровень Легенды", icon: "🌟" }
];

// Тактические подсказки
const tacticalHints = {
  farLetter: [
    "Твой нападающий устал!",
    "Пас неточный!",
    "Мяч улетел на трибуны!",
    "Далеко от ворот!",
    "Защитник перехватил передачу!"
  ],
  closeLetter: [
    "Игрок близок к воротам!",
    "Мяч у штанги!",
    "Опасный момент!",
    "Вратарь в напряжении!",
    "Голевая позиция!"
  ],
  correctLetter: [
    "ГОООООЛ!!!",
    "Мяч в сетке!",
    "Великолепный удар!",
    "Вратарь бессилен!",
    "Трибуны ликуют!"
  ]
}; 