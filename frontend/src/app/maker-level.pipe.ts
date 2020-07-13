import { Pipe, PipeTransform } from '@angular/core';
import { Level } from './teatime.models';

@Pipe({
  name: 'makerLevel'
})
export class MakerLevelPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return Level[value];
  }

}
