// SnakeGame class to encapsulate all game logic
class SnakeGame {
    constructor(canvas, tileSize) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.tileSize = tileSize;
        this.resetGame();
        document.addEventListener("keydown", this.changeDirection.bind(this));
        this.gameInterval = setInterval(() => this.update(), 100);
    }

    // Resets the game to its initial state
    resetGame() {
        if (this.snake && this.snake.length > 1) {
            document.getElementById('gameOver').style.display = 'flex';
            clearInterval(this.gameInterval);
            return;
        }
        this.snake = [{ x: 10, y: 10 }];
        this.food = this.getRandomFoodPosition();
        this.direction = { x: 0, y: 0 };
        this.score = 0;
        document.getElementById('scoreDisplay').innerText = `Score: ${this.score}`;
    }

    // Generates random position for food within the game boundaries
    getRandomFoodPosition() {
        return {
            x: Math.floor(Math.random() * (this.canvas.width / this.tileSize)),
            y: Math.floor(Math.random() * (this.canvas.height / this.tileSize))
        };
    }

    // Changes the direction of the snake based on arrow key input
    changeDirection(event) {
        const key = event.keyCode;
        const UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39;
        if (key === UP && this.direction.y === 0) this.direction = { x: 0, y: -1 };
        if (key === DOWN && this.direction.y === 0) this.direction = { x: 0, y: 1 };
        if (key === LEFT && this.direction.x === 0) this.direction = { x: -1, y: 0 };
        if (key === RIGHT && this.direction.x === 0) this.direction = { x: 1, y: 0 };
    }

    // Updates the game state, including movement and collision checks
    update() {
        const head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };
        this.snake.unshift(head);

        // Check collision with food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('scoreDisplay').innerText = `Score: ${this.score}`;
            this.food = this.getRandomFoodPosition();
        } else {
            this.snake.pop(); // Remove tail if no food eaten
        }

        // Check collision with walls or itself
        if (head.x < 0 || head.y < 0 || head.x >= this.canvas.width / this.tileSize || head.y >= this.canvas.height / this.tileSize ||
            this.snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
            this.resetGame();
        }

        this.draw();
    }

    // Draws the snake, food, and score on the canvas
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake with gradient effect
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? "lime" : "green"; // Head in lime, body in green
            this.ctx.fillRect(segment.x * this.tileSize, segment.y * this.tileSize, this.tileSize, this.tileSize);
        });

        // Draw food
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.food.x * this.tileSize, this.food.y * this.tileSize, this.tileSize, this.tileSize);
    }
}

// Initialize the game
const canvas = document.getElementById("gameCanvas");
new SnakeGame(canvas, 20);
