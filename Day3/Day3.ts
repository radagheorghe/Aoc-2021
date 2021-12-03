import { InputFile } from '../Common/InputFile'

type RateType = "oxigen" | "co2" | undefined;

class DiagnosticReport {
  
  private mInput: Array<string>;
 
  constructor(aInput: Array<string>) {

    this.mInput = aInput;
  }

  public getPowerCosumtion(): number {
    
    let lineLen = this.mInput[0].length;
    let bitsCount = new Array<number>(lineLen).fill(0);

    this.mInput.forEach(line => {
      for(let i = 0; i< lineLen; i++)
        bitsCount[i] += Number(line[i]) == 0 ? -1 : 1;
    });

    let gamaRate = parseInt(bitsCount.map(bitCount => bitCount > 0 ? 1 : 0).join(""), 2);
    let epsilonRate = parseInt(bitsCount.map(bitCount => bitCount > 0 ? 0 : 1).join(""), 2);
    
    return gamaRate * epsilonRate;
  }

  private getRate(aInput: Array<string>, aPos: number, aRateType: RateType) :number {
    
    if(aInput.length == 1) {
      return parseInt(aInput[0], 2);
    }
    else {
      
      let zeroBits = new Array<string>();
      let oneBits = new Array<string>();

      aInput.forEach(line => {
        if(line[aPos] == '0')
          zeroBits.push(line);
        else 
          oneBits.push(line);
      });

      return this.getRate(aRateType == "oxigen" ? (oneBits.length >= zeroBits.length ? oneBits : zeroBits) : 
                                                  (oneBits.length < zeroBits.length ? oneBits : zeroBits), 
                          aPos + 1, aRateType);
    }
  }

  public getLifeSupportRating(): number {
    return this.getRate(this.mInput, 0, "oxigen") * this.getRate(this.mInput, 0, "co2"); 
  }
}

var input = new InputFile("./day3/input.txt");
var input1 = new InputFile("./day3/input1.txt");

var report = new DiagnosticReport(input.getAsLines());
console.log(report.getPowerCosumtion());
console.log(report.getLifeSupportRating());