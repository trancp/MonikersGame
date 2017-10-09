import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'appToIdString'
})
export class ToIdStringPipe implements PipeTransform {
    transform(text: string): string {
        return '';
    }
}
