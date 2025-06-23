const ambassadors = [
    {
        id: 1,
        name: "Александр",
        surname: "Овечкин",
        image: "https://dumpster.cdn.sports.ru/a/ae/e64572bf14b8394adf93c2d271c7d.webp",
        profession: "Хоккеист",
        link: "/hockey/person/alexander-ovechkin/",
        sport: "Хоккей"
    },
    {
        id: 2,
        name: "Игорь",
        surname: "Акинфеев",
        image: "https://dumpster.cdn.sports.ru/a/3a/321c38a558a32752499edf5fb4533.webp",
        profession: "Футболист",
        link: "/football/person/akinfeev/",
        sport: "Футбол"
    },
    {
        id: 3,
        name: "Евгения",
        surname: "Медведева",
        image: "https://dumpster.cdn.sports.ru/9/70/500dbca2e09740c59603a30364fc9.webp",
        profession: "Фигуристка",
        link: "/figure-skating/person/evgenia-medvedeva/",
        sport: "Фигурное катание"
    },
    {
        id: 4,
        name: "Сергей",
        surname: "Пиняев",
        image: "https://dumpster.cdn.sports.ru/e/f0/5b8d8128fdbb4c8cc2a585bdede8e.png",
        profession: "Футболист",
        link: "/football/person/sergey-pinyaev/",
        sport: "Футбол"
    },
    {
        id: 5,
        name: "Роман",
        surname: "Нагучев",
        image: "https://dumpster.cdn.sports.ru/d/09/b848a93779ac4e721c2f5a47b1535.png",
        profession: "Футболист",
        link: "/football/person/roman-nagutchev/",
        sport: "Футбол"
    },
    {
        id: 6,
        name: "Игорь",
        surname: "Карпов",
        image: "https://dumpster.cdn.sports.ru/c/58/e69871f274bd141d99d4588e2438c.png",
        profession: "Хоккеист",
        link: "/tags/161155038/",
        sport: "Хоккей"
    },
    {
        id: 7,
        name: "Мяч",
        surname: "Production",
        image: "https://dumpster.cdn.sports.ru/f/37/add2e3fe3ab8617bacf56bec0782c.png",
        profession: "Блогер",
        link: null,
        sport: "Контент"
    },
    {
        id: 8,
        name: "Strogo",
        surname: "",
        image: "https://dumpster.cdn.sports.ru/6/1d/74510bd19a7d0d028e350652a9046.png",
        profession: "Блогер",
        link: null,
        sport: "Контент"
    },
    {
        id: 9,
        name: "Владимир",
        surname: "Терлецкий",
        image: "https://dumpster.cdn.sports.ru/4/11/2fbf9274c30fbb7f3d8cc65f6c930.png",
        profession: "Комментатор",
        link: "/tags/161137497/",
        sport: "Журналистика"
    },
    {
        id: 10,
        name: "Яна",
        surname: "Ромашкина",
        image: "https://dumpster.cdn.sports.ru/6/13/b0703781eabe3d56cd1acc84127ff.png",
        profession: "Телеведущая",
        link: null,
        sport: "Журналистика"
    },
    {
        id: 11,
        name: "Карен",
        surname: "Адамян",
        image: "https://dumpster.cdn.sports.ru/0/61/e5be1c70cd4f02f1da1d372bc591d.png",
        profession: "Блогер",
        link: null,
        sport: "Контент"
    },
    {
        id: 12,
        name: "Ahrinyan",
        surname: "",
        image: "https://dumpster.cdn.sports.ru/9/7e/49b770d278d99c5d3211bc9f3990d.png",
        profession: "Стример",
        link: null,
        sport: "Киберспорт"
    },
    {
        id: 13,
        name: "Ph3lk1n",
        surname: "",
        image: "https://dumpster.cdn.sports.ru/4/c2/2d42c3b1c147ff3553b6246bb5723.png",
        profession: "Стример",
        link: null,
        sport: "Киберспорт"
    },
    {
        id: 14,
        name: "des0ut",
        surname: "",
        image: "https://dumpster.cdn.sports.ru/4/9e/1a8b6b93477c064cd3aff314bcfb8.png",
        profession: "Стример",
        link: null,
        sport: "Киберспорт"
    },
    {
        id: 15,
        name: "fasoolka",
        surname: "",
        image: "https://dumpster.cdn.sports.ru/6/fc/f53cb505b87a80b7b4584c57c71e1.png",
        profession: "Стример",
        link: null,
        sport: "Киберспорт"
    },
    {
        id: 16,
        name: "iLame",
        surname: "",
        image: "https://dumpster.cdn.sports.ru/5/ff/fdc6e0ba0eb65df9caac49c9ec684.png",
        profession: "Стример",
        link: null,
        sport: "Киберспорт"
    },
    {
        id: 17,
        name: "Александр",
        surname: "Шевченко",
        image: "https://dumpster.cdn.sports.ru/9/93/2abc102318e09c8a7d6ed56e345bc.png",
        profession: "Блогер",
        link: null,
        sport: "Контент"
    },
    {
        id: 18,
        name: "Губиньо",
        surname: "",
        image: "https://dumpster.cdn.sports.ru/0/8e/aa01b315c7f9a92e3bab382f9c88d.png",
        profession: "Блогер",
        link: null,
        sport: "Контент"
    },
    {
        id: 19,
        name: "Рустам",
        surname: "Габдрафиков",
        image: "https://dumpster.cdn.sports.ru/5/3f/7780b056f15c9ab910c32a02e8c01.png",
        profession: "Комментатор",
        link: null,
        sport: "Журналистика"
    },
    {
        id: 20,
        name: "Hockey",
        surname: "Brothers",
        image: "https://dumpster.cdn.sports.ru/4/2a/84d223b47b589f158272236c315cd.png",
        profession: "Блогеры",
        link: null,
        sport: "Контент"
    },
    {
        id: 21,
        name: "Владислав",
        surname: "Колос",
        image: "https://dumpster.cdn.sports.ru/0/52/6aa9a0ea0f5435c112cc86b307412.png",
        profession: "Блогер",
        link: null,
        sport: "Контент"
    }
]; 