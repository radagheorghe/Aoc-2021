import { InputFile } from '../Common/InputFile'

var input = new InputFile("./day1/input.txt");

let array = input.getAsArray();

function getIncreased(aInput: Array<number>) {
  let incresead = 0;
  for(let i = 1; i < aInput.length; i++) {
    if(aInput[i] > aInput[i-1])
      incresead ++;
  }
  return incresead;
}

console.log("Part 1:" + getIncreased(array));

let arrayWindow = new Array<number>();
for(let i = 0; i < array.length; i++) {
  let sum = 0;
  for(let j = 0; j < 3; j++) {
    sum += array[i+j];
  }
  arrayWindow.push(sum);
}

console.log("Part 2:" + getIncreased(arrayWindow));
