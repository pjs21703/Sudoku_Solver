let board = []


export function insertValues() {
    const inputs = document.querySelectorAll('input')//selecting input tag
    inputs.forEach((input) => {
        if(input.value) {
            let num = parseInt(input.value);
            if(num==0) num=10;
            board.push(num)
            input.classList.add('input-el') //for black color
        } else {
            board.push(0)
            input.classList.add('empty-el') //for blue color
        }
    })
}


export function check()
{
    console.log(board);
    const size = 9;
    let matrix = [];
    for (let i = 0; i < size; i++) {
      const row = board.slice(i * size, (i + 1) * size);
      console.log(row);
      matrix.push(row);
    }
    console.log(matrix)

    for(let r=0;r<9;r++)
    {
        for(let c=0;c<9;c++)
        {
            let nm = matrix[r][c];
            if(nm<0) return false
            if(nm>9) return false
        }
    }

        for (let r = 0; r < 9; r++) {
          const seen = new Set();
          for (let c = 0; c < 9; c++) {
            const num = matrix[r][c];
            if (num >0) {
              if (seen.has(num)) {
                return false;
              }
              seen.add(num);
            }
          }
        }
      
        // Check columns
        for (let c = 0; c < 9; c++) {
          const seen = new Set();
          for (let r = 0; r < 9; r++) {
            const num = matrix[r][c];
            if (num >0) {
              if (seen.has(num)) {
                return false;
              }
              seen.add(num);
            }
          }
        }
      
        // Check 3x3 sub grids
        for (let b = 0; b < 9; b++) {
          const seen = new Set();
          const sr = Math.floor(b / 3) * 3;
          const sc = (b % 3) * 3;
          for (let r = sr; r < sr + 3; r++) {
            for (let c = sc; c < sc + 3; c++) {
              const num = matrix[r][c];
              if (num >0) {
                if (seen.has(num)) {
                  return false;
                }
                seen.add(num);
              }
            }
          }
        }
        return true;
}

const indexToRowCol = (index) => { 
    return {row: Math.floor(index/9), col: index%9} 
}
const rowColToIndex = (row, col) => (row * 9 + col)

const acceptable = (board, index, value) => {
    let { row, col } = indexToRowCol(index)
    for (let r = 0; r < 9; ++r) {
        if (board[rowColToIndex(r, col)] == value) return false
    }
    for (let c = 0; c < 9; ++c) {
        if (board[rowColToIndex(row, c)] == value) return false
    }

    let r1 = Math.floor(row / 3) * 3
    let c1 = Math.floor(col / 3) * 3
    for (let r = r1; r < r1 + 3; ++r) {
        for (let c = c1; c < c1 + 3; ++c) {
            if (board[rowColToIndex(r, c)] == value) return false
        }
    }
    return true
}

// checking row/col/3X3 grid
const getChoices = (board, index) => {
    let choices = []
    for (let value = 1; value <= 9; ++value) {
        if (acceptable(board, index, value)) {
            choices.push(value)
        }
    }
    return choices
}

//finding all the possible number for the index and then returning the number that has least possibility of number to use at that index
const bestBet = (board) => {
    let index, moves, bestLen = 100
    for (let i = 0; i < 81; ++i) {
        if (!board[i]) {
            let m = getChoices(board, i)
            if (m.length < bestLen) {
                bestLen = m.length
                moves = m
                index = i
                if (bestLen == 0) break
            }
        }
    }
    return { index, moves }
}

//recursive function
export const solve = () => {
    let { index, moves } = bestBet(board) 
    if(index==null) return true
    if (index >= 81 || index < 0 ) return false
    if(moves.length==0) return false;       
    for (let m of moves) {
        // updating the board with the number then solving again
        board[index] = m                  
        if (solve()) return true        
    }
    board[index] = 0
    return false
}
//giving output in HTML 
export function populateValues() {
    const inputs = document.querySelectorAll('input')
    inputs.forEach((input, i) => input.value = board[i])
}