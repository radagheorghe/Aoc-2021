import { InputFile } from '../Common/InputFile'
import { last } from '../Common/Util'

class Polymerization {
  
  private mSeq: string;
  private mRules: Map<string, string>;

  constructor(aInput: Array<string>) {

    this.mSeq = aInput[0];
    this.mRules = new Map<string, string>();
    aInput[1].split(';').forEach(pairs => {
      let pair = pairs.split("->").map(p => p.trim());
      this.mRules.set(pair[0], pair[1]);
    })
  }

  public apply(aSteps: number): number {

    let seq1 = this.mSeq.substring(0, this.mSeq.length / 2);
    let seq2 = this.mSeq.substring(this.mSeq.length / 2, this.mSeq.length);

    let seqs = this.mSeq.split('');

    const getFromIndex = function(aIdx: number): string {
      let prevLength = 0;
      for(let seq of seqs) {
        if(aIdx <= prevLength) {
          return seq[aIdx - prevLength];
        }
        prevLength += seq.length;
      }
    }

    for(let step = 0; step < aSteps; step++) {
      
      console.log(seqs.join());

      let newSeqs = new Array<string>(seqs.length);
      
      const appendSeq = function(aIdx: number, aPair: string) {
        let prev = '';
        let seqIdx = 0;
        let prevLength = 0;
        for(let seq of seqs) {
          if(aIdx <= prevLength) {
            newSeqs[seqIdx] += seq[aIdx - prev.length] + aPair;
          }
          prev = seq;
          seqIdx ++;
        }
      }

      for(let i = 0; i < seq1.length + seq2.length - 1; i++) {

        let pair = getFromIndex(i) + getFromIndex(i+1);
        appendSeq(i, this.mRules.get(pair));
      }
      seqs = Array.from(newSeqs);
    }

    let mapCount = new Map<string, number>();
    for(let i = 0; i < this.mSeq.length; i++) {
      if(mapCount.has(this.mSeq[i]))
        mapCount.set(this.mSeq[i], mapCount.get(this.mSeq[i]) + 1);
      else
        mapCount.set(this.mSeq[i], 1);
    }

    let values = Array.from(mapCount.values());
    return Math.max(...values) - Math.min(...values);
  }
}

var input = new InputFile("./day14/input.txt");
var input1 = new InputFile("./day14/input1.txt");

var poly = new Polymerization(input1.getAsGroups(';'));
console.log(poly.apply(40));

