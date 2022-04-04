import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timelinePipe'
})
export class TimelinePipe implements PipeTransform {

  transform(data: any): string {
    if(data){
      let seconds = Math.floor(data.miliseconds/1000);
      let miliseconds = data.miliseconds - seconds * 1000;  
      return seconds ? seconds + ' s ' + miliseconds + ' ms' : miliseconds + ' ms';
    }else return null;
  }
}
