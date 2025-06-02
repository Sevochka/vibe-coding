document.addEventListener('DOMContentLoaded', () => {
    // Получаем доступ к элементам формы
    const betAmountInput = document.getElementById('bet-amount');
    const coefficientInput = document.getElementById('coefficient');
    const potentialWinInput = document.getElementById('potential-win');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Функция для расчета потенциального выигрыша
    const calculatePotentialWin = () => {
        const betAmount = parseFloat(betAmountInput.value);
        const coefficient = parseFloat(coefficientInput.value);

        // Проверка валидности ввода
        if (isNaN(betAmount) || isNaN(coefficient)) {
            potentialWinInput.value = 'Введите корректные значения';
            return;
        }

        if (betAmount <= 0) {
            potentialWinInput.value = 'Сумма ставки должна быть больше 0';
            return;
        }

        if (coefficient < 1) {
            potentialWinInput.value = 'Коэффициент должен быть не менее 1';
            return;
        }

        // Расчет потенциального выигрыша
        const potentialWin = betAmount * coefficient;
        
        // Форматирование результата с разделителями тысяч и двумя знаками после запятой
        potentialWinInput.value = new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(potentialWin);
    };

    // Функция для сброса формы
    const resetForm = () => {
        betAmountInput.value = '';
        coefficientInput.value = '';
        potentialWinInput.value = '';
    };

    // Обработчики событий
    calculateBtn.addEventListener('click', calculatePotentialWin);
    resetBtn.addEventListener('click', resetForm);

    // Вычисление при нажатии Enter
    betAmountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculatePotentialWin();
        }
    });

    coefficientInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculatePotentialWin();
        }
    });

    // Автоматический пересчет при изменении значений
    betAmountInput.addEventListener('input', calculatePotentialWin);
    coefficientInput.addEventListener('input', calculatePotentialWin);
}); 