class Queue {
    constructor(maxSize) {
        this.maxSize = maxSize; // Tamaño máximo de la cola
        this.items = []; // Array para almacenar los elementos de la cola
    }

    // Crear cola
    create() {
        this.items = [];
    }

    // Insertar elemento en la cola
    enqueue(element) {
        if (this.isFull()) {
            console.log("La cola está llena");
            return;
        }
        this.items.push(element);
    }

    // Quitar elemento de la cola
    dequeue() {
        if (this.isEmpty()) {
            console.log("La cola está vacía");
            return;
        }
        return this.items.shift();
    }

    // Verificar si la cola está vacía
    isEmpty() {
        return this.items.length === 0;
    }

    // Verificar si la cola está llena
    isFull() {
        return this.items.length >= this.maxSize;
    }

    // Obtener el frente de la cola
    front() {
        if (this.isEmpty()) {
            console.log("La cola está vacía");
            return;
        }
        return this.items[0];
    }

    // Obtener el tamaño de la cola
    size() {
        return this.items.length;
    }
}

const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const maxSize = 100; // Tamaño máximo de la cola

let snake = new Queue(maxSize);
snake.create();
snake.enqueue({ x: 9 * box, y: 9 * box }); // Inicializar la serpiente con un segmento

let direction = 'RIGHT';
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

document.addEventListener('keydown', directionControl);

function directionControl(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la serpiente
    let snakeArray = snake.items; // Acceder a los elementos de la cola
    for (let i = 0; i < snakeArray.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'lightgreen';
        ctx.fillRect(snakeArray[i].x, snakeArray[i].y, box, box);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(snakeArray[i].x, snakeArray[i].y, box, box);
    }

    // Dibujar la comida
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Mover la serpiente
    let snakeHead = snake.front();
    let snakeX = snakeHead.x;
    let snakeY = snakeHead.y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Comprobar si come
    if (snakeX === food.x && snakeY === food.y) {
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.dequeue();
    }

    const newHead = { x: snakeX, y: snakeY };

    // Comprobar colisiones
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake.items)) {
        clearInterval(game);
        alert('Game Over!');
    }

    snake.enqueue(newHead);

    // Mostrar puntuación
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + (snake.size() - 1), 10, 20);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

let game = setInterval(draw, 100);