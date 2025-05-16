document.addEventListener('DOMContentLoaded', () => {
  // Инициализация переменных
  let filteredCountries = [...countriesData];
  let currentSort = { field: 'rank', direction: 'asc' };
  let currentFilter = 'all';
  let currentSearch = '';

  // DOM-элементы
  const tableBody = document.getElementById('ranking-table-body');
  const confederationFilter = document.getElementById('confederation-filter');
  const searchInput = document.getElementById('search-input');
  const sortableHeaders = document.querySelectorAll('th.sortable');

  // Функция для отображения данных в таблице
  const renderTable = () => {
    // Фильтрация по конфедерации
    filteredCountries = [...countriesData];
    
    if (currentFilter !== 'all') {
      filteredCountries = filteredCountries.filter(country => 
        country.confederation === currentFilter
      );
    }
    
    // Фильтрация по поиску
    if (currentSearch) {
      const searchLower = currentSearch.toLowerCase();
      filteredCountries = filteredCountries.filter(country => 
        country.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Сортировка данных
    filteredCountries.sort((a, b) => {
      const fieldA = a[currentSort.field];
      const fieldB = b[currentSort.field];
      
      // Особая сортировка для change (изменения рейтинга)
      if (currentSort.field === 'change') {
        return currentSort.direction === 'asc' 
          ? fieldA - fieldB 
          : fieldB - fieldA;
      }
      
      // Сортировка для текстовых полей
      if (typeof fieldA === 'string') {
        return currentSort.direction === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      
      // Сортировка для числовых полей
      return currentSort.direction === 'asc'
        ? fieldA - fieldB
        : fieldB - fieldA;
    });
    
    // Очистка таблицы
    tableBody.innerHTML = '';
    
    // Заполнение таблицы данными
    filteredCountries.forEach(country => {
      const row = document.createElement('tr');
      
      // Определение классов для изменения рейтинга
      let changeClass = 'ranking-table__change-same';
      let changeSign = '';
      
      if (country.change > 0) {
        changeClass = 'ranking-table__change-up';
        changeSign = '+';
      } else if (country.change < 0) {
        changeClass = 'ranking-table__change-down';
      }
      
      // Формирование содержимого строки
      row.innerHTML = `
        <td class="ranking-table__rank">${country.rank}</td>
        <td class="ranking-table__country">
          <img src="https://flagcdn.com/w20/${country.flagCode.toLowerCase()}.png" 
               alt="${country.name}" 
               class="ranking-table__flag">
          ${country.name}
        </td>
        <td class="ranking-table__points">${country.points}</td>
        <td class="ranking-table__change ${changeClass}">${changeSign}${country.change}</td>
        <td class="ranking-table__confederation">${country.confederation}</td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Обновление заголовков сортировки
    updateSortHeaders();
  };
  
  // Обновление классов заголовков для отображения текущей сортировки
  const updateSortHeaders = () => {
    sortableHeaders.forEach(header => {
      const field = header.dataset.sort;
      
      // Удаляем все классы сортировки
      header.classList.remove('asc', 'desc');
      
      // Добавляем класс текущей сортировки
      if (field === currentSort.field) {
        header.classList.add(currentSort.direction);
      }
    });
  };
  
  // Обработчик изменения фильтра конфедерации
  confederationFilter.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    renderTable();
  });
  
  // Обработчик поиска
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    renderTable();
  });
  
  // Обработчик сортировки при клике на заголовок
  sortableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const field = header.dataset.sort;
      
      // Если кликнули на тот же столбец, меняем направление сортировки
      if (field === currentSort.field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        // Иначе устанавливаем новый столбец для сортировки с направлением по умолчанию
        currentSort.field = field;
        currentSort.direction = 'asc';
      }
      
      renderTable();
    });
  });
  
  // Инициализация таблицы при загрузке страницы
  renderTable();
}); 