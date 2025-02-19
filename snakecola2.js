//funcional
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

    // Obtener una copia de los elementos de la cola
    getItems() {
        return [...this.items];
    }
}

const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
const maxSize = 100; // Tamaño máximo de la cola

let snake = new Queue(maxSize);
snake.create();
snake.enqueue({ x: 9 * box, y: 9 * box });

let direction = "RIGHT";
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

document.addEventListener("keydown", directionControl);
function directionControl(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
    if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
}

function collision(head, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (head.x === arr[i].x && head.y === arr[i].y) return true;
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const snakeParts = snake.getItems();

    for (let i = 0; i < snake.size(); i++) {
        ctx.fillStyle = (i === 0) ? "green" : "lightgreen";
        ctx.fillRect(snakeParts[i].x, snakeParts[i].y, box, box);
        ctx.strokeStyle = "darkgreen";
        ctx.strokeRect(snakeParts[i].x, snakeParts[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    const head = snakeParts[snake.size() - 1];
    let snakeX = head.x;
    let snakeY = head.y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP")   snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.dequeue();
    }

    const newHead = { x: snakeX, y: snakeY };
    if (
        snakeX < 0 || snakeY < 0 ||
        snakeX >= canvas.width || snakeY >= canvas.height ||
        collision(newHead, snakeParts)
    ) {
        clearInterval(game);
        alert("Game Over!");
    }

    snake.enqueue(newHead);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + (snake.size() - 1), 10, 20);
}

let game = setInterval(draw, 100);