import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'urlformart',
  pure: false
})
export class UrlFormartPipe implements PipeTransform {
  transform(value: any): string {
    return value.substring(value.indexOf('\.') + 1, value.length);
  }
}


