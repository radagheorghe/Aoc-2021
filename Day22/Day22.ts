import { InputFile } from '../Common/InputFile'

class Reactor {

  public mCubes: Map<string, boolean>;
  
  private mRangesOn: Array<Array<number>>;
  private mRangesOff: Array<Array<number>>;
  
  constructor(aInput: Array<string>) {

    this.mCubes = new Map<string, boolean>();

    for(let line of aInput) {

      let pair = line.split(' ');
      let isOn = pair[0] == 'on';
      let xyzRanges = pair[1].split(',');
      let ranges = xyzRanges.map(range => range.split('=')[1].split('..').map(nr => Number(nr)));
      
      let isInRange = 0; // just for part 1
      for(let r = 0; r < 3; r++) {
        if(ranges[r][0] >= -50 && ranges[r][1] <= 50)
          isInRange ++;
      }

      if(isInRange < 3) 
        continue;

      let currentRanges = isOn ? this.mRangesOn : this.mRangesOff;

      if(currentRanges) {
        currentRanges[0][0] = Math.min(currentRanges[0][0], ranges[0][0]);
        currentRanges[0][1] = Math.max(currentRanges[0][1], ranges[0][1]);
        currentRanges[1][0] = Math.min(currentRanges[1][0], ranges[1][0]);
        currentRanges[1][1] = Math.max(currentRanges[1][1], ranges[1][1]);
        currentRanges[2][0] = Math.min(currentRanges[2][0], ranges[2][0]);
        currentRanges[2][1] = Math.max(currentRanges[2][1], ranges[2][1]);
      }
      else {
        currentRanges = ranges;
      }

      if(isOn)
        this.mRangesOn = currentRanges;
      else
        this.mRangesOff = currentRanges; 
    }

    for(let x = this.mRangesOn[0][0]; x <= this.mRangesOn[0][1]; x++) 
        for(let y = this.mRangesOn[1][0]; y <= this.mRangesOn[1][1]; y++)
          for(let z = this.mRangesOn[2][0]; z <= this.mRangesOn[2][1]; z++) {

            this.mCubes.set(this.keyFromPos(x, y, z), true)
          }

    for(let x = this.mRangesOff[0][0]; x <= this.mRangesOff[0][1]; x++) 
      for(let y = this.mRangesOff[1][0]; y <= this.mRangesOff[1][1]; y++)
        for(let z = this.mRangesOff[2][0]; z <= this.mRangesOff[2][1]; z++) {

          this.mCubes.set(this.keyFromPos(x, y, z), false)
        }
  }

  public keyFromPos(aX: number, aY: number, aZ: number): string {
    return aX.toString() + ',' + aY.toString() + ',' + aZ.toString();
  }

  public getAllOnCubes(): number {
    return Array.from(this.mCubes.values()).filter(isOn => isOn).length;
  }
}

var input = new InputFile("./day22/input.txt");
var input1 = new InputFile("./day22/input1.txt");

var reactor = new Reactor(input1.getAsLines());
console.log(reactor.getAllOnCubes());