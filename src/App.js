import {useState, useEffect} from 'react';
import './App.css';
const initial = [
  [2, 3, 0, 4, 1, 5, 0, 6, 8], 
  [0, 8, 0, 2, 3, 6, 5, 1, 9], 
  [1, 6, 0, 9, 8, 7, 2, 3, 4], 
  [3, 1, 7, 0, 9, 4, 0, 2, 5],
  [4, 5, 8, 1, 2, 0, 6, 9, 7], 
  [9, 2, 6, 0, 5, 8, 3, 0, 1], 
  [0, 0, 0, 5, 0, 0, 1, 0, 2], 
  [0, 0, 0, 8, 4, 2, 9, 0, 3], 
  [5, 9, 2, 3, 7, 1, 4, 8, 6] 
];

let item1 = localStorage.getItem("MySudokuTable");
let item2 = localStorage.getItem("MySudokuPuzzle");
if(!item1){
  localStorage.setItem("MySudokuTable", JSON.stringify(initial));
}
if(!item2){
  localStorage.setItem("MySudokuPuzzle", JSON.stringify(initial));
}
function App() {
  
  const sudokuArr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const [sudokuPuzzle, setSudokuPuzzle] = useState(getDeepCopy(JSON.parse(localStorage.getItem("MySudokuPuzzle"))));
  const [sudokuTable, setSudokuTable] = useState(getDeepCopy(JSON.parse(localStorage.getItem("MySudokuTable"))));
  function getDeepCopy(arr){
    return JSON.parse(JSON.stringify(arr));
  }
  function onInputChange(e, row, col){
    var val = parseInt(e.target.value) || 0;
    var grid = getDeepCopy(sudokuTable); 
    if(val === 0 || (val >= 1 && val <= 9)){
      grid[row][col] = val;
    }
    localStorage.setItem("MySudokuTable", JSON.stringify(grid));
    setSudokuTable(JSON.parse(localStorage.getItem("MySudokuTable")));
  }
  function clearSudoku(){
    let sudoku = getDeepCopy(sudokuPuzzle);
    localStorage.setItem("MySudokuTable", JSON.stringify(sudoku));
    setSudokuTable(JSON.parse(localStorage.getItem("MySudokuTable")));
  }
  function compareSudokus(currentSudoku, solvedSudoku){
    let res = {
      isComplete: true,
      isSolvable: true
    }
    for(let i=0;i<9;i++){
      for(let j=0;j<9;j++){
        if(currentSudoku[i][j] !== solvedSudoku[i][j]){
          if(currentSudoku[i][j] !== 0) res.isSolvable = false;
          else res.isComplete = false;
        }
      }
    }
    return res;
  }
  function checkSudoku() {
    let sudoku = getDeepCopy(sudokuPuzzle);
    solver(sudoku);
    let compare = compareSudokus(sudokuTable, sudoku);
    if(compare.isComplete){
      alert("Congratulations!!! You have completed the Sudoku Puzzle");
    }else if(compare.isSolvable){
      alert("Keep Going.. You can do it");
    }else {
      alert("Sudoku can't be solved. Try Again mate!");
    }
  }
  function checkRow(grid, row, num){
    return grid[row].indexOf(num) === -1;
  }
  function checkCol(grid, col, num){
      return grid.map(row => row[col]).indexOf(num) === -1;
  }
  function checkBox(grid, row, col, num){
    let boxArr = [];
    let rowStart = row - (row%3);
    let colStart = col - (col%3);
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        boxArr.push(grid[rowStart + i][colStart + j]); 
      }
    }
    return boxArr.indexOf(num) === -1;
  }
  function isValid(grid, row, col, num){
    if(checkRow(grid, row, num) && checkCol(grid, col, num) && checkBox(grid, row, col, num)) return true;
    return false;
  }
  function solver(grid, row, col){
    for(let i=0;i<9;i++){
      for(let j=0;j<9;j++){
        if(grid[i][j] === 0){
          for(let num=1;num<=9;num++){
            if(isValid(grid, i, j, num)){
              grid[i][j] = num;
              if(solver(grid, i, j) === true) return true;
              else grid[i][j] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  function solveSudoku(){
      let sudoku = getDeepCopy(sudokuPuzzle);
      solver(sudoku, 0, 0);
      console.log(sudoku);
      localStorage.setItem("MySudokuTable", JSON.stringify(sudoku));
      setSudokuTable(JSON.parse(localStorage.getItem("MySudokuTable")));
  }
  function createNewSudoku(){
    let newSudoku = Array(9).fill().map(() => Array(9).fill(0));
    let vis = Array(9).fill(0);
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        let index = Math.floor(Math.random()*9);
        while(vis[index] !== 0){
          index = Math.floor(Math.random()*9);
        }
        newSudoku[i][j] = sudokuArr[index]+1;
        vis[index] = 1;
      }
    }
    vis = Array(9).fill(0);
    for(let i=3;i<6;i++){
      for(let j=3;j<6;j++){
        let index = Math.floor(Math.random()*9);
        while(vis[index] !== 0){
          index = Math.floor(Math.random()*9);
        }
        newSudoku[i][j] = sudokuArr[index]+1;
        vis[index] = 1;
      }
    }
    vis = Array(9).fill(0);
    for(let i=6;i<9;i++){
      for(let j=6;j<9;j++){
        let index = Math.floor(Math.random()*9);
        while(vis[index] !== 0){
          index = Math.floor(Math.random()*9);
        }
        newSudoku[i][j] = sudokuArr[index]+1;
        vis[index] = 1;
      }
    }
    solver(newSudoku);
    let count = 41, totalCells = 81;
    while(count !== 0){
      let index = Math.floor(Math.random()*totalCells);
      let r = Math.floor(index/9), c = index%9;
      if(newSudoku[r][c] !== '0') {
        newSudoku[r][c] = 0;
        count = count - 1;
      }
    }
    localStorage.setItem("MySudokuPuzzle", JSON.stringify(newSudoku));
    setSudokuPuzzle(JSON.parse(localStorage.getItem("MySudokuPuzzle")));
    localStorage.setItem("MySudokuTable", JSON.stringify(newSudoku));
    setSudokuTable(JSON.parse(localStorage.getItem("MySudokuTable")));
    console.log(newSudoku);
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <h3>Simple Sudoku</h3>
        <table>
          <tbody>
            {
              sudokuArr.map((row, rIndex) => {
                return <tr key={rIndex} className={((row+1)%3 === 0) ? 'bBorder' : ''}>
                  {sudokuArr.map((col, cIndex) => {
                    return <td key={rIndex + cIndex} className={((col+1)%3 === 0) ? 'rBorder' : ''}>
                      <input onChange={(e) => onInputChange(e, row, col)} value={sudokuTable[row][col] === 0 ? '' : sudokuTable[row][col]} 
                      className="sudoku-cell" 
                      disabled={sudokuPuzzle[row][col] !== 0}/>
                    </td>
                  })}
                </tr>
              })
            }
          </tbody>
        </table>
        <div className="buttonContainer">
            <button className="clearButton" onClick={clearSudoku}>Clear</button>
            <button className="checkButton" onClick={checkSudoku}>Check</button>
            <button className="solveButton" onClick={solveSudoku}>Solve</button>
            <button className="newgameButton" onClick={createNewSudoku}>New Game</button>
        </div>
      </header>
    </div>
  );
}

export default App;
