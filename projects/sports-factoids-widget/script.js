document.addEventListener('DOMContentLoaded', function() {
    let currentFactoidIndex = 0;
    let additionalFactsShown = false;
    
    function renderFactoids() {
        const factoidsList = document.getElementById('factoidsList');
        factoidsList.innerHTML = '';
        
        factoidsData.forEach((factoid, index) => {
            const factoidElement = createFactoidElement(factoid, index);
            factoidsList.appendChild(factoidElement);
            
            // Анимация появления
            setTimeout(() => {
                factoidElement.style.opacity = '1';
                factoidElement.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    function createFactoidElement(factoid, index) {
        const factoidDiv = document.createElement('div');
        factoidDiv.className = 'factoid-item';
        factoidDiv.style.opacity = '0';
        factoidDiv.style.transform = 'translateY(20px)';
        factoidDiv.style.transition = 'all 0.5s ease';
        
        const teamsHtml = factoid.teams.length === 2 
            ? `
                <img src="${factoid.teams[0].logo}" alt="${factoid.teams[0].name}" class="team-logo">
                <span class="vs-text">VS</span>
                <img src="${factoid.teams[1].logo}" alt="${factoid.teams[1].name}" class="team-logo">
            `
            : `
                <img src="${factoid.teams[0].logo}" alt="${factoid.teams[0].name}" class="team-logo">
            `;
        
        factoidDiv.innerHTML = `
            <div class="factoid-main">
                <div class="factoid-teams">
                    ${teamsHtml}
                </div>
                <div class="factoid-text">${factoid.text}</div>
            </div>
            <div class="factoid-betting">
                <img src="${factoid.betting.logo}" alt="${factoid.betting.bookmaker}" class="betting-logo">
                <div class="betting-info">
                    <div class="betting-text">${factoid.betting.text}</div>
                </div>
                <div class="betting-right">
                    <div class="betting-coefficient">${factoid.betting.coefficient}</div>
                    <a href="${factoid.betting.link}" class="betting-button" target="_blank">Поставить</a>
                </div>
            </div>
        `;
        
        // Добавляем hover эффекты
        factoidDiv.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        factoidDiv.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        return factoidDiv;
    }
    
    function showAdditionalFacts() {
        const factoidsList = document.getElementById('factoidsList');
        
        additionalFacts.forEach((fact, index) => {
            const factDiv = document.createElement('div');
            factDiv.className = 'factoid-item additional-fact';
            factDiv.style.opacity = '0';
            factDiv.style.transform = 'translateY(20px)';
            factDiv.style.transition = 'all 0.5s ease';
            
            factDiv.innerHTML = `
                <div class="factoid-main">
                    <div class="factoid-teams">
                        <span style="font-size: 30px;">${fact.icon}</span>
                    </div>
                    <div class="factoid-text">${fact.text}</div>
                </div>
            `;
            
            factoidsList.appendChild(factDiv);
            
            // Анимированное появление
            setTimeout(() => {
                factDiv.style.opacity = '1';
                factDiv.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    function updateTitle() {
        const titleElement = document.querySelector('.factoids-title span:nth-child(2)');
        const phrases = motivationalPhrases;
        let currentPhrase = 0;
        
        setInterval(() => {
            titleElement.style.opacity = '0';
            setTimeout(() => {
                titleElement.textContent = phrases[currentPhrase];
                titleElement.style.opacity = '1';
                currentPhrase = (currentPhrase + 1) % phrases.length;
            }, 300);
        }, 3000);
    }
    
    function addClickEffects() {
        // Эффект для промо кнопки
        const promoButton = document.getElementById('promoButton');
        promoButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Создаем эффект ripple
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Показываем сообщение
            showPromoMessage();
        });
        
        // Эффект для кнопки "Больше фактов"
        const moreFactsBtn = document.getElementById('moreFactsBtn');
        moreFactsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!additionalFactsShown) {
                showAdditionalFacts();
                this.innerHTML = `
                    <span class="btn-icon">✅</span>
                    <span>Показаны все факты</span>
                    <span class="btn-shimmer"></span>
                `;
                this.style.background = 'linear-gradient(135deg, var(--sports-primary-color) 0%, var(--sports-green-850) 100%)';
                additionalFactsShown = true;
            } else {
                // Скрываем дополнительные факты
                const additionalFacts = document.querySelectorAll('.additional-fact');
                additionalFacts.forEach((fact, index) => {
                    setTimeout(() => {
                        fact.style.opacity = '0';
                        fact.style.transform = 'translateY(-20px)';
                        setTimeout(() => fact.remove(), 300);
                    }, index * 100);
                });
                
                setTimeout(() => {
                    this.innerHTML = `
                        <span class="btn-icon">📈</span>
                        <span>Больше фактов</span>
                        <span class="btn-shimmer"></span>
                    `;
                    this.style.background = 'linear-gradient(135deg, var(--sports-yellow-A700) 0%, var(--sports-orange-900) 100%)';
                    additionalFactsShown = false;
                }, 500);
            }
        });
    }
    
    function showPromoMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--sports-primary-color) 0%, var(--sports-cyan-A700) 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-weight: bold;
            font-size: 18px;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0, 199, 139, 0.5);
            animation: messageSlide 0.5s ease;
        `;
        message.textContent = '🎯 Удачных ставок! Играйте ответственно!';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => message.remove(), 300);
        }, 2000);
    }
    
    function addRandomEffects() {
        // Случайные блики на коэффициентах
        setInterval(() => {
            const coefficients = document.querySelectorAll('.betting-coefficient');
            const randomCoeff = coefficients[Math.floor(Math.random() * coefficients.length)];
            if (randomCoeff) {
                randomCoeff.style.boxShadow = '0 0 20px rgba(0, 199, 139, 0.8)';
                randomCoeff.style.transform = 'scale(1.05)';
                
                setTimeout(() => {
                    randomCoeff.style.boxShadow = '0 2px 5px rgba(0, 199, 139, 0.2)';
                    randomCoeff.style.transform = 'scale(1)';
                }, 800);
            }
        }, 4000);
        
        // Пульсация иконок
        setInterval(() => {
            const icons = document.querySelectorAll('.fire-icon, .stats-icon');
            icons.forEach(icon => {
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);
            });
        }, 5000);
    }
    
    // Добавляем CSS для анимаций
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes messageSlide {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        
        .betting-coefficient {
            transition: all 0.3s ease;
        }
        
        .fire-icon, .stats-icon {
            transition: transform 0.2s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Инициализация
    renderFactoids();
    updateTitle();
    addClickEffects();
    addRandomEffects();
    
    // Добавляем эффект печатающего текста для заголовка
    setTimeout(() => {
        const subtitle = document.querySelector('.factoids-subtitle');
        const text = subtitle.textContent;
        subtitle.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            subtitle.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(typeInterval);
            }
        }, 100);
    }, 1000);
}); 