import { Pipe, PipeTransform } from '@angular/core'
import { TranslationService } from '../services/translation.service'
import { TranslationsEnum } from '../models'

@Pipe({
    name: 'translate',
})
export class TranslatePipe implements PipeTransform {
    constructor(private translateService: TranslationService) {}
    transform(translation: TranslationsEnum) {
        return this.translateService.getTranslation(translation)
    }
}
