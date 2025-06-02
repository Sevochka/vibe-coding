document.addEventListener('DOMContentLoaded', () => {
  // Инициализация переменных
  let currentView = 'countries'; // Текущий вид рейтинга: countries или clubs
  
  // Countries view variables
  let filteredCountries = [...countriesData];
  let countriesSort = { field: 'rank', direction: 'asc' };
  let countriesFilter = 'all';
  let countriesSearch = '';
  
  // Clubs view variables
  let filteredClubs = [...clubsData];
  let clubsSort = { field: 'rank', direction: 'asc' };
  let clubsFilter = 'all';
  let clubsSearch = '';

  // DOM-элементы
  const countriesTab = document.getElementById('countries-tab');
  const clubsTab = document.getElementById('clubs-tab');
  
  const countriesFilters = document.getElementById('countries-filters');
  const clubsFilters = document.getElementById('clubs-filters');
  
  const countriesTableContainer = document.getElementById('countries-table-container');
  const clubsTableContainer = document.getElementById('clubs-table-container');
  
  const countriesInfo = document.getElementById('countries-info');
  const clubsInfo = document.getElementById('clubs-info');
  
  const countriesTableBody = document.getElementById('ranking-table-body');
  const clubsTableBody = document.getElementById('clubs-table-body');
  
  const confederationFilter = document.getElementById('confederation-filter');
  const countryFilter = document.getElementById('country-filter');
  
  const searchInput = document.getElementById('search-input');
  const countryHeaders = countriesTableContainer.querySelectorAll('th.sortable');
  const clubHeaders = clubsTableContainer.querySelectorAll('th.sortable');
  
  // Функция переключения между видами
  const switchView = (view) => {
    currentView = view;
    
    // Обновление активных классов табов
    if (view === 'countries') {
      countriesTab.classList.add('tabs__btn--active');
      clubsTab.classList.remove('tabs__btn--active');
      
      countriesFilters.style.display = 'flex';
      clubsFilters.style.display = 'none';
      
      countriesTableContainer.style.display = 'block';
      clubsTableContainer.style.display = 'none';
      
      countriesInfo.style.display = 'block';
      clubsInfo.style.display = 'none';
      
      searchInput.placeholder = 'Поиск сборной...';
      renderCountriesTable();
    } else {
      countriesTab.classList.remove('tabs__btn--active');
      clubsTab.classList.add('tabs__btn--active');
      
      countriesFilters.style.display = 'none';
      clubsFilters.style.display = 'flex';
      
      countriesTableContainer.style.display = 'none';
      clubsTableContainer.style.display = 'block';
      
      countriesInfo.style.display = 'none';
      clubsInfo.style.display = 'block';
      
      searchInput.placeholder = 'Поиск клуба...';
      renderClubsTable();
    }
  };
  
  // Функция для отображения данных в таблице сборных
  const renderCountriesTable = () => {
    // Фильтрация по конфедерации
    filteredCountries = [...countriesData];
    
    if (countriesFilter !== 'all') {
      filteredCountries = filteredCountries.filter(country => 
        country.confederation === countriesFilter
      );
    }
    
    // Фильтрация по поиску
    if (countriesSearch) {
      const searchLower = countriesSearch.toLowerCase();
      filteredCountries = filteredCountries.filter(country => 
        country.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Сортировка данных
    filteredCountries.sort((a, b) => {
      const fieldA = a[countriesSort.field];
      const fieldB = b[countriesSort.field];
      
      // Особая сортировка для change (изменения рейтинга)
      if (countriesSort.field === 'change') {
        return countriesSort.direction === 'asc' 
          ? fieldA - fieldB 
          : fieldB - fieldA;
      }
      
      // Сортировка для текстовых полей
      if (typeof fieldA === 'string') {
        return countriesSort.direction === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      
      // Сортировка для числовых полей
      return countriesSort.direction === 'asc'
        ? fieldA - fieldB
        : fieldB - fieldA;
    });
    
    // Очистка таблицы
    countriesTableBody.innerHTML = '';
    
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
      
      countriesTableBody.appendChild(row);
    });
    
    // Обновление заголовков сортировки
    updateSortHeaders(countryHeaders, countriesSort);
  };
  
  // Функция для отображения данных в таблице клубов
  const renderClubsTable = () => {
    // Фильтрация по стране
    filteredClubs = [...clubsData];
    
    if (clubsFilter !== 'all') {
      filteredClubs = filteredClubs.filter(club => 
        club.flagCode === clubsFilter
      );
    }
    
    // Фильтрация по поиску
    if (clubsSearch) {
      const searchLower = clubsSearch.toLowerCase();
      filteredClubs = filteredClubs.filter(club => 
        club.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Сортировка данных
    filteredClubs.sort((a, b) => {
      const fieldA = a[clubsSort.field];
      const fieldB = b[clubsSort.field];
      
      // Особая сортировка для change (изменения рейтинга)
      if (clubsSort.field === 'change') {
        return clubsSort.direction === 'asc' 
          ? fieldA - fieldB 
          : fieldB - fieldA;
      }
      
      // Сортировка для текстовых полей
      if (typeof fieldA === 'string') {
        return clubsSort.direction === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      
      // Сортировка для числовых полей
      return clubsSort.direction === 'asc'
        ? fieldA - fieldB
        : fieldB - fieldA;
    });
    
    // Очистка таблицы
    clubsTableBody.innerHTML = '';
    
    // Заполнение таблицы данными
    filteredClubs.forEach(club => {
      const row = document.createElement('tr');
      
      // Определение классов для изменения рейтинга
      let changeClass = 'ranking-table__change-same';
      let changeSign = '';
      
      if (club.change > 0) {
        changeClass = 'ranking-table__change-up';
        changeSign = '+';
      } else if (club.change < 0) {
        changeClass = 'ranking-table__change-down';
      }
      
      // Формирование содержимого строки
      row.innerHTML = `
        <td class="ranking-table__rank">${club.rank}</td>
        <td class="ranking-table__country">
          <img src="https://flagcdn.com/w20/${club.flagCode.toLowerCase()}.png" 
               alt="${club.country}" 
               class="ranking-table__flag">
          ${club.name}
        </td>
        <td>${club.country}</td>
        <td class="ranking-table__points">${club.points.toFixed(3)}</td>
        <td class="ranking-table__change ${changeClass}">${changeSign}${club.change.toFixed(3)}</td>
      `;
      
      clubsTableBody.appendChild(row);
    });
    
    // Обновление заголовков сортировки
    updateSortHeaders(clubHeaders, clubsSort);
  };
  
  // Обновление классов заголовков для отображения текущей сортировки
  const updateSortHeaders = (headers, sortState) => {
    headers.forEach(header => {
      const field = header.dataset.sort;
      
      // Удаляем все классы сортировки
      header.classList.remove('asc', 'desc');
      
      // Добавляем класс текущей сортировки
      if (field === sortState.field) {
        header.classList.add(sortState.direction);
      }
    });
  };
  
  // Обработчики событий
  
  // Переключение табов
  countriesTab.addEventListener('click', () => switchView('countries'));
  clubsTab.addEventListener('click', () => switchView('clubs'));
  
  // Обработчик изменения фильтра конфедерации
  confederationFilter.addEventListener('change', (e) => {
    countriesFilter = e.target.value;
    renderCountriesTable();
  });
  
  // Обработчик изменения фильтра страны
  countryFilter.addEventListener('change', (e) => {
    clubsFilter = e.target.value;
    renderClubsTable();
  });
  
  // Обработчик поиска
  searchInput.addEventListener('input', (e) => {
    const searchValue = e.target.value.trim();
    
    if (currentView === 'countries') {
      countriesSearch = searchValue;
      renderCountriesTable();
    } else {
      clubsSearch = searchValue;
      renderClubsTable();
    }
  });
  
  // Обработчик сортировки для сборных
  countryHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const field = header.dataset.sort;
      
      // Если кликнули на тот же столбец, меняем направление сортировки
      if (field === countriesSort.field) {
        countriesSort.direction = countriesSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        // Иначе устанавливаем новый столбец для сортировки с направлением по умолчанию
        countriesSort.field = field;
        countriesSort.direction = 'asc';
      }
      
      renderCountriesTable();
    });
  });
  
  // Обработчик сортировки для клубов
  clubHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const field = header.dataset.sort;
      
      // Если кликнули на тот же столбец, меняем направление сортировки
      if (field === clubsSort.field) {
        clubsSort.direction = clubsSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        // Иначе устанавливаем новый столбец для сортировки с направлением по умолчанию
        clubsSort.field = field;
        clubsSort.direction = 'asc';
      }
      
      renderClubsTable();
    });
  });
  
  // Инициализация первоначального вида
  switchView('countries');
}); 