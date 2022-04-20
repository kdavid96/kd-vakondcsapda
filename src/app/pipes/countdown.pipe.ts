import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countdownPipe'
})
export class CountdownPipe implements PipeTransform {

  transform(data): string {
    let seconds = Math.floor(data/1000);
    let miliseconds = data - seconds * 1000;
    return seconds + ' s ' + miliseconds + ' ms';
  }

}
