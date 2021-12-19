import { InputFile } from '../Common/InputFile'
import { isNumber, last, cloneArray } from '../Common/Util'

interface IPair {

  isRegularNumber(): boolean;
  add(aNumber: number);
  getAsValue(): number;
  toString(): string;
  getFirstRegularNumber(aLeft: boolean): RegularNumber;
  includes(aSnailFish: Snailfish, aLeft): boolean;
  explode(): boolean;
  split(): boolean;
  getMagnitude(): number;
}

class RegularNumber implements IPair {

  public mNumber: number;
  public mParent: Snailfish;

  constructor(aStrNumber: string, aParent: Snailfish) {
    this.mNumber = Number(aStrNumber);
    this.mParent = aParent;
  }

  public clone(aParent: Snailfish): RegularNumber {
    return new RegularNumber(this.mNumber.toString(), aParent);
  }

  isRegularNumber(): boolean {
    return true;
  }

  add(aNumber: number) {
    this.mNumber += aNumber;
  }

  getAsValue(): number {
    return this.mNumber;
  }

  toString(): string {
    return this.mNumber.toString();
  }

  getFirstRegularNumber(aLeft: boolean): RegularNumber {
    aLeft; // not used
    return this;
  }

  includes(aSnailFish: Snailfish, aLeft: any): boolean {
    return false;
  }

  explode(): boolean {
    return false;
  }

  split(): boolean {

    if(this.mNumber > 9) {
      let newSnailFish = new Snailfish(this.mParent);
      newSnailFish.append(new RegularNumber(Math.floor(this.mNumber/2).toString(), newSnailFish)); // left
      newSnailFish.append(new RegularNumber(Math.ceil(this.mNumber/2).toString(), newSnailFish)); // right
      
      if(this.mParent.mLeft == this)
        this.mParent.mLeft = newSnailFish;
      else if(this.mParent.mRight == this)
        this.mParent.mRight = newSnailFish;

      return true;
    }

    return false;
  }

  getMagnitude(): number {
    return this.mNumber;
  }
}

class Snailfish implements IPair {

  public mLeft: RegularNumber | Snailfish | undefined;
  public mRight: RegularNumber | Snailfish | undefined;
  
  public mParent: Snailfish | undefined;

  constructor(aParent: Snailfish | undefined = undefined) {
    this.mParent = aParent;
  }

  public clone(aParent: Snailfish = undefined): Snailfish {

    let clone = new Snailfish(aParent);
    clone.mLeft = this.mLeft.clone(clone);
    clone.mRight = this.mRight.clone(clone);

    return clone;
  }

  public append(aElem: RegularNumber | Snailfish) {

    if(this.mLeft == undefined)
      this.mLeft = aElem;
    else
      this.mRight = aElem;
  }

  isRegularNumber(): boolean {
    return false;
  }

  add(aNumber: number) {
    aNumber; // not used
  }

  getAsValue(): number {
    return 0;
  }

  getFirstRegularNumber(aLeft: boolean): RegularNumber {
    if(aLeft)
      return this.mLeft.getFirstRegularNumber(aLeft);
    
    return this.mRight.getFirstRegularNumber(aLeft);
  }

  includes(aSnailFish: Snailfish, aLeft: boolean): boolean {
    if(this == aSnailFish)
      return true;
        
    return aLeft ? this.mLeft.includes(aSnailFish, aLeft) :
                   this.mRight.includes(aSnailFish, aLeft);
  }

  explode(): boolean {

    let parent = this.mParent;

    let nrOfParents = 0;
    while(parent != undefined) {
      nrOfParents ++;
      parent = parent.mParent;
    }

    if(nrOfParents == 4) {

      let isLeft = this.mParent.mLeft == this;

      let rightParent = this.mParent;
      while(rightParent && rightParent.mRight.includes(this, isLeft)) {
        rightParent = rightParent.mParent;
      }
      let leftParent = this.mParent;
      while(leftParent && leftParent.mLeft.includes(this, isLeft)) {
        leftParent = leftParent.mParent;
      }

      if(leftParent) {
        let firstLeftRegularNumber = leftParent.mLeft.getFirstRegularNumber(false);
        firstLeftRegularNumber.add(this.mLeft.getAsValue());
      }
      if(rightParent) {
        let firstRightRegularNumber = rightParent.mRight.getFirstRegularNumber(true);
        firstRightRegularNumber.add(this.mRight.getAsValue());
      }
      
      if(this.mParent.mLeft == this)
        this.mParent.mLeft = new RegularNumber('0', this.mParent);
      else 
        this.mParent.mRight = new RegularNumber('0', this.mParent);        

      return true;
    }

    let exploded = this.mLeft.explode();
    if(exploded)
      return true;

    return this.mRight.explode();
  }

  split(): boolean {
    let splited = this.mLeft.split();
    if(splited)
      return true;

    return this.mRight.split();
  }

  public reduce() {

    while(this.mLeft.explode() || this.mRight.explode() || this.mLeft.split() || this.mRight.split()) {
      //console.log(this.toString());
      this.reduce();
    }
  }

  toString() {
    let str = '[';
    str += this.mLeft.toString();
    str += ',';
    str += this.mRight.toString();
    str += ']';

    return str;
  }

  getMagnitude(): number {
    return 3 * this.mLeft.getMagnitude() + 2 * this.mRight.getMagnitude();
  }
}

class HomeWork {

  private mSnailFishes: Array<Snailfish>;

  constructor(aInput: Array<string>) {

    this.mSnailFishes = new Array<Snailfish>();

    aInput.forEach(line => {
      
      let stack = new Array<Snailfish>();
      this.mSnailFishes.push(new Snailfish());
      stack.push(last(this.mSnailFishes));

      line = line.slice(1, line.length - 1);
      for(let ch of line) {
        switch(ch) {
          case '[':
            let lastSnail = last(stack);
            let newSnailFish = new Snailfish(lastSnail);
            lastSnail.append(newSnailFish);
            stack.push(newSnailFish);
            break;
          case ']':
            stack.pop();
            break;
          default:
            if(isNumber(ch)) {
              lastSnail = last(stack);
              lastSnail.append(new RegularNumber(ch, lastSnail));
            }
            break;
        }
      }
    })
  }

  private sum(aSnail1: Snailfish, aSnail2: Snailfish): Snailfish {
    let sum = new Snailfish();
    sum.append(aSnail1);
    aSnail1.mParent = sum;
    sum.append(aSnail2);
    aSnail2.mParent = sum;
    sum.reduce();

    return sum;
  }

  public doSum(): number {
    
    let sum = this.sum(this.mSnailFishes[0].clone(), this.mSnailFishes[1].clone());
    for(let i = 2; i < this.mSnailFishes.length; i++) {
      sum = this.sum(sum, this.mSnailFishes[i].clone());
    }
    console.log(sum.toString());
    return sum.getMagnitude();
  }

  public getMaxMagnitude(): number {

    let magnitudes = new Array<number>();
    for(let i = 0; i < this.mSnailFishes.length; i++) 
      for(let j = i + 1; j < this.mSnailFishes.length; j++) {
        let a = this.mSnailFishes[i].clone(); 
        let b = this.mSnailFishes[j].clone();
        magnitudes.push(this.sum(a, b).getMagnitude());
        a = this.mSnailFishes[i].clone(); 
        b = this.mSnailFishes[j].clone();
        magnitudes.push(this.sum(b, a).getMagnitude());
      }

    return Math.max(...magnitudes);
  }
}

var input = new InputFile("./day18/input.txt");
var input1 = new InputFile("./day18/input1.txt");
var input2 = new InputFile("./day18/input2.txt");

var homeWork = new HomeWork(input.getAsLines());
console.log(homeWork.doSum());
console.log(homeWork.getMaxMagnitude());