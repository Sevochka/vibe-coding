/**
 * Инициализация виджета матчей Лиги чемпионов
 */
document.addEventListener('DOMContentLoaded', () => {
    const loadingElement = document.getElementById('loading');
    const matchesListElement = document.getElementById('matches-list');

    // Загрузка и отображение матчей
    loadMatches();

    /**
     * Загружает матчи и отображает их на странице
     */
    async function loadMatches() {
        try {
            // Показываем индикатор загрузки
            loadingElement.style.display = 'flex';
            matchesListElement.style.display = 'none';

            // Загружаем матчи
            const matches = await fetchChampionsLeagueMatches();

            // Проверяем, есть ли матчи
            if (matches.length === 0) {
                showError('Нет запланированных матчей для отображения');
                return;
            }

            // Отображаем матчи на странице
            displayMatches(matches);
        } catch (error) {
            // В случае ошибки показываем сообщение
            showError(`Не удалось загрузить матчи: ${error.message}`);
        } finally {
            // Скрываем индикатор загрузки
            loadingElement.style.display = 'none';
            matchesListElement.style.display = 'flex';
        }
    }

    /**
     * Отображает матчи на странице
     * @param {Array} matches - Массив матчей для отображения
     */
    function displayMatches(matches) {
        // Очищаем контейнер
        matchesListElement.innerHTML = '';

        // Создаем HTML для каждого матча и добавляем в контейнер
        matches.forEach(match => {
            const matchCardHTML = createMatchCard(match);
            matchesListElement.innerHTML += matchCardHTML;
        });

        // Вызываем resize для изменения высоты iframe
        if (typeof resize === 'function') {
            resize();
        }
    }

    /**
     * Показывает сообщение об ошибке
     * @param {string} message - Текст сообщения об ошибке
     */
    function showError(message) {
        matchesListElement.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
        matchesListElement.style.display = 'block';

        // Вызываем resize для изменения высоты iframe
        if (typeof resize === 'function') {
            resize();
        }
    }
}); 