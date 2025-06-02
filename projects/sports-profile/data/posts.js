const postsData = [
    {
        id: 2768986,
        date: "2020-04-26T10:00:00+03:00",
        dateFormatted: "26 апреля 2020 10:00",
        blogName: "Спортивные тесты",
        blogSlug: "sportstests",
        title: "Суперсложный тест: узнаете фигуристов по размытым фото на льду?",
        description: "Слишком быстрые для кадра.",
        image: "https://photobooth.cdn.sports.ru/preset/post/a/a2/600c2e5a245db8fe43df27fd5c700.jpeg",
        authors: ["Максим Полтавец", "Мария Величко"],
        link: "/figure-skating/blogs/2768986.html",
        rating: {
            positive: 119,
            negative: 21,
            total: 98
        },
        comments: 66,
        tags: ["фигурное катание", "тест", "фото"]
    },
    {
        id: 2318644,
        date: "2019-01-22T10:21:00+03:00",
        dateFormatted: "22 января 2019 10:21",
        blogName: "Под прицелом",
        blogSlug: "russiateam",
        title: "Не потеряли Липницкую? Она на льду спустя два года – уже каталась под Билана",
        description: "И выступала в шоу Плющенко.",
        image: "https://photobooth.cdn.sports.ru/preset/post/c/68/2ee120263486fb61837088206ad29.jpeg",
        authors: ["Мария Величко"],
        link: "/figure-skating/blogs/2318644.html",
        rating: {
            positive: 189,
            negative: 81,
            total: 108
        },
        comments: 129,
        tags: ["Юлия Липницкая", "фигурное катание", "возвращение"]
    },
    {
        id: 2288837,
        date: "2018-12-22T20:05:00+03:00",
        dateFormatted: "22 декабря 2018 20:05",
        blogName: "Под прицелом",
        blogSlug: "russiateam",
        title: "Все говорят, что сезон для Медведевой закончен. Нет, она может выступить даже на ЧМ",
        description: "Расклады для ледовой звезды.",
        image: "https://photobooth.cdn.sports.ru/preset/post/7/82/4f162732c4bd3addbf2edce6111b9.jpeg",
        authors: ["Павел Копачев", "Мария Величко", "Алексей Авдохин"],
        link: "/figure-skating/blogs/2288837.html",
        rating: {
            positive: 103,
            negative: 72,
            total: 31
        },
        comments: 186,
        tags: ["Евгения Медведева", "чемпионат мира", "прогноз"]
    },
    {
        id: 2156734,
        date: "2018-11-15T14:30:00+03:00",
        dateFormatted: "15 ноября 2018 14:30",
        blogName: "Под прицелом",
        blogSlug: "russiateam",
        title: "Загитова против Медведевой: главное противостояние сезона",
        description: "Анализ программ и шансов на успех.",
        image: "https://photobooth.cdn.sports.ru/preset/post/d/45/1234567890abcdef1234567890abcdef.jpeg",
        authors: ["Мария Величко"],
        link: "/figure-skating/blogs/2156734.html",
        rating: {
            positive: 245,
            negative: 43,
            total: 202
        },
        comments: 312,
        tags: ["Алина Загитова", "Евгения Медведева", "соперничество"]
    },
    {
        id: 2089123,
        date: "2018-10-08T16:45:00+03:00",
        dateFormatted: "8 октября 2018 16:45",
        blogName: "Фигура речи",
        blogSlug: "figura_rechi",
        title: "Новые правила в фигурном катании: что изменилось",
        description: "Подробный разбор всех нововведений сезона.",
        image: "https://photobooth.cdn.sports.ru/preset/post/e/78/9876543210fedcba0987654321fedcba.jpeg",
        authors: ["Мария Величко"],
        link: "/figure-skating/blogs/2089123.html",
        rating: {
            positive: 87,
            negative: 12,
            total: 75
        },
        comments: 94,
        tags: ["правила", "нововведения", "сезон 2018-19"]
    }
];

// Данные подписок
const subscriptionsData = [
    {
        id: 1,
        type: "blog",
        name: "Блог кота Ученого",
        slug: "kot_ucheny",
        description: "Умные мысли о спорте",
        image: "https://photobooth.cdn.sports.ru/preset/blog/kot.jpg",
        postsCount: 156,
        subscribersCount: 2340
    },
    {
        id: 2,
        type: "blog", 
        name: "Матрица фигурного катания",
        slug: "thematrix",
        description: "Глубокая аналитика",
        image: "https://photobooth.cdn.sports.ru/preset/blog/matrix.jpg",
        postsCount: 89,
        subscribersCount: 1875
    },
    {
        id: 3,
        type: "tag",
        name: "фигурное катание",
        postsCount: 15420
    },
    {
        id: 4,
        type: "tag",
        name: "Евгения Медведева",
        postsCount: 3421
    },
    {
        id: 5,
        type: "user",
        username: "Алексей Авдохин",
        slug: "aleksey_avdohin",
        avatar: "https://photobooth.cdn.sports.ru/preset/user/avdohin.jpg",
        postsCount: 234,
        commentsCount: 1876
    }
];

// Данные подписчиков
const followersData = [
    {
        id: 1116589614,
        username: "Der Olfc",
        slug: "der_olfc",
        avatar: "https://photobooth.cdn.sports.ru/preset/blank_icons/user.png",
        badge: "новичок",
        postsCount: 5,
        commentsCount: 47
    },
    {
        id: 1080651786,
        username: "Павел Мельников",
        slug: "pavel_melnikov",
        avatar: "https://photobooth.cdn.sports.ru/preset/blank_icons/user.png",
        badge: "активист",
        postsCount: 23,
        commentsCount: 189
    },
    {
        id: 146485185,
        username: "Лёша Лёша",
        slug: "lesha_lesha",
        avatar: "https://photobooth.cdn.sports.ru/preset/blank_icons/user.png",
        badge: "эксперт",
        postsCount: 67,
        commentsCount: 532
    },
    {
        id: 1077840044,
        username: "zaza burduladze",
        slug: "zaza_burduladze",
        avatar: "https://photobooth.cdn.sports.ru/preset/blank_icons/user.png",
        badge: "новичок",
        postsCount: 2,
        commentsCount: 28
    },
    {
        id: 1100791172,
        username: "Evtyshenko7",
        slug: "evtyshenko7",
        avatar: "https://photobooth.cdn.sports.ru/preset/blank_icons/user.png",
        badge: "активист",
        postsCount: 18,
        commentsCount: 145
    }
]; 