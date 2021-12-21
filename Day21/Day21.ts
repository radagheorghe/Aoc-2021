import { appendFile } from 'fs';
import { InputFile } from '../Common/InputFile'

class Player {

  public mScore: number;
  public mPosition: number;

  constructor(aStart: number) {
    this.mScore = 0;
    this.mPosition = aStart;
  }

  public move(aPosition: number) {
   
    this.mPosition += aPosition;

    if(this.mPosition % 10 == 0)
      this.mPosition = 10;
    else {
      if(this.mPosition > 100)
        this.mPosition = this.mPosition % 100;

      if(this.mPosition > 10)
        this.mPosition = this.mPosition % 10;
    }
    this.mScore += this.mPosition;
  }
}

class Die {

  public mNumber: number;
  public mRooled: number;

  constructor() {
    this.mNumber = 0;
    this.mRooled = 0;
  }

  public rool(): number {
    
    if(this.mNumber > 100)
      this.mNumber = 1;
    
    this.mRooled ++;
    this.mNumber ++;

    return this.mNumber;
  }
}

class Game {

  private mDie: Die;
  private mLooser: Player;

  constructor(aInput: {Player1: number, Player2: number}) {

    let player1 = new Player(aInput.Player1);
    let player2 = new Player(aInput.Player2);
    this.mDie = new Die();

    while(true) {

      player1.move(this.mDie.rool() + this.mDie.rool() + this.mDie.rool());
      
      if(player1.mScore >= 1000) {
        this.mLooser = player2;
        break;
      }

      player2.move(this.mDie.rool() + this.mDie.rool() + this.mDie.rool());

      if(player2.mScore >= 1000) {
        this.mLooser = player1;
        break;
      }
    }
  }

  public getScore(): number {
    return this.mLooser.mScore * this.mDie.mRooled;
  }
}

var input = {Player1: 9, Player2: 4}
var input1 = {Player1: 4, Player2: 8}

var game = new Game(input);
console.log(game.getScore())
