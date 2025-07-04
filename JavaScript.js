let gridSize = 25;
let bombCount = 3;
let bombPositions = [];
let gameActive = false;
let revealed = 0;
let betAmount = 10;
let multiplier = 1;
let clickedCells = new Set();

function startGame() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  revealed = 0;
  clickedCells.clear();
  multiplier = 1;
  document.getElementById("result").innerText = "";
  document.getElementById("cashout").disabled = false;

  betAmount = parseFloat(document.getElementById("bet").value);
  bombCount = parseInt(document.getElementById("bombs").value);
  gameActive = true;

  bombPositions = generateBombs(gridSize, bombCount);

  for (let i = 0; i < gridSize; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", () => handleCellClick(i, cell));
    grid.appendChild(cell);
  }
}

function generateBombs(size, count) {
  let positions = new Set();
  while (positions.size < count) {
    positions.add(Math.floor(Math.random() * size));
  }
  return Array.from(positions);
}

function handleCellClick(index, cell) {
  if (!gameActive || clickedCells.has(index)) return;

  if (bombPositions.includes(index)) {
    cell.classList.add("bomb", "revealed");
    cell.innerText = "💣";
    endGame(false);
  } else {
    cell.classList.add("safe", "revealed");
    cell.innerText = "💎";
    clickedCells.add(index);
    revealed++;
    multiplier *= 1.2;
  }
}

function endGame(won) {
  gameActive = false;
  document.getElementById("cashout").disabled = true;
  const result = document.getElementById("result");
  if (won) {
    const profit = (betAmount * multiplier).toFixed(2);
    result.innerText = `✅ Você sacou: R$ ${profit}`;
  } else {
    result.innerText = `❌ Você perdeu!`;
  }

  // Revela bombas
  document.querySelectorAll(".cell").forEach((cell, idx) => {
    if (bombPositions.includes(idx) && !cell.classList.contains("revealed")) {
      cell.classList.add("bomb", "revealed");
      cell.innerText = "💣";
    }
  });
}

function cashOut() {
  if (!gameActive) return;
  endGame(true);
}
