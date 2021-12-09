import { InputFile } from '../Common/InputFile'

class SmokeBasin {
  
  private mSizeX: number;
  private mSizeY: number;
  private mMap: Array<Array<number>>;
  private mMapVisited: Array<Array<boolean>>;
  private mBasinsSize = new Array<number>();

  constructor(aInput: Array<string>) {

    this.mSizeX = aInput[0].length;
    
    this.mMap = new Array<Array<number>>();
    this.mMapVisited = new Array<Array<boolean>>();

    aInput.forEach(line => {
      this.mMap.push(line.split('').map(ch => Number(ch)));
      this.mMapVisited.push(new Array<boolean>(line.length).fill(false));
    })
    this.mSizeY = this.mMap.length;
  }

  public countBasinSize(aX: number, aY: number): number {
    
    let count = 1;
    this.mMapVisited[aY][aX] = true;
   
    if(aX + 1 < this.mSizeX && this.mMap[aY][aX + 1] < 9 && !this.mMapVisited[aY][aX + 1]) //right
      count += this.countBasinSize(aX + 1, aY);
    if(aX - 1 >= 0 && this.mMap[aY][aX - 1] < 9 && !this.mMapVisited[aY][aX - 1]) // left
      count += this.countBasinSize(aX - 1, aY);
    if(aY + 1 < this.mSizeY && this.mMap[aY + 1][aX] < 9 && !this.mMapVisited[aY + 1][aX])  // up
      count += this.countBasinSize(aX, aY + 1);
    if(aY - 1 >= 0 && this.mMap[aY - 1][aX] < 9 && !this.mMapVisited[aY - 1][aX]) // down
      count += this.countBasinSize(aX, aY - 1);

    return count;
  }

  public getLowPointsRisk(): number {

    let cost = 0;
    this.mBasinsSize = new Array<number>();

    for(let y = 0; y < this.mSizeY; y++) {

      for(let x = 0; x < this.mSizeX; x++){

        let min = this.mMap[y][x];
        if(x + 1 < this.mSizeX && min >= this.mMap[y][x + 1]) // right
          continue;
        if(x - 1 >= 0 && min >= this.mMap[y][x - 1]) // left
          continue;
        if(y + 1 < this.mSizeY && min >= this.mMap[y + 1][x]) // up
          continue;
        if(y - 1 >= 0 && min >= this.mMap[y - 1][x]) // down
          continue;

        cost += this.mMap[y][x] + 1;
        this.mBasinsSize.push(this.countBasinSize(x, y));
      }
    }
    return cost;
  }
  
  public getLargetBasins(): number {

    while(this.mBasinsSize.length > 3) {
      let min = Math.min(...this.mBasinsSize);
      this.mBasinsSize = this.mBasinsSize.filter(nr => nr != min);
    }

    return this.mBasinsSize.reduce((prev, cur) => prev * cur);
  }
}

var input = new InputFile("./day9/input.txt");
var input1 = new InputFile("./day9/input1.txt");

var smoke = new SmokeBasin(input.getAsLines());
console.log(smoke.getLowPointsRisk());
console.log(smoke.getLargetBasins());