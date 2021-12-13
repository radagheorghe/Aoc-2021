import { InputFile } from '../Common/InputFile'

class Point {

  public mX: number;
  public mY: number;

  constructor(aX: number, aY: number) {
    this.mX = aX;
    this.mY = aY;
  }
}

class TransparentOrigami {
  
  private mMapSizeX: number;
  private mMapSizeY: number;
  private mMap: Array<Array<number>>;
  
  constructor(aInput: Array<string>) {

    let points = new Array<Point>();
    aInput[0].split(' ').forEach(point => {
      let xy = point.split(',');
      points.push(new Point(Number(xy[0]), Number(xy[1])));
    })

    this.mMapSizeX = Math.max(...points.map(pt => pt.mX));
    this.mMapSizeY = Math.max(...points.map(pt => pt.mY));

    this.mMap = new Array<Array<number>>();
    for(let y = 0; y <= this.mMapSizeY; y ++)
      this.mMap.push(new Array<number>(this.mMapSizeX).fill(0));
    
    points.forEach(pt => {
      this.mMap[pt.mY][pt.mX] = 1;
    })
  }

  public fold(): number {
    return 0;
  }
}

var input = new InputFile("./day13/input.txt");
var input1 = new InputFile("./day13/input1.txt");

var origami = new TransparentOrigami(input1.getAsGroups());
console.log(origami.fold());
