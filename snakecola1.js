// Implementación de la Cola
class Queue {
    constructor(maxSize = 400) { // maxSize por defecto para un tablero de 20x20
        this.items = [];
        this.maxSize = maxSize;
        this.front = 0;
        this.rear = -1;
        this.currentSize = 0;
    }

    // Verificar si la cola está vacía
    isEmpty() {
        return this.currentSize === 0;
    }

    // Verificar si la cola está llena
    isFull() {
        return this.currentSize === this.maxSize;
    }

    // Obtener el elemento del frente
    getFront() {
        if (this.isEmpty()) return null;
        return this.items[this.front];
    }

    // Obtener el tamaño actual de la cola
    size() {
        return this.currentSize;
    }

    // Insertar elemento en la cola
    enqueue(element) {
        if (this.isFull()) return false;
        this.rear = (this.rear + 1) % this.maxSize;
        this.items[this.rear] = element;
        this.currentSize++;
        return true;
    }

    // Quitar elemento de la cola
    dequeue() {
        if (this.isEmpty()) return null;
        const item = this.items[this.front];
        this.front = (this.front + 1) % this.maxSize;
        this.currentSize--;
        return item;
    }

    // Obtener todos los elementos para dibujar
    getAllElements() {
        let elements = [];
        let count = 0;
        let index = this.front;

        while (count < this.currentSize) {
            elements.push(this.items[index]);
            index = (index + 1) % this.maxSize;
            count++;
        }
        return elements;
    }
}

// Inicialización del juego
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const snakeQueue = new Queue();
snakeQueue.enqueue({ x: 9 * box, y: 9 * box }); // Posición inicial
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

    // Dibujar la serpiente usando la cola
    const snakeElements = snakeQueue.getAllElements();
    snakeElements.forEach((element, index) => {
        ctx.fillStyle = (index === 0) ? 'green' : 'lightgreen';
        ctx.fillRect(element.x, element.y, box, box);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(element.x, element.y, box, box);
    });

    // Dibujar la comida
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Mover la serpiente
    const head = snakeQueue.getFront();
    let snakeX = head.x;
    let snakeY = head.y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    const newHead = { x: snakeX, y: snakeY };

    // Comprobar colisiones
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height ||
        collision(newHead, snakeQueue.getAllElements())) {
        clearInterval(game);
        alert('Game Over!');
        return;
    }

    // Comprobar si come
    if (snakeX === food.x && snakeY === food.y) {
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snakeQueue.dequeue(); // Quitar la cola si no come
    }

    snakeQueue.enqueue(newHead); // Añadir nueva cabeza

    // Mostrar puntuación
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + (snakeQueue.size() - 1), 10, 20);
}

function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

let game = setInterval(draw, 100);