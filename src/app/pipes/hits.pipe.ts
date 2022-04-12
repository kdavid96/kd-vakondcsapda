import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hitsPipe'
})
export class HitsPipe implements PipeTransform {

  transform(data: any): string {
    return data.toFixed(2);
  }
}
