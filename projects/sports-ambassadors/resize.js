const resize = () => {
    const dataUTILS = {
        for: 'BASIC_TEST',
        action: 'resizeIframe',
        selector: `iframe[src*=\\/projects\\/sports-ambassadors]`,
        sizes: {
            height: 2 * Math.floor(document.body.scrollHeight / 2) + 10,
        },
    };

    window?.top?.postMessage(JSON.stringify(dataUTILS), '*');
}

const resizeObserver = new ResizeObserver(() => {
    resize();
});

resizeObserver.observe(document.body);
resize(); 