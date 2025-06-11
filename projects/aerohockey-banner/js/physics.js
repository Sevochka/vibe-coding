// Физический движок для аэрохоккея
class Physics {
    constructor() {
        this.gravity = GAME_CONFIG.PHYSICS.GRAVITY;
        this.timeStep = GAME_CONFIG.PHYSICS.TIME_STEP;
        this.collisionDamping = GAME_CONFIG.PHYSICS.COLLISION_DAMPING;
        this.wallBounce = GAME_CONFIG.PHYSICS.WALL_BOUNCE;
    }

    // Расчет расстояния между двумя точками
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Нормализация вектора
    normalize(x, y) {
        const length = Math.sqrt(x * x + y * y);
        if (length === 0) return { x: 0, y: 0 };
        return { x: x / length, y: y / length };
    }

    // Ограничение скорости
    limitSpeed(vx, vy, maxSpeed) {
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > maxSpeed) {
            const factor = maxSpeed / speed;
            return { vx: vx * factor, vy: vy * factor };
        }
        return { vx, vy };
    }

    // Столкновение шайбы со стенами
    handleWallCollision(object) {
        const radius = object.radius;
        let bounced = false;

        // Левая и правая стены
        if (object.x - radius <= 0) {
            object.x = radius;
            object.vx = Math.abs(object.vx) * this.wallBounce;
            bounced = true;
        } else if (object.x + radius >= GAME_CONFIG.FIELD.WIDTH) {
            object.x = GAME_CONFIG.FIELD.WIDTH - radius;
            object.vx = -Math.abs(object.vx) * this.wallBounce;
            bounced = true;
        }

        // Верхняя и нижняя стены (учитывая ворота)
        if (object.y - radius <= 0) {
            // Проверка попадания в ворота (верхние)
            const goalCenter = GAME_CONFIG.FIELD.WIDTH / 2;
            const goalHalfWidth = GAME_CONFIG.GOALS.WIDTH / 2;
            
            if (object.x >= goalCenter - goalHalfWidth && object.x <= goalCenter + goalHalfWidth) {
                return 'goal_top';
            } else {
                object.y = radius;
                object.vy = Math.abs(object.vy) * this.wallBounce;
                bounced = true;
            }
        } else if (object.y + radius >= GAME_CONFIG.FIELD.HEIGHT) {
            // Проверка попадания в ворота (нижние)
            const goalCenter = GAME_CONFIG.FIELD.WIDTH / 2;
            const goalHalfWidth = GAME_CONFIG.GOALS.WIDTH / 2;
            
            if (object.x >= goalCenter - goalHalfWidth && object.x <= goalCenter + goalHalfWidth) {
                return 'goal_bottom';
            } else {
                object.y = GAME_CONFIG.FIELD.HEIGHT - radius;
                object.vy = -Math.abs(object.vy) * this.wallBounce;
                bounced = true;
            }
        }

        return bounced ? 'wall' : null;
    }

    // Столкновение между двумя круглыми объектами
    handleCircleCollision(obj1, obj2) {
        const dx = obj2.x - obj1.x;
        const dy = obj2.y - obj1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = obj1.radius + obj2.radius;

        if (distance < minDistance && distance > 0) {
            // Нормализация вектора столкновения
            const nx = dx / distance;
            const ny = dy / distance;

            // Разделение объектов
            const overlap = minDistance - distance;
            const separationX = nx * overlap * 0.5;
            const separationY = ny * overlap * 0.5;

            obj1.x -= separationX;
            obj1.y -= separationY;
            obj2.x += separationX;
            obj2.y += separationY;

            // Относительная скорость
            const dvx = obj2.vx - obj1.vx;
            const dvy = obj2.vy - obj1.vy;

            // Скорость вдоль нормали
            const dvn = dvx * nx + dvy * ny;

            // Не решать, если объекты разделяются
            if (dvn > 0) return false;

            // Импульс столкновения
            const impulse = 2 * dvn / (obj1.mass + obj2.mass);

            obj1.vx += impulse * obj2.mass * nx * this.collisionDamping;
            obj1.vy += impulse * obj2.mass * ny * this.collisionDamping;
            obj2.vx -= impulse * obj1.mass * nx * this.collisionDamping;
            obj2.vy -= impulse * obj1.mass * ny * this.collisionDamping;

            return true;
        }

        return false;
    }

    // Применение трения
    applyFriction(object) {
        const friction = object.friction || 0.99;
        object.vx *= friction;
        object.vy *= friction;

        // Остановка объекта если скорость очень мала
        const minSpeed = GAME_CONFIG.PUCK.MIN_SPEED;
        if (Math.abs(object.vx) < minSpeed && Math.abs(object.vy) < minSpeed) {
            object.vx = 0;
            object.vy = 0;
        }
    }

    // Обновление позиции объекта
    updatePosition(object) {
        object.x += object.vx * this.timeStep * 60;
        object.y += object.vy * this.timeStep * 60;
    }

    // Ограничение движения биты в своей половине поля
    constrainPaddle(paddle, isPlayer) {
        const radius = paddle.radius;
        const centerY = GAME_CONFIG.FIELD.HEIGHT / 2;

        // Ограничение по X
        if (paddle.x - radius < 0) {
            paddle.x = radius;
        } else if (paddle.x + radius > GAME_CONFIG.FIELD.WIDTH) {
            paddle.x = GAME_CONFIG.FIELD.WIDTH - radius;
        }

        // Ограничение по Y (каждый игрок в своей половине)
        if (isPlayer) {
            // Игрок в нижней половине
            if (paddle.y - radius < centerY) {
                paddle.y = centerY + radius;
            } else if (paddle.y + radius > GAME_CONFIG.FIELD.HEIGHT) {
                paddle.y = GAME_CONFIG.FIELD.HEIGHT - radius;
            }
        } else {
            // ИИ в верхней половине
            if (paddle.y - radius < 0) {
                paddle.y = radius;
            } else if (paddle.y + radius > centerY) {
                paddle.y = centerY - radius;
            }
        }
    }

    // Расчет отскока от биты с учетом угла удара
    calculatePaddleHit(paddle, puck) {
        const dx = puck.x - paddle.x;
        const dy = puck.y - paddle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return;

        // Нормализация направления
        const nx = dx / distance;
        const ny = dy / distance;

        // Сила удара зависит от скорости биты
        const paddleSpeed = Math.sqrt(paddle.vx * paddle.vx + paddle.vy * paddle.vy);
        const hitForce = Math.min(paddleSpeed * 0.3 + 2, GAME_CONFIG.PUCK.MAX_SPEED);

        // Передача импульса шайбе
        puck.vx = nx * hitForce + paddle.vx * 0.3;
        puck.vy = ny * hitForce + paddle.vy * 0.3;

        // Ограничение максимальной скорости шайбы
        const speed = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy);
        if (speed > GAME_CONFIG.PUCK.MAX_SPEED) {
            const factor = GAME_CONFIG.PUCK.MAX_SPEED / speed;
            puck.vx *= factor;
            puck.vy *= factor;
        }
    }

    // Проверка, находится ли точка в прямоугольнике
    pointInRect(px, py, x, y, width, height) {
        return px >= x && px <= x + width && py >= y && py <= y + height;
    }

    // Интерполяция между двумя значениями
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Ограничение значения в пределах min и max
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
} 