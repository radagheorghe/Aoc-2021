import { InputFile } from '../Common/InputFile'

function newMatrix<T>(aSizeX : number, aSizeY: number, aFill: T): Array<Array<T>> {
  let array = new Array<Array<T>>(aSizeY);
  for(let y = 0; y < aSizeY; y ++)
    array.push(new Array<T>(aSizeX).fill(aFill));

  return array;
}

function pointInMatrix<T>(aMatrix: Array<Array<T>>, aPoint: Point): T | undefined {
  if(aPoint.mX < 0 || aPoint.mX >= aMatrix[0].length || aPoint.mY > 0 || aPoint.mY >= aMatrix.length)
    return undefined;

  return aMatrix[aPoint.mY][aPoint.mX];
}

class Point {

  public mX: number;
  public mY: number;

  constructor(aX: number, aY: number) {
    this.mX = aX;
    this.mY = aY;
  }

  public add(aPoint: Point) {
    this.mX += aPoint.mX;
    this.mY += aPoint.mY;
  }
}

class Chiton {

  private mSizeX: number;
  private mSizeY: number;
  private mMap: Array<Array<number>>;

  constructor(aInput: Array<string>) {

    this.mSizeX = aInput[0].length;
    this.mMap = new Array<Array<number>>();
    aInput.forEach(line => {
      this.mMap.push(line.split('').map(nr => Number(nr)));
    })
    this.mSizeY = this.mMap.length;
  }

  public findShortestPath(): number
  {
    let aStart = new Point(0, 0);    
    let aEnd = new Point(this.mSizeX, this.mSizeY);

    let row = [ -1, 0, 0, 1 ];
    let col = [ 0, -1, 1, 0 ];

    let visited = newMatrix<boolean>(this.mSizeX, this.mSizeY, false);
    let q = new Array<{xy: Point, cost: number}>();

    visited[aStart.mY][aStart.mX] = true;
    q.push({xy: aStart, cost: 0});

    let minDist = 1000;

    while (q.length != 0)
    {
      // dequeue front node and process it
      let node = q.pop();
      
      let crPos = node.xy;
      let dist = node.cost;
      
      if (crPos.mX == aEnd.mX && crPos.mX == aEnd.mY)
      {
        minDist = dist;
        break;
      }

      for (let k = 0; k < 4; k++)
      {
        let newPos = new Point(crPos.mX + row[k], crPos.mY + col[k]);
        if (pointInMatrix(this.mMap, newPos) && pointInMatrix(visited, newPos) == false)
        {
          visited[newPos.mY][newPos.mX] = true;
          q.push({xy: newPos, cost: dist + this.mMap[newPos.mY][newPos.mX]});
        }
      }
    }

      if (minDist != 1000) {
        return minDist;
      }
      return -1;
  }

}

var input = new InputFile("./day15/input.txt");
var input1 = new InputFile("./day15/input1.txt");

var chiton = new Chiton(input1.getAsLines());
console.log(chiton.findShortestPath());