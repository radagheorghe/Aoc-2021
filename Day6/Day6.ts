import { InputFile } from '../Common/InputFile'

class Simulation {
  
  private mLanternfish: Array<number>;

  constructor(aInput: string) {
    this.mLanternfish = aInput.split(',').map(timer => Number(timer));
  }

  public Simulate(aDays: number): number {

    const getChild = function(aTimer: number, aDaysLeft: number): number {

      let childs = aDaysLeft >= 0 ? 1 : 0;
      while(aDaysLeft >= 0) {
       
        aDaysLeft -= aTimer + 1;
        childs += getChild(8, aDaysLeft);
        aTimer = 6;
      }
      return childs;
    }

    let allFish = 0;
    let fishPassed = 0;
    let map = new Map();

    this.mLanternfish.forEach(timer => {
      
      fishPassed ++;
      let childFish = 0;

      if(map.has(timer))
        childFish += map.get(timer);
      else {
        childFish = getChild(timer, aDays);
        map.set(timer, childFish);
      }
      allFish += childFish;
      console.log(allFish + " - fish remaining " + (this.mLanternfish.length - fishPassed) + "\n");
    })

    return allFish;
  }
}

var input = new InputFile("./day6/input.txt");
var input1 = new InputFile("./day6/input1.txt");

var life = new Simulation(input.getContent());
console.log(life.Simulate(256));