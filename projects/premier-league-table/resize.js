// Название проекта из пути
const projectSlug = 'premier-league-table';

// Функция изменения размера iframe
const resize = () => {
    const dataUTILS = {
        for: 'BASIC_TEST',
        action: 'resizeIframe',
        selector: `iframe[src*=\\/projects\\/${projectSlug}]`,
        sizes: {
            height: 2 * Math.floor(document.body.scrollHeight / 2) + 10,
        },
    };

    window?.top?.postMessage(JSON.stringify(dataUTILS), '*');
};

// Наблюдатель за изменением размеров
const resizeObserver = new ResizeObserver(() => {
    resize();
});
resizeObserver.observe(document.body);
resize(); 