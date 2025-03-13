# 🐍 Snake Game

A fun and visually enhanced **Snake Game** built using **HTML**, **CSS**, and **JavaScript**.  
Includes smooth animations, power-ups (like slow-down), and a Y-shaped flickering snake tongue!

---

## 🎮 Live Demo

👉 [Play Now](https://geochriss.github.io/snake-game/)

---

## ✨ Features

- Classic snake movement using arrow keys
- Slow-down 🕒 power-up with animated **clock UI**
- Real-time **score** and **top score tracking**
- **Collision detection** with self and walls
- Game over screen with replay option
- 
---

## 🛠️ Technologies Used

- **HTML5 Canvas** for game rendering
- **CSS3** for layout and basic styling
- **Vanilla JavaScript** for game logic

---

## 🚀 How the Game Was Built (Step-by-Step)

### 1. **Canvas Setup**
- A `<canvas>` element was added to the HTML with defined width and height.
- JavaScript accessed the canvas using `getContext("2d")`.

### 2. **Game Grid and Snake Initialization**
- The board was built using a grid system based on `blockSize`, `rows`, and `cols`.
- The snake’s position (`snakeX`, `snakeY`) was set relative to the grid.
- Movement was handled by updating velocity on arrow key press.

### 3. **Food Placement**
- Food coordinates were randomized within grid bounds.
- The food was styled as a circular apple with a stem and leaf.

### 4. **Drawing the Snake**
- The snake was rendered using filled rectangles for the body and a separate rectangle for the head.
- Eyes were drawn with small circles to show direction.

### 5. **Adding the Y-shaped Tongue**
- A flickering Y-shaped tongue was drawn using lines based on the snake’s direction.
- The tongue appears and disappears at timed intervals using `tongueTimer`.

### 6. **Movement and Collision**
- The snake body was updated by shifting segments forward.
- Collision detection was added for:
  - Walls
  - Self (tail)
  - Food (to grow and score)

### 7. **Score Tracking**
- A score and top score system was added and updated in the DOM.
- On eating food, the score increases.

### 8. **Game Over Handling**
- On collision, a game over flag stops updates.
- A replay button and score summary is shown.

### 9. **Slow-Down Power-Up (Clock)**
- A timer-based power-up appears randomly on the board.
- When collected, the game slows down temporarily.
- The power-up is visually styled like a **clock**, with:
  - Tick marks
  - Rotating clock hand (minute hand)
- A disappearing border-timer surrounds the game area during slow mode.

### 10. **Responsive Start Options**
- Game starts with:
  - Play button
  - Pressing space bar or arrow key
- Replay button appears on game over

---

## 📦 How to Run Locally

```bash
git clone https://github.com/GeoChriss/snake-game.git
cd snake-game
# Then open index.html in your browser

