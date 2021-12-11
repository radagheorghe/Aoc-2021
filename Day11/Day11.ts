import { InputFile } from '../Common/InputFile'

const mapSize = 10;

class DumboOctopus {
  
  private mMap: Array<Array<number>>;
  private mAllFlashesStep: number;

  constructor(aInput: Array<string>) {

    this.mMap = new Array<Array<number>>();
    
    aInput.forEach(line => {
      this.mMap.push(line.split('').map(nr => Number(nr)));
    })
  }

  private flash(aX: number, aY: number, aFlashed: Array<{x: number, y: number}>) {

    this.mMap[aY][aX] = 0;
    aFlashed.push({x: aX, y: aY});

    const neighbours: Array<{x: number, y: number}> = [
      {x: 0, y: 1},
      {x: 0, y: -1},
      {x: 1, y: 0},
      {x: -1, y: 0},
      {x: 1, y: 1},
      {x: 1, y: -1},
      {x: -1, y: -1},
      {x: -1, y: 1},
    ]
    
    const isValidNeighbour = function(aNeighbour: {x: number, y: number}) {
      return aNeighbour.x >= 0 && aNeighbour.x < mapSize && 
             aNeighbour.y >= 0 && aNeighbour.y < mapSize;
    }

    const alreadyFlashed = function(aOcto: {x: number, y: number}): boolean {
      return aFlashed.find(elem => elem.x == aOcto.x && elem.y == aOcto.y) != undefined;
    }

    for(let neighbor of neighbours) {
      let octo = {x: aX + neighbor.x, y: aY + neighbor.y};
      if(isValidNeighbour(octo) && !alreadyFlashed(octo)) {
        this.mMap[octo.y][octo.x] ++;
        if(this.mMap[octo.y][octo.x] > 9)
          this.flash(octo.x, octo.y, aFlashed);
      }
    }
  }

  public simulate(): number {

    let step = 1;
    let flashes = 0;
    while(true) {

      let flashed =  Array<{x: number, y: number}>();

      for(let y = 0; y < mapSize; y++) {
        for(let x = 0; x < mapSize; x++) {
          this.mMap[y][x] ++;
          if(this.mMap[y][x] > 9) 
            this.flash(x, y, flashed);
        }
      }
      for(let octo of flashed)
        this.mMap[octo.y][octo.x] = 0;

      if(step <= 100)
        flashes += flashed.length;

      if(flashed.length == mapSize * mapSize) {
        this.mAllFlashesStep = step;
        break;
      }

      step ++;
    }
    return flashes;
  }

  public getAllFlashesStep() {
    return this.mAllFlashesStep;
  }
}

var input = new InputFile("./day11/input.txt");
var input1 = new InputFile("./day11/input1.txt");
var input2 = new InputFile("./day11/input2.txt");

var octopus = new DumboOctopus(input.getAsLines());
console.log(octopus.simulate());
console.log(octopus.getAllFlashesStep());
