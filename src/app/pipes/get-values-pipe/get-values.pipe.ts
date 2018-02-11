import { Pipe, PipeTransform } from '@angular/core';

import values from 'lodash-es/values';

@Pipe({
    name: 'appGetValues',
})
export class GetValuesPipe implements PipeTransform {
    transform(object: any) {
        return values(object);
    }
}
