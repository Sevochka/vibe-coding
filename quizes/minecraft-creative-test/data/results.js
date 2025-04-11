const results = [
    {
        minScore: 0,
        maxScore: 3,
        title: "Новичок в Майнкрафте",
        description: "Похоже, вы только начинаете свой путь в мире Minecraft. Не переживайте, с каждым днем вы будете узнавать всё больше секретов этого удивительного мира кубов!",
        character: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e3/Villager_Base.png",
        achievement: "Первые шаги"
    },
    {
        minScore: 4,
        maxScore: 6,
        title: "Опытный выживальщик",
        description: "Вы уже неплохо знакомы с миром Minecraft и его основными механиками. Продолжайте исследовать и строить, впереди вас ждёт много интересного!",
        character: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/fc/Steve.png",
        achievement: "Шахтёр"
    },
    {
        minScore: 7,
        maxScore: 9,
        title: "Мастер-строитель",
        description: "Вы отлично знаете мир Minecraft! Ваши знания позволяют вам создавать удивительные сооружения и понимать самые сложные механики игры.",
        character: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/a7/Iron_Golem_JE2_BE2.png",
        achievement: "Архитектор"
    },
    {
        minScore: 10,
        maxScore: 12,
        title: "Легенда Minecraft",
        description: "Вы настоящая легенда Minecraft! Ваши знания об игре просто поразительны. Нотч бы гордился вами! Теперь вы можете преподавать искусство выживания в мире кубов другим игрокам.",
        character: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/4/43/Ender_Dragon.gif",
        achievement: "Покоритель Края"
    }
];

// Достижения для отображения
const achievements = {
    "Первые шаги": {
        icon: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/1/13/Stone_Pickaxe_JE2_BE2.png",
        description: "Сделал первые шаги в мире Minecraft"
    },
    "Шахтёр": {
        icon: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/a7/Diamond_JE2_BE2.png",
        description: "Добыл первый алмаз"
    },
    "Архитектор": {
        icon: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/9d/Enchanting_Table_JE3_BE2.png",
        description: "Построил свою первую зачарованную комнату"
    },
    "Покоритель Края": {
        icon: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e7/Dragon_Egg_JE3_BE2.png",
        description: "Победил дракона края и получил яйцо дракона"
    }
};

// Эффекты частиц для разных блоков
const blockEffects = {
    "grass": {
        color: "#61B04A",
        soundEffect: "dig.grass",
        particles: ["#61B04A", "#866043", "#8B6D54"]
    },
    "wood": {
        color: "#9E7243",
        soundEffect: "dig.wood",
        particles: ["#9E7243", "#7D5A34", "#634830"]
    },
    "stone": {
        color: "#828282",
        soundEffect: "dig.stone",
        particles: ["#828282", "#686868", "#555555"]
    },
    "iron": {
        color: "#D8D8D8",
        soundEffect: "dig.stone",
        particles: ["#D8D8D8", "#BFBFBF", "#A2A2A2"]
    },
    "diamond": {
        color: "#4AEDD9",
        soundEffect: "dig.stone",
        particles: ["#4AEDD9", "#33CEB9", "#20A194"]
    },
    "obsidian": {
        color: "#3B2754",
        soundEffect: "dig.stone",
        particles: ["#3B2754", "#2A1B3C", "#15092A"]
    },
    "netherrack": {
        color: "#843431",
        soundEffect: "dig.stone",
        particles: ["#843431", "#6B2A27", "#531F1D"]
    },
    "endstone": {
        color: "#DBDE9E",
        soundEffect: "dig.stone",
        particles: ["#DBDE9E", "#CCD08F", "#BFC180"]
    },
    "enchanting_table": {
        color: "#372A88",
        soundEffect: "random.orb",
        particles: ["#372A88", "#FC0384", "#1FCECB"]
    },
    "redstone": {
        color: "#FF0000",
        soundEffect: "random.click",
        particles: ["#FF0000", "#D80000", "#BF0000"]
    },
    "bone": {
        color: "#F0F0F0",
        soundEffect: "skeleton.hurt",
        particles: ["#F0F0F0", "#E3E3E3", "#D6D6D6"]
    },
    "furnace": {
        color: "#848484",
        soundEffect: "fire.fire",
        particles: ["#848484", "#FFA500", "#FFFF00"]
    }
}; 