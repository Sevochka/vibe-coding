const resize = () => {
      const dataUTILS = {
        for: 'BASIC_TEST',
        action: 'resizeIframe',
				selector: `iframe[src*="/projects/football-prediction-contest"]`,
        sizes: {
          height: document.body.scrollHeight,
        },
      };

      window?.top?.postMessage(JSON.stringify(dataUTILS), '*');
    }

const resizeObserver = new ResizeObserver(() => {
  resize();
});
resizeObserver.observe(document.body);
resize(); 

setTimeout(() => {
  resize();
}, 100);
setTimeout(() => {
  resize();
}, 300);
setTimeout(() => {
  resize();
}, 500);
setTimeout(() => {
  resize();
}, 1000);
setTimeout(() => {
  resize();
}, 2000);
setTimeout(() => {
  resize();
}, 5000); 