import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'difficultyPipe'
})
export class DifficultyPipe implements PipeTransform {

  transform(data: any): string {
    switch(data){
      case 'easy': return 'könnyű';
      case 'medium': return 'közepes';
      case 'hard': return 'nehéz';
      default: return '';
    }
  }

}
