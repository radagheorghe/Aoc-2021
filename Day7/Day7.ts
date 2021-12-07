import { InputFile } from '../Common/InputFile'

class CrabsSubmarine {
  
  private mCrabs: Array<number>;

  constructor(aInput: string) {
    this.mCrabs = aInput.split(',').map(crabPos => Number(crabPos));
  }

  public getMinFuel(aPart: number): number {

    let min = Math.min(...this.mCrabs);
    let max = Math.max(...this.mCrabs);

    let crabsPosFuel = new Array<number>(max + 1).fill(0);
    for(let hzPos = min; hzPos <= max; hzPos++) {
        this.mCrabs.forEach(crabPos => {

            let steps = Math.abs(crabPos - hzPos);
            if(aPart == 1) 
              crabsPosFuel[hzPos] += steps;
            else {                
                for(let step = 1; step <= steps; step++) {                
                    crabsPosFuel[hzPos] += step;
                }
            }
        })
    }

    crabsPosFuel.sort((a, b) => a - b);

    return crabsPosFuel[0];
  }
}

var input = new InputFile("./day7/input.txt");
var input1 = new InputFile("./day7/input1.txt");

var crabs = new CrabsSubmarine(input.getContent());
console.log(crabs.getMinFuel(1));
console.log(crabs.getMinFuel(2));