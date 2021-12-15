import { InputFile } from '../Common/InputFile'

class Chiton {

  private mMap: Array<Array<number>>;

  constructor(aInput: Array<string>) {

    this.mMap = new Array<Array<number>>();
    aInput.forEach(line => {
      this.mMap.push(line.split('').map(nr => Number(nr)));
    })
  }
}
var input = new InputFile("./day15/input.txt");
var input1 = new InputFile("./day15/input1.txt");

var chiton = new Chiton(input1.getAsLines());
console.log();