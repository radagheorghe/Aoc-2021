import { InputFile } from '../Common/InputFile'
import { diff, includes } from '../Common/Util';

class Decoder {
  
  private mInput: Array<string>;
  private mSegToNumberMap: Map<string, number>;

  constructor(aInput: Array<string>) {

    this.mSegToNumberMap = new Map([
      ["013456",  0],
      ["13",      1],
      ["01245",   2],
      ["01234",   3],
      ["1236",    4],
      ["02346",   5],
      ["023456",  6],
      ["013",     7],
      ["0123456", 8],
      ["012346",  9],
    ]);

    this.mInput = aInput;
  }

  private getNumber(aSegCode: string, aSegments: Array<string>): number {

    let segOn = aSegCode.split('').map(seg => aSegments.indexOf(seg))
                        .sort((a, b) => a - b).join('');

    return this.mSegToNumberMap.get(segOn);
  }

  private decodeSegments(aInput: Array<string>): Array<string> {

    let segments = new Array<string>(7);

    // identify segments
    let one = aInput.find(seg => seg.length == 2).split('');
    let four = aInput.find(seg => seg.length == 4).split('');
    let seven = aInput.find(seg => seg.length == 3).split('');
    let eight = aInput.find(seg => seg.length == 7).split('');

    // seg 0 is 7 without 1
    segments[0] = seven.filter(seg => !includes(seg, one)).join('');

    // get nrs with 5 segments
    let fiveSeg = aInput.filter(seg => seg.length == 5).map(seg => seg.split('')
                        .filter(seg => !includes(seg, segments, one)));
    let three = fiveSeg.find(seg => seg.length == 2);

    // remove segs of 1 from 4
    four = four.filter(seg => !one.includes(seg));

    segments[2] = three.find(seg => includes(seg, four));
    segments[6] = four.find(seg => !includes(seg, segments, one));
    segments[4] = three.find(seg => !includes(seg, segments, one));
    segments[5] = eight.find(seg => !includes(seg, segments, one));

    let sixNine = aInput.filter(seg => seg.length == 6).filter(seg => seg.includes(segments[2]));
    let seg1 = diff(sixNine[0].split(''), sixNine[1].split('')).find(seg => seg != segments[5]);
    
    segments[1] = seg1;
    segments[3] = one.find(seg => seg != seg1);

    return segments;
  }

  public Decode(): number {

    let count = 0;
    this.mInput.forEach(line => {
      let signal = line.split('|');

      let numbers = signal[0].trim().split(' ');
      let output = signal[1].trim().split(' ');

      let segments = this.decodeSegments(numbers);

      let strNumber: string = ''; // we append as strings
      output.forEach(number => strNumber += this.getNumber(number, segments).toString());

      count += parseInt(strNumber);
    })

    return count;
  }
}

var input = new InputFile("./day8/input.txt");
var input1 = new InputFile("./day8/input1.txt");
var input2 = new InputFile("./day8/input2.txt");

var decoder = new Decoder(input.getAsLines());
console.log(decoder.Decode());