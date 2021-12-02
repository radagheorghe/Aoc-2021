import { InputFile } from '../Common/InputFile'

var input = new InputFile("./day2/input.txt");

class Submarine {
  private mHorizPos: number;
  private mDepthPos: number;
  private mAim: number;

  constructor() {
    this.mHorizPos = 0;
    this.mDepthPos = 0;
    this.mAim = 0;
  }

  public MoveForward(aPos: number) {
    this.mHorizPos += aPos;
    this.mDepthPos += this.mAim * aPos;
  }
  
  public MoveUp(aPos: number) {
    this.mAim -= aPos;
  }

  public MoveDown(aPos: number) {
    this.mAim += aPos;
  }

  public getPosition(): number {
    return this.mHorizPos * this.mDepthPos;
  }
}

var sub = new Submarine();

var lines = input.getAsLines();

lines.forEach(line => {
  let move = line.split(' ');
  switch(move[0]) {
    case "forward":
      sub.MoveForward(Number(move[1]));
      break;
    case "up":
      sub.MoveUp(Number(move[1]));
      break;
    case "down":
      sub.MoveDown(Number(move[1]));
      break;
  }
});

console.log(sub.getPosition());