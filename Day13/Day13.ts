import { InputFile } from '../Common/InputFile'
import { writeFileSync } from 'fs'

const mapSize = 5000;
const offset = mapSize / 2;

class Point {

  public mX: number;
  public mY: number;

  constructor(aX: number, aY: number, aOffset: number = 0) {
    this.mX = aX + aOffset;
    this.mY = aY + aOffset;
  }
}

class TransparentOrigami {
  
  private mMap: Array<Array<string>>;
  private mFolds: Array<{type: string, nr: number}>;
  private mVisiblePoints: Array<Point>;

  constructor(aInput: Array<string>) {

    let points = new Array<Point>();
    aInput[0].split(' ').forEach(point => {
      let xy = point.split(',');
      points.push(new Point(Number(xy[0]), Number(xy[1]), offset));
    })

    this.mMap = new Array<Array<string>>();
    for(let y = 0; y < mapSize; y ++)
      this.mMap.push(new Array<string>(mapSize).fill('.'));
    
    points.forEach(pt => {
      this.mMap[pt.mY][pt.mX] = '#';
    })

    this.mFolds = new Array<{type: string, nr: number}>();

    aInput[1].split(' ').map(fold => {
      let xy = fold.split('=');
      if(xy.length == 2) 
        this.mFolds.push({type: xy[0], nr: Number(xy[1]) + offset})
    })
    this.mVisiblePoints = new Array<Point>();
  }

  private foldY(aNumber: number) {

    for(let yUp = aNumber - 1, yDown = aNumber + 1; yUp >= 0 && yDown < mapSize; yUp--, yDown++) {     
      for(let x = 0; x < mapSize; x++) {
        if(this.mMap[yDown][x] == '#') {
          this.mMap[yUp][x] = this.mMap[yDown][x];
          this.mMap[yDown][x] = '.';
        }
      }
    }
  }

  private foldX(aNumber: number) {
    
    for(let xLeft = aNumber - 1, xRight = aNumber + 1; xLeft >= 0 && xRight < mapSize; xLeft--, xRight++) {     
      for(let y = 0; y < mapSize; y++) {
        if(this.mMap[y][xRight] == '#') {
          this.mMap[y][xLeft] = this.mMap[y][xRight];
          this.mMap[y][xRight] = '.';
        }
      }
    }
  }

  public fold(): number {
    let folds = 0;
    this.mFolds.forEach(fold => {      
      switch(fold.type) {
        case 'x':
          this.foldX(fold.nr);
          folds ++;
          break;
        case 'y':
          this.foldY(fold.nr);
          folds ++;
          break;
      }
    })    
    
    for(let y = 0; y < mapSize; y++)  
      for(let x = 0; x < mapSize; x++)
        if(this.mMap[y][x] == '#') 
          this.mVisiblePoints.push(new Point(x, y));
    
    return this.mVisiblePoints.length;
  }

  public printMap() {
    
    let minX = Math.min(...this.mVisiblePoints.map(pt => pt.mX));
    let minY = Math.min(...this.mVisiblePoints.map(pt => pt.mY));
    let maxX = Math.max(...this.mVisiblePoints.map(pt => pt.mX));
    let maxY = Math.max(...this.mVisiblePoints.map(pt => pt.mY));

    let message = "";
    for(let y = minY; y <= maxY; y++) {      
      let line = "";
      for(let x = minX; x <= maxX; x++) {
          line += this.mMap[y][x];
      }      
      message += line;
      message += "\n";
    }
    console.log(message);
  }
}

var input = new InputFile("./day13/input.txt");
var input1 = new InputFile("./day13/input1.txt");

var origami = new TransparentOrigami(input.getAsGroups());
console.log(origami.fold());
origami.printMap();
