import { Injectable } from '@angular/core';
import { TranslationsEnum } from '../models';

@Injectable({ providedIn: 'root' })
export class TranslatorService {
  translate(key: TranslationsEnum) {
    return 'aaa';
  }
}
