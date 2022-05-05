import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translatePipe'
})
export class TranslatePipe implements PipeTransform {

  transform(data): string {
    switch(data) {
      case 'easy': return 'könnyű'
      case 'medium': return 'közepes'
      case 'hard': return 'nehéz'
      default: return 'könnyű'
    }
  }

}
