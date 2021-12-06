import { time } from 'console';
import { InputFile } from '../Common/InputFile'

class Simulation {
  
  private mLanternfish: Array<number>;

  constructor(aInput: string) {
    this.mLanternfish = aInput.split(',').map(timer => Number(timer));
  }

  public Simulate(aDays: number): number {

    let allFish = this.mLanternfish.length;
    //todo
    this.mLanternfish.forEach(timer => {
      let daysLeft = aDays;
      let childs = 0;
      while(daysLeft > 6) {
        let daysPassed = aDays - daysLeft;

        if(childs > 0 && daysPassed + 9 < aDays) 
          childs *= 2;
        
        childs ++;
        daysLeft -= timer + 1;
        timer = 6;
      }
      allFish += childs;
    })

    return allFish;
  }
}

var input = new InputFile("./day6/input.txt");
var input1 = new InputFile("./day6/input1.txt");

var life = new Simulation(input1.getContent());
console.log(life.Simulate(80));