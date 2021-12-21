import { InputFile } from '../Common/InputFile'
import { writeFileSync } from 'fs'

class TrenchMap {

  private mAlgoritm: string;
  private mImage: Array<Array<string>>;

  constructor(aInput: Array<string>) {

    this.mImage = new Array<Array<string>>();

    this.mAlgoritm = aInput[0].split(' ').join('');
    
    aInput[1].split(' ').forEach(line => {
      this.mImage.push(line.split(''));
    })
  }

  private print(aImg: Array<Array<string>>) {
    let img: string = '';
    for(let y = 0; y < aImg.length; y++) {
      img += aImg[y].join('');
      img += '\n';
    }
    writeFileSync("./day20/output.txt", img);
  }

  private enlarge(aImg: Array<Array<string>>): Array<Array<string>> {
    const range = 150;
    let imgEnlarge = new Array<Array<string>>();
    for(let y = -1 * range; y < aImg.length + range; y ++) {
      let line = '';
      for(let x = -1 * range; x < aImg[0].length + range; x++) {
        line += (x < 0 || x >= aImg[0].length || y < 0 || y >= aImg.length) ? '.' : aImg[y][x];
      }
      imgEnlarge.push(line.split(''));
    }
    return imgEnlarge;
  }

  private shrink(aImg: Array<Array<string>>): Array<Array<string>> {
    const range = 50;
    let imgEnlarge = new Array<Array<string>>();
    for(let y = range; y < aImg.length - range; y ++) {
      let line = '';
      for(let x = range; x < aImg[0].length - range; x++) {
        line += aImg[y][x];
      }
      imgEnlarge.push(line.split(''));
    }
    return imgEnlarge;
  }

  public enhance(aTimes: number): number {

    let row = [ -1,  0,   1, -1, 0, 1, -1, 0, 1 ];
    let col = [ -1, -1 , -1,  0, 0, 0,  1, 1, 1 ];

    let enhanced = this.enlarge(this.mImage);
    
    while(aTimes > 0) {
      
      let enhanced1 = new Array<Array<string>>();
      for(let y1 = 0; y1 < enhanced.length; y1++)
        enhanced1.push(new Array<string>().fill('.'));

      for(let y = 0; y < enhanced.length; y ++) {
        for(let x = 0; x < enhanced[0].length; x++) {

          let binaryCode = new Array<number>();
          for(let i = 0; i < row.length; i++) {
            let x1 = x + row[i];
            let y1 = y + col[i];
            binaryCode[i] = 
              (x1 < 0 || x1 >= enhanced[0].length || y1 < 0 || y1 >= enhanced.length) ? 0 : enhanced[y1][x1] == '#' ? 1 : 0;
          }

          let code = parseInt(binaryCode.join(''), 2);
          enhanced1[y][x] = this.mAlgoritm[code];
        }
      }
      enhanced = enhanced1;
      aTimes --;
    }

    enhanced = this.shrink(enhanced);

    let count = 0;
    for(let y = 0; y < enhanced.length; y ++)
      for(let x = 0; x < enhanced[0].length; x++)
        count += enhanced[y][x] == '#' ? 1 : 0;
    
    //this.print(enhanced);

    return count;
  }
}

var input = new InputFile("./day20/input.txt");
var input1 = new InputFile("./day20/input1.txt");

var image = new TrenchMap(input.getAsGroups());
console.log(image.enhance(50));
