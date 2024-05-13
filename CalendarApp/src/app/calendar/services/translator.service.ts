import { Injectable } from '@angular/core';
import { TranslationsEnum } from '../models';
import { Translation } from '../models/translation';
import * as translationJson from '../assets/translations.json';
@Injectable({ providedIn: 'root' })
export class TranslatorService {
  translations: Translation[];
  private currentLanguage: 'en' | 'pl' = 'en';

  constructor() {
    this.translations = translationJson.translations as Translation[];
  }
  setCurrentLanguage(lang: 'en' | 'pl'): void {
    this.currentLanguage = lang;
  }

  translate(enumField: TranslationsEnum): string {
    var translation: string | undefined;
    switch (this.currentLanguage) {
      case 'en':
        translation = this.translations.find(
          (x) => x.name === TranslationsEnum[enumField]
        )?.en;
        break;
      case 'pl':
        translation = this.translations.find(
          (x) => x.name === TranslationsEnum[enumField]
        )?.pl;
        break;
    }
    if (typeof translation !== 'string')
      throw new Error('No such field in the dictionary.');
    return translation;
  }
}
