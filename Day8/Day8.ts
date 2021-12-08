import { InputFile } from '../Common/InputFile'

class Decoder {
  
  private mInput: Array<string>;

  constructor(aInput: Array<string>) {

    this.mInput = aInput;
  }

  private getNumber(aSegCode: string, aSegments: Array<string>): number {

    let map = new Map();
    map.set("013456", 0);
    map.set("13", 1);
    map.set("01245", 2);
    map.set("01234", 3);
    map.set("1236", 4);
    map.set("02346", 5);
    map.set("023456", 6);
    map.set("013", 7);
    map.set("0123456", 8);
    map.set("012346", 9);

    let segOn = aSegments.map(seg => aSegCode.includes(seg) ? seg : '');

    let idx = segOn.map((seg, idx) => seg != '' ? idx : -1).filter(seg => seg != -1).join('');
    return map.get(idx);
  }

  private decodeNumbers(aInput: Array<string>): Array<string> {

    let segments = new Array<string>(7);

    let one = aInput.find(segments => segments.length == 2);
    let four = aInput.find(segments => segments.length == 4);
    let seven = aInput.find(segments => segments.length == 3);
    let eight = aInput.find(segments => segments.length == 7);

    seven = seven.split('').filter(ch => !one.includes(ch)).join('');
    four = four.split('').filter(ch => !one.includes(ch)).join('');

    segments[1] = one[0];
    segments[3] = one[1];
    segments[0] = seven[0];

    let fiveSeg = aInput.filter(segments => segments.length == 5);
    fiveSeg = fiveSeg.map(seg => seg.split('').filter(ch => !segments.includes(ch)).join(''));
    let three = fiveSeg.find(seg => seg.length == 2);

    segments[2] = three.split('').filter(ch => four.includes(ch)).join('');
    segments[6] = four.split('').filter(ch => !segments.includes(ch)).join('');
    segments[4] = three.split('').filter(ch => !segments.includes(ch)).join('');
    segments[5] = eight.split('').filter(ch => !segments.includes(ch)).join('');

    return segments;
  }

  public Decode(): number {

    let count = 0;
    this.mInput.forEach(line => {
      let signal = line.split('|');

      let numbers = signal[0].trim().split(' ');
      let output = signal[1].trim().split(' ');

      let segments = this.decodeNumbers(numbers);

      let nrStr: string = '';
      output.forEach(number => {
        let nr = this.getNumber(number, segments);
        nrStr += nr.toString();
      })
      count += Number(nrStr);
    })

    return count;
  }
}

var input = new InputFile("./day8/input.txt");
var input1 = new InputFile("./day8/input1.txt");
var input2 = new InputFile("./day8/input2.txt");

var decoder = new Decoder(input1.getAsLines());
console.log(decoder.Decode());