import { InputFile } from '../Common/InputFile'

enum Includes {
  Braket = 0,
  SquareBraket,
  CurlyBraket,
  Grater
}

class SintaxScoring {
  
  private mErrors: Array<number>;
  private mAutoComplteScores: Array<number>;

  constructor(aInput: Array<string>) {

    this.mErrors = new Array<number>(4).fill(0);
    this.mAutoComplteScores = new Array<number>();

    aInput.forEach(line => {
      let error = this.checkSyntax(line.split(''));
      if(error != -1)
        this.mErrors[error] ++;
      else
       this.mAutoComplteScores.push(this.autoComplete(line.split('')));
    })
  }

  private checkSyntax(aLine: Array<string>): number {

    let opened = new Array<number>();

    for(let ch of aLine) {
      switch(ch) {
        case '(':
          opened.push(Includes.Braket);
          break;
        case ')':
          let last = opened.pop();
          if(last != Includes.Braket)
            return Includes.Braket;
          break;
        case '[':
          opened.push(Includes.SquareBraket);
          break;
        case ']':
          last = opened.pop();
          if(last != Includes.SquareBraket)
            return Includes.SquareBraket;
          break;
        case '{':
          opened.push(Includes.CurlyBraket);
          break;
        case '}':
          last = opened.pop();
          if(last != Includes.CurlyBraket)
            return Includes.CurlyBraket;
          break;
        case '<':
          opened.push(Includes.Grater);
          break;
        case '>':
          last = opened.pop();
          if(last != Includes.Grater)
            return Includes.Grater;
          break;
      }
    }

    return -1;
  }

  public autoComplete(aLine: Array<string>): number {

    let closed = new Array<number>();
    let autoCompleteScore = 0;

    const getSocre = function(aScore: number): number {
      autoCompleteScore *= 5;
      return autoCompleteScore += aScore;
    }

    for(let ch of aLine.reverse()) {
      switch(ch) {
        case ')':
          closed.push(Includes.Braket);
          break;
        case '(':
          let last = closed.pop();
          if(last != Includes.Braket)
            getSocre(1);
          break;
        case ']':
          closed.push(Includes.SquareBraket);
          break;
        case '[':
          last = closed.pop();
          if(last != Includes.SquareBraket)
            getSocre(2);
          break;
        case '}':
          closed.push(Includes.CurlyBraket);
          break;
        case '{':
          last = closed.pop();
          if(last != Includes.CurlyBraket)
            getSocre(3);
          break;
        case '>':
          closed.push(Includes.Grater);
          break;
        case '<':
          last = closed.pop();
          if(last != Includes.Grater)
            getSocre(4);
          break;
      }
    }
    return autoCompleteScore;
  }

  public getErrorScore(): number {
    let errorScore = [3, 57, 1197, 25137];
    return this.mErrors.map((error, idx) => error * errorScore[idx])
                       .reduce((prev, cur) => prev + cur);
  }

  public getAutoCompleteScore(): number {
    this.mAutoComplteScores.sort((a, b) => a - b);
    let middle = Math.floor(this.mAutoComplteScores.length / 2);
    return this.mAutoComplteScores[middle];
  }
}

var input = new InputFile("./day10/input.txt");
var input1 = new InputFile("./day10/input1.txt");

var sintax = new SintaxScoring(input.getAsLines());
console.log(sintax.getErrorScore());
console.log(sintax.getAutoCompleteScore());
