import { InputFile } from '../Common/InputFile'

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

    this.mMap = new Array<Array<number>>();
    aInput.forEach(inputLine => {
      let line = inputLine.split('').map(nr => Number(nr));
      let chunkSize = line.length;
      for(let chunk = 0; chunk < 4; chunk ++)
        for(let x = 0; x < chunkSize; x ++) {
          let toAdd = line[x + chunk * chunkSize];
          line.push(toAdd == 9 ? 1 : toAdd + 1);
        }
      this.mMap.push(line);
    })
    
    this.mSizeX = this.mMap[0].length;
    
    let chunkSize = this.mMap.length;
    for(let chunk = 0; chunk < 4; chunk ++)
      for(let y = 0; y < chunkSize; y ++) {
        let newLine = new Array<number>();
        for(let x = 0; x < this.mSizeX; x++) {
          let toAdd = this.mMap[y + chunk * chunkSize][x];
          newLine.push(toAdd == 9 ? 1 : toAdd + 1);
        }
        this.mMap.push(newLine);
      }
    this.mSizeY = this.mMap.length;
  }

  private testPoint(aPoint: Point): boolean {
    if(aPoint.mX < 0 || aPoint.mX >= this.mMap[0].length || aPoint.mY < 0 || aPoint.mY >= this.mMap.length)
      return false;
  
    return true;
  }

  public findShortestPath(): number
  {
    let row = [ -1, 0, 0, 1 ];
    let col = [ 0, -1, 1, 0 ];

    let visited = new Array<Array<boolean>>();
    for(let y = 0; y < this.mSizeY; y ++)
      visited.push(new Array<boolean>(this.mSizeX).fill(false));

    let q = new Array<{xy: Point, cost: number}>();

    visited[0][0] = true;
    q.push({xy: new Point(0, 0), cost: 0});

    while (q.length != 0)
    {
      q.sort((a, b) => b.cost - a.cost);
      let node = q.pop();
      
      let crPos = node.xy;
      let dist = node.cost;
      
      if (crPos.mX == this.mSizeX - 1 && crPos.mY == this.mSizeY - 1)
        return dist;

      for (let k = 0; k < 4; k++)
      {
        let newPos = new Point(crPos.mX + row[k], crPos.mY + col[k]);
        if (this.testPoint(newPos) && !visited[newPos.mY][newPos.mX])
        {
          visited[newPos.mY][newPos.mX] = true;
          let newCost = dist + this.mMap[newPos.mY][newPos.mX];

          q.push({xy: newPos, cost: newCost});
        }
      }
    }

    return -1;
  }
}

var input = new InputFile("./day15/input.txt");
var input1 = new InputFile("./day15/input1.txt");

var chiton = new Chiton(input.getAsLines());
console.log(chiton.findShortestPath());