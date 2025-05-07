const TEAMS_DATA = {
    // Данные по командам для кэширования и ускорения загрузки
    // Будет дополняться динамически при получении данных
    logos: {
        // Испания
        "real": "https://img.sports.ru/images/26094508/c3/d1/26094508c3d1bbb90fc4a1fb7aaf8a20.png", // Реал Мадрид
        "barcelona": "https://img.sports.ru/images/26183258/51/6c/2618325851bca1a4a0a0f91ce36cf9f4.png", // Барселона
        "atletico": "https://img.sports.ru/images/26184222/8a/b7/2618422274b7aeefd15ed62a4ef4b9bd.png", // Атлетико Мадрид
        "girona": "https://img.sports.ru/images/26252462/28/95/26252462285920c0e079a21c8e5a0e71.png", // Жирона
        
        // Англия
        "man_city": "https://img.sports.ru/images/26183263/78/89/26183263782fd8f18bfdc6d2a57dd2a0.png", // Манчестер Сити
        "arsenal": "https://img.sports.ru/images/26183259/c0/d1/26183259c0d1089a3dd6b4b2fc4bdcb5.png", // Арсенал
        "liverpool": "https://img.sports.ru/images/26183262/20/8e/26183262208e7da75cfc1c0a50e9a6db.png", // Ливерпуль
        "aston_villa": "https://img.sports.ru/images/26183260/46/11/261832604611a52b1fe4c90acaeeea6a.png", // Астон Вилла
        
        // Германия
        "bayern": "https://img.sports.ru/images/26183285/1d/7d/261832851d7de1cea1e6fb53fbbbdb1c.png", // Бавария
        "bayer": "https://img.sports.ru/images/26183286/ca/32/26183286ca32fe2a4f20a58d747682eb.png", // Байер Леверкузен
        "stuttgart": "https://img.sports.ru/images/26183289/bf/19/26183289bf1908ed64e0121fa3af51dd.png", // Штутгарт
        "rb_leipzig": "https://img.sports.ru/images/26183287/82/4c/261832878247ab88d40ae27b0f6eb773.png", // РБ Лейпциг
        
        // Италия
        "inter": "https://img.sports.ru/images/26183277/7e/f5/261832776f5c2bad24ffaaf98ca6a71c.png", // Интер
        "milan": "https://img.sports.ru/images/26183278/ca/9a/26183278ca9a34b69fdab3a24fa8f7b0.png", // Милан
        "juventus": "https://img.sports.ru/images/26183274/d4/d1/26183274d4d13bcf651bec96aeb6cb1e.png", // Ювентус
        "atalanta": "https://img.sports.ru/images/26183279/47/14/26183279471447daedc7ae0a0d642b4f.png", // Аталанта
        
        // Франция
        "psg": "https://img.sports.ru/images/26183328/ff/90/26183328ff90a14a88dce74d90a91fd3.png", // ПСЖ
        "monaco": "https://img.sports.ru/images/26183329/03/e4/26183329034aa1b25f2eb9ac4e071eb7.png", // Монако
        "lille": "https://img.sports.ru/images/26183330/48/a0/261833304820a1dce3ae2e4f0a0b38a3.png", // Лилль
        "brest": "https://img.sports.ru/images/26183331/cf/e3/26183331cfe3f0a6ff74d9e6a9eab9f4.png", // Брест
        
        // Нидерланды
        "psv": "https://img.sports.ru/images/26183315/4d/97/261833154d9770982ccae8c1fb83e5b9.png", // ПСВ
        "feyenoord": "https://img.sports.ru/images/26183317/06/77/26183317067747d0bf8f9f6c31defe7f.png", // Фейеноорд
        
        // Португалия
        "benfica": "https://img.sports.ru/images/26183345/fe/ba/26183345feba15fce3d1fae6ec9ed471.png", // Бенфика
        "sporting": "https://img.sports.ru/images/26183346/78/43/26183346784306f3d5f6d83b9fafced3.png", // Спортинг

        // Другие
        "club_brugge": "https://img.sports.ru/images/26252464/29/4e/262524642948aa1a24fe67eca2025c5f.png", // Брюгге
        "salzburg": "https://img.sports.ru/images/26183294/41/07/26183294410763dc01b4cc1ee6abd8c5.png", // Зальцбург
        "dinamo_zagreb": "https://img.sports.ru/images/26183362/f4/17/26183362f417c8fbd4fbb2a5e6da3f62.png", // Динамо Загреб
        "celtic": "https://img.sports.ru/images/26183293/33/8d/261832933359c03d9e48ce27c881fbd2.png", // Селтик
        "shakhtar": "https://img.sports.ru/images/26183362/ee/11/26183362ee11f2b92fa5ed1cea8fb04e.png", // Шахтер
        "sparta_praha": "https://img.sports.ru/images/26183362/00/91/2618336200913fa84518fa9e72c48a66.png", // Спарта Прага
        "young_boys": "https://img.sports.ru/images/26183362/14/69/2618336214695cb4aeb01a6e69ffccec.png", // Янг Бойз
        "slovan": "https://img.sports.ru/images/26183361/7a/88/261833617ab54a5a9a8eef39d3b81fdc.png", // Слован
        "sturm": "https://img.sports.ru/images/26183362/c5/8c/26183362c58c0f5fb32b8a908ea3f82d.png", // Штурм
        "crvena_zvezda": "https://img.sports.ru/images/26183361/a8/8a/26183361a837bb3f6ba62fc55538e41a.png", // Црвена Звезда
        "bologna": "https://img.sports.ru/images/26183276/25/ea/261832762548bd68c1ed83c36f1ddcdf.png", // Болонья
        "steaua": "https://img.sports.ru/images/26183362/be/86/26183362be86e2bef4f66499dbf3e5d1.png" // Стяуа
    }
}; 