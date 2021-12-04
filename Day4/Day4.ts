import { InputFile } from '../Common/InputFile'
import { last } from '../Common/Util'

type BingoNumber = {Nr: number, Marked: boolean};
type Board = Array<Array<BingoNumber>>;

class Bingo {
  
  private mNumbers: Array<number>;
  private mBoards: Array<Board>;
  private mWinningBoards: Array<Board>;
  private mWinningNumbers: Array<number>;

  constructor(aInput: Array<string>) {

    this.mBoards = new Array<Board>();
    this.mWinningBoards = new Array<Board>();
    this.mWinningNumbers = new Array<number>();

    this.mNumbers = aInput[0].split(',').map(str => Number(str));

    for(let i = 1; i < aInput.length; i++) {
      
      let board = new Array<Array<BingoNumber>>();
      let lines = aInput[i].trim().split(/  | /).map(str => Number(str));

      for(let j = 0; j < lines.length; j += 5) {
        let line = lines.slice(j, j + 5).map(nr => ({Nr: nr, Marked: false}));
        board.push(line);
      }
      this.mBoards.push(board);
    }
    this.getWinningBoards();
  }

  private getBoardScore(aBoard: Board, aLastNr: number): number {
    let sum = 0;

    for(let i = 0; i < 5; i++) {
      for(let j = 0; j < 5; j++) {
        sum += !aBoard[i][j].Marked ? aBoard[i][j].Nr : 0;
      }
    }

    return sum * aLastNr;
  }

  private verifyWinningBoard(aBoard: Board): boolean {
    // verify lines or cols
    for(let i = 0; i < 5; i++) {
      let markedCountLines = 0;
      let markedCountCols = 0;
      for(let j = 0; j < 5; j++) {
        markedCountLines += aBoard[i][j].Marked ? 1 : 0;
        markedCountCols += aBoard[j][i].Marked ? 1 : 0;
      }
      if(markedCountLines == 5 || markedCountCols == 5)
        return true;
    }

    return false;
  }

  private getWinningBoards() {

    for(let drawnNr of this.mNumbers) {
      for(let board of this.mBoards) {
        
        if(this.mWinningBoards.includes(board))
          continue;

        for(let i = 0; i < 5; i++)
          for(let j = 0; j < 5; j++) {
            if(board[i][j].Nr == drawnNr)
              board[i][j].Marked = true;
          }

        if(this.verifyWinningBoard(board)) {
          this.mWinningBoards.push(board);
          this.mWinningNumbers.push(drawnNr);
        }
      }
    }
  }

  public getFirstWinningBoradScore(): number {
    return this.getBoardScore(this.mWinningBoards[0], this.mWinningNumbers[0]);
  }

  public getLastWinningBoradScore(): number {
    return this.getBoardScore(last(this.mWinningBoards), last(this.mWinningNumbers));
  }
}

var input = new InputFile("./day4/input.txt");
var input1 = new InputFile("./day4/input1.txt");

var bingo = new Bingo(input.getAsGroups());
console.log(bingo.getFirstWinningBoradScore());
console.log(bingo.getLastWinningBoradScore());
