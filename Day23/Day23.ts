import { InputFile } from '../Common/InputFile'

class Point {

  mX: number;
  mY: number;

  constructor(aX: number, aY: number) {
    this.mX = aX;
    this.mY = aY;
  }
}

interface IAmphipod {
  isFinalDest(): boolean;
  getEnergy(): number;
}

class AmphipodA implements IAmphipod  {

  public mPos: Point;

  constructor(aX: number, aY: number) {
    this.mPos = new Point(aX, aY);
  }

  isFinalDest(): boolean {
    return this.mPos.mX == 3 && (this.mPos.mY == 2 || this.mPos.mY == 3);
  }

  getEnergy(): number {
    return 1;
  }
}

class AmphipodB implements IAmphipod  {

  public mPos: Point;

  constructor(aX: number, aY: number) {
    this.mPos = new Point(aX, aY);
  }

  isFinalDest(): boolean {
    return this.mPos.mX == 5 && (this.mPos.mY == 2 || this.mPos.mY == 3);
  }

  getEnergy(): number {
    return 10;
  }
}

class AmphipodC implements IAmphipod  {

  public mPos: Point;

  constructor(aX: number, aY: number) {
    this.mPos = new Point(aX, aY);
  }

  isFinalDest(): boolean {
    return this.mPos.mX == 7 && (this.mPos.mY == 2 || this.mPos.mY == 3);
  }

  getEnergy(): number {
    return 100;
  }
}

class AmphipodD implements IAmphipod  {

  public mPos: Point;

  constructor(aX: number, aY: number) {
    this.mPos = new Point(aX, aY);
  }

  isFinalDest(): boolean {
    return this.mPos.mX == 9 && (this.mPos.mY == 2 || this.mPos.mY == 3);
  }

  getEnergy(): number {
    return 1000;
  }
}

class State {

  public mAmphipods: Array<IAmphipod>;
  
  constructor() {
    this.mAmphipods = new Array<IAmphipod>();
  }

  public push(aAmphipod: IAmphipod) {
    this.mAmphipods.push(aAmphipod);
  }

  public getNewStates(): Array<State> {
    return new Array<State>();
  }

  public getCost(): number {
    return 0;
  }

  public isFinalState(): boolean {

    let count = 0;
    for(let i = 0 ; i < this.mAmphipods.length; i++) {
      count += this.mAmphipods[i].isFinalDest() ? 1 : 0;
    }
    return count == this.mAmphipods.length;
  }
}

class AmphipodPuzzle {

  private mMap: Array<Array<string>>;
  private mInitialState: State;

  constructor(aInput: Array<string>) {

    this.mInitialState = new State();
    this.mMap = new Array<Array<string>>();

    let y = 0;
    aInput.forEach(line => {
      let arrayLine = line.split('');
      this.mMap.push(arrayLine);
      let x = 0;
      for(let ch of arrayLine) {

        switch(ch) {
          case 'A':
            this.mInitialState.push(new AmphipodA(x, y));
            break;
          case 'B':
            this.mInitialState.push(new AmphipodB(x, y));
            break;
          case 'C':
            this.mInitialState.push(new AmphipodC(x, y));
            break;
          case 'D':
            this.mInitialState.push(new AmphipodD(x, y));
            break;
        }

        x++;
      }
      y++;
    })
  }

  public solve(): number {
    
    let visited = new Array<State>();
    
    let q = new Array<{state: State, cost: number}>();

    visited.push(this.mInitialState);
    q.push({state: this.mInitialState, cost: 0});

    while (q.length != 0)
    {
      q.sort((a, b) => b.cost - a.cost);
      let node = q.pop();
      
      let crState = node.state;
      let dist = node.cost;
      
      if (crState.isFinalState())
        return dist;

      crState.getNewStates().forEach(newState => {
        // test if not already visited first
        q.push({state: newState, cost: dist + newState.getCost()});
      })
    }

    return -1;
  }
}

var input = new InputFile("./day23/input.txt");
var input1 = new InputFile("./day23/input1.txt");

var puzzle = new AmphipodPuzzle(input1.getAsLines());
console.log(puzzle.solve());