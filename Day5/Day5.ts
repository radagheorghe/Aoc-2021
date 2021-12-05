import { InputFile } from '../Common/InputFile'

const mapSize = 1000;

class Point {

  public mX: number;
  public mY: number;

  constructor(aInput: string) {

    let xy = aInput.trim().split(',');

    this.mX = Number(xy[0]);
    this.mY = Number(xy[1]);
  }
}

class HydrothermalVents {
  
  private mMap: Array<Array<number>>;
 
  constructor(aInput: Array<string>) {

    this.mMap = new Array<Array<number>>();
    for(let x = 0; x < mapSize; x++) 
      this.mMap.push(new Array<number>(mapSize).fill(0));

    for(let line of aInput) {
      let pairs = line.split('->');
      let p1 = new Point(pairs[0]);
      let p2 = new Point(pairs[1]);

      let minX = Math.min(p1.mX, p2.mX);
      let minY = Math.min(p1.mY, p2.mY);

      let maxX = Math.max(p1.mX, p2.mX);
      let maxY = Math.max(p1.mY, p2.mY);

      if(p1.mX != p2.mX && p1.mY != p2.mY) { // only for part 2
        
        let m = (p2.mY-p1.mY) / (p2.mX-p1.mX);
        let c = p1.mY - m*p1.mX;

        for(let i = minX; i <= maxX ; i++) 
          this.mMap[m*i + c][i] += 1;
      }
      else {

        for(let x = minX; x <= maxX; x++) 
          for(let y = minY; y <= maxY; y++) 
            this.mMap[y][x] += 1;
      }
    }
  }

  public getIntersects(): number {
    let intersects = 0;

    for(let x = 0; x < mapSize; x++) {
      for(let y = 0; y < mapSize; y++) 
        intersects += this.mMap[y][x] >= 2 ? 1 : 0;
    }

    return intersects;
  }
}

var input = new InputFile("./day5/input.txt");
var input1 = new InputFile("./day5/input1.txt");

var vents = new HydrothermalVents(input.getAsLines());
console.log(vents.getIntersects());