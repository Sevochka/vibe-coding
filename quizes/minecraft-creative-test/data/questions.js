const questions = [
    {
        question: "Какой блок был добавлен в самую первую версию Minecraft?",
        answers: [
            { text: "Земля (Dirt)", correct: false, image: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/c/c1/Dirt.png" },
            { text: "Трава (Grass Block)", correct: true, image: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/7/7a/Grass_Block.png" },
            { text: "Камень (Stone)", correct: false, image: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/c/c4/Stone.png" },
            { text: "Дерево (Oak Log)", correct: false, image: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/8/8b/Oak_Log_%28UD%29_JE5_BE2.png" }
        ],
        blockType: "grass",
        facts: "Блок травы (Grass Block) был одним из первых блоков, появившихся в игре вместе с землей и камнем еще во времена классической версии (Creative)"
    },
    {
        question: "Сколько железных слитков нужно для создания полного комплекта брони?",
        answers: [
            { text: "24 слитка", correct: true },
            { text: "18 слитков", correct: false },
            { text: "27 слитков", correct: false },
            { text: "31 слиток", correct: false }
        ],
        blockType: "iron",
        facts: "Полный комплект железной брони требует 24 железных слитка: шлем (5), нагрудник (8), поножи (7) и ботинки (4)"
    },
    {
        question: "Какой моб в Minecraft самый высокий?",
        answers: [
            { text: "Железный голем", correct: false },
            { text: "Гаст", correct: false },
            { text: "Эндермен", correct: false },
            { text: "Странник Края (Ender Dragon)", correct: true }
        ],
        blockType: "endstone",
        facts: "Странник Края (Ender Dragon) имеет высоту 8 блоков, что делает его самым высоким мобом в игре"
    },
    {
        question: "Какое максимальное количество жизней (сердец) может иметь игрок с эффектами?",
        answers: [
            { text: "10 сердец", correct: false },
            { text: "20 сердец", correct: true },
            { text: "15 сердец", correct: false },
            { text: "25 сердец", correct: false }
        ],
        blockType: "redstone",
        facts: "С помощью зелья здоровья II и золотых яблок игрок может временно увеличить здоровье до 20 сердец"
    },
    {
        question: "Какой материал нужен для активации портала в Нижний мир?",
        answers: [
            { text: "Лава", correct: false },
            { text: "Редстоун", correct: false },
            { text: "Кремень и огниво", correct: true },
            { text: "Алмазы", correct: false }
        ],
        blockType: "obsidian",
        facts: "Портал в Нижний мир создается из обсидиана и активируется с помощью кремня и огнива. Также можно использовать огненное зелье или лавовое ведро"
    },
    {
        question: "Сколько блоков обсидиана требуется для создания портала в Нижний мир минимального размера?",
        answers: [
            { text: "8 блоков", correct: false },
            { text: "10 блоков", correct: true },
            { text: "12 блоков", correct: false },
            { text: "14 блоков", correct: false }
        ],
        blockType: "obsidian",
        facts: "Портал минимального размера требует 10 блоков обсидиана: 4 блока в основании, 4 блока в верхней части и 2 блока по бокам"
    },
    {
        question: "Что произойдет, если поместить ведро с водой в Нижнем мире?",
        answers: [
            { text: "Вода испарится", correct: true },
            { text: "Вода станет лавой", correct: false },
            { text: "Вода будет течь как обычно", correct: false },
            { text: "Вода заморозится", correct: false }
        ],
        blockType: "netherrack",
        facts: "В Нижнем мире вода мгновенно испаряется при размещении, из-за высокой температуры этого измерения"
    },
    {
        question: "Какой предмет нужен для приручения волка?",
        answers: [
            { text: "Сырая свинина", correct: false },
            { text: "Кость", correct: true },
            { text: "Золотое яблоко", correct: false },
            { text: "Морковь", correct: false }
        ],
        blockType: "bone",
        facts: "Волков можно приручить, дав им кости. Количество костей, необходимых для приручения, случайно - от 1 до 6"
    },
    {
        question: "Что НЕ может быть использовано как топливо в печи?",
        answers: [
            { text: "Саженцы деревьев", correct: false },
            { text: "Лава в ведре", correct: false },
            { text: "Алмаз", correct: true },
            { text: "Деревянный меч", correct: false }
        ],
        blockType: "furnace",
        facts: "Несмотря на горючесть угля, дерева и других материалов, алмазы не могут быть использованы как топливо в печи"
    },
    {
        question: "Какое максимальное количество зачарований можно наложить на один предмет?",
        answers: [
            { text: "3 зачарования", correct: false },
            { text: "5 зачарований", correct: false },
            { text: "7 зачарований", correct: false },
            { text: "Нет фиксированного предела", correct: true }
        ],
        blockType: "enchanting_table",
        facts: "В Minecraft технически нет фиксированного предела количества зачарований на один предмет, хотя практически это ограничено набором совместимых зачарований"
    },
    {
        question: "Сколько всего существует видов деревьев в стандартной версии Minecraft?",
        answers: [
            { text: "5 видов", correct: false },
            { text: "6 видов", correct: false },
            { text: "7 видов", correct: true },
            { text: "9 видов", correct: false }
        ],
        blockType: "wood",
        facts: "В стандартной версии Minecraft существует 7 видов деревьев: дуб, ель, береза, джунглевое дерево, акация, тёмный дуб и мангровое дерево"
    },
    {
        question: "Какой моб имеет способность подбирать блоки и перемещать их?",
        answers: [
            { text: "Эндермен", correct: true },
            { text: "Крипер", correct: false },
            { text: "Зомби", correct: false },
            { text: "Скелет", correct: false }
        ],
        blockType: "endstone",
        facts: "Эндермены - единственные мобы, которые могут поднимать и перемещать определенные блоки в игровом мире"
    }
]; 