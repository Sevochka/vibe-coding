// Демо-данные на несколько дней для 3 привычек
// Формат дня: 0 - пропущено, 1 - выполнено, 2 - пропуск (не ломает серию)
(function(){
  const today = new Date();
  const days = 14;
  function shift(n){ const d = new Date(today); d.setDate(d.getDate() - n); return d.toISOString().slice(0,10); }

  function buildSeries(pattern){
    const res = [];
    for (let i = days - 1; i >= 0; i--) {
      res.push(pattern[(days - 1 - i) % pattern.length]);
    }
    return res.map(v => ({ date: shift(i--), value: v }));
  }

  function seriesFrom(values){
    const arr = [];
    for (let i = days - 1; i >= 0; i--) {
      const v = values[days - 1 - i] ?? 0;
      const d = new Date(today); d.setDate(d.getDate() - i);
      arr.push({ date: d.toISOString().slice(0,10), value: v });
    }
    return arr;
  }

  const s1 = seriesFrom([1,1,2,1,0,1,1,1,2,1,1,1,1,1]);
  const s2 = seriesFrom([0,1,0,2,1,0,0,1,2,1,0,1,1,1]);
  const s3 = seriesFrom([1,1,1,1,1,2,2,1,1,1,0,1,1,1]);

  window.SEED_HABITS = [
    { id: crypto?.randomUUID ? crypto.randomUUID() : 'h1', name: 'Растяжка 5 минут', color: '#00c78b', days: s1 },
    { id: crypto?.randomUUID ? crypto.randomUUID() : 'h2', name: 'Вода 2 стакана утром', color: '#235bff', days: s2 },
    { id: crypto?.randomUUID ? crypto.randomUUID() : 'h3', name: 'Планка 60 секунд', color: '#ffc300', days: s3 },
  ];
})();

