//process ux ui
//condition to create a grid is <row> x <col> and each cell is 1 image but in the grid has two img as same as with different position
const col = 8;
const row = 5;
const background = "/source/Background.jpg";
const grid = document.querySelector(".ta");
const totalImg = (row * col) / 2;
const canvas = document.getElementById("connectionCanvas");
let board = [];
let firstCell = null;
let secondCell = null;

function createGrid() {
    let images = [];
    for (let i = 1; i <= totalImg; i++) {
        images.push(`/source/pieces${i}.png`);
        images.push(`/source/pieces${i}.png`);
    }
    images.sort((a, b) => Math.random() - 0.5);
    let index = 0;
    board = [];

    board.push(new Array(col + 2).fill(null));
    for (let i = 1; i <= row; i++) {
        const tr = document.createElement("tr");
        const rowData = [null];

        for (let j = 1; j <= col; j++) {
            const td = document.createElement("td");
            td.id = `cell-${i}-${j}`;
            td.style.backgroundImage = `url(${images[index]})`;
            td.dataset.value = images[index];
            rowData.push(images[index]);
            index++;
            tr.appendChild(td);
        }
        rowData.push(null);
        board.push(rowData);
        grid.appendChild(tr);
    }
    board.push(new Array(col + 2).fill(null));
}

function resizeCanvas() {
    const rect = grid.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.position = "absolute";
    canvas.style.left = `${rect.left}px`;
    canvas.style.top = `${rect.top}px`;
}
window.addEventListener("resize", resizeCanvas);

function addClickListener() {
    const cells = document.querySelectorAll("td");
    cells.forEach((cell) => {
        cell.addEventListener("click", () => handleCellClick(cell));
    })
    win() ? gameOver() : setTime();
}

function handleCellClick(cell) {
    if (!firstCell) {
        firstCell = cell;
        console.log("First cell selected:", firstCell.id);
        cell.classList.add("selected");
        return;
    }

    secondCell = cell;

    checkMatch();

    firstCell = null;
    secondCell = null;
}

function checkMatch() {
    const p1 = getCellPosition(firstCell.id);
    const p2 = getCellPosition(secondCell.id);

    if (firstCell.dataset.value === secondCell.dataset.value && firstCell !== secondCell) {
        if (
            (p1.row === p2.row && clearRow(p1, p2, board)) ||
            (p1.col === p2.col && clearCol(p1, p2, board)) ||
            checkCorners(p1, p2, board) ||
            checkTwoCorners(p1, p2, board)
        ) {
            firstCell.style.visibility = "hidden";
            secondCell.style.visibility = "hidden";
            board[p1.row][p1.col] = null;
            board[p2.row][p2.col] = null;
            console.log(" Match success");
        } else {
            console.log(" Cannot connect");
        }
    } else {
        console.log("Not the same image");
    }

    firstCell.classList.remove("selected");
    secondCell.classList.remove("selected");
}

function checkCorners(p1, p2, board) {
    const corner1 = { row: p1.row, col: p2.col };
    const corner2 = { row: p2.row, col: p1.col };

    if (isCellEmpty(corner1, board)) {
        if (clearRow(p1, corner1, board) && clearCol(corner1, p2, board)) {
            return true;
        }
        if (clearRow(p2, corner2, board) && clearCol(corner2, p1, board)) {
            return true;
        }

    } if (isCellEmpty(corner2, board)) {
        if (clearRow(p1, corner2, board) && clearCol(corner2, p2, board)) {
            return true;
        }
        if (clearRow(p2, corner1, board) && clearCol(corner1, p1, board)) {
            return true;
        }
    }
    return false;
}

function checkTwoCorners(p1, p2, board) {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length; c++) {
            const corner = { row: r, col: c };
            if (isCellEmpty(corner, board)) {
                if (checkCorners(p1, corner, board) && checkCorners(corner, p2, board)) {
                    console.log("Two corners found at:", corner);
                    return true;
                }
            }
        }
    }
    return false;
}

function isCellEmpty(pos, board) {
    if (pos.row < 0 || pos.row >= board.length || pos.col < 0 || pos.col >= board[0].length) return false;
    return board[pos.row] && board[pos.row][pos.col] === null;
}

function clearRow(p1, p2, board) {
    if (p1.row !== p2.row) return false;

    const startCol = Math.min(p1.col, p2.col) + 1;
    const endCol = Math.max(p1.col, p2.col);
    for (let c = startCol; c < endCol; c++) {
        if (board[p1.row][c] !== null) {
            return false;
        }
    }

    return true;
}

function clearCol(p1, p2, board) {
    if (p1.col !== p2.col) return false;

    const startRow = Math.min(p1.row, p2.row) + 1;
    const endRow = Math.max(p1.row, p2.row);
    for (let r = startRow; r < endRow; r++) {
        if (board[r][p1.col] !== null) {
            return false;
        }
    }
    return true;
}

function win() {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length; c++) {
            if (board[r][c] !== null) {
                return false;
            }
        }
    }
    return true;
}

function gameOver() {
    setTime();
    alert("Congratulations! You've cleared the board!");
}

function setTime() {
    let time = 120;
    const timerElement = document.getElementById("timer");
    if(!timerElement) return null;
    timerElement.textContent = `Time: ${time}`;
    const timerInterval = setInterval(() => {
        time--;
        if (time <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Game over.");
            return;
        }
        timerElement.textContent = `Time: ${time}`;
    }, 1000);

}

function getCellPosition(cellId) {
    const [, row, col] = cellId.split("-").map(Number);
    return { row: row, col: col };
}

createGrid();
addClickListener();

