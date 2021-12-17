import { InputFile } from '../Common/InputFile'

class Probe {

  public mX: number;
  public mY: number;

  public mVelX: number;
  public mVelY: number;

  private mMaxY: Array<number>;

  constructor(aVelX: number, aVelY: number) {
    this.mX = 0;
    this.mY = 0;

    this.mVelX = aVelX;
    this.mVelY = aVelY;

    this.mMaxY = new Array<number>();
  }

  public move() {

    this.mX += this.mVelX;
    this.mY += this.mVelY;

    if(this.mVelX > 0)
      this.mVelX --;
    else if(this.mVelX < 0)
      this.mVelX ++;
    
    this.mVelY --;

    this.mMaxY.push(this.mY);
  }

  public getMaxY(): number {
    return Math.max(...this.mMaxY);
  }
}

class TrickShot {

  private mTarget: {x: Array<number>, y: Array<number>};

  constructor(aInput: string) {

    let target = aInput.split(':')[1];
    let positions = target.split(',');
    let x = positions[0].trim().split('=')[1].split('..').map(nr => Number(nr));
    let y = positions[1].trim().split('=')[1].split('..').map(nr => Number(nr));

    this.mTarget = {x: x, y: y};
  }

  private isInTarget(aX: number, aY: number) {
    return aX >= this.mTarget.x[0] && aX <= this.mTarget.x[1] &&
           aY >= this.mTarget.y[0] && aY <= this.mTarget.y[1];
  }

  public shot(): {part1: number, part2: number} {
   
    let inTargetY = new Array<number>();

    let range = 500;

    for(let velX = -1 * range; velX <= range; velX++)
      for(let velY = -1 * range; velY <= range; velY++){
        let probe = new Probe(velX, velY);
        while(true) {
          probe.move();

          if(this.isInTarget(probe.mX, probe.mY)) {
            inTargetY.push(probe.getMaxY());
            break;
          }
          else if(probe.mY < this.mTarget.y[0]) {
            break; // missed the target
          }
        }
      }
    return {part1: Math.max(...inTargetY), part2: inTargetY.length};
  }
}

var input = new InputFile("./day17/input.txt");
var input1 = new InputFile("./day17/input1.txt");

var shot = new TrickShot(input.getContent());
let ret = shot.shot();

console.log(ret.part1);
console.log(ret.part2);