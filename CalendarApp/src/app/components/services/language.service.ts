import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private _language: 'en' | 'pl' = 'en';
  public set language(value: 'en' | 'pl') {
    this._language = value;
    localStorage.setItem('language', this._language);
    this.currentLanguage$.next(this._language);
  }
  public get language(): 'en' | 'pl' {
    return this._language;
  }
  public currentLanguage$ = new BehaviorSubject<'en' | 'pl'>(this.language);
  constructor() {
    const lang = localStorage.getItem('language');
    if (lang !== null && (lang === 'en' || lang === 'pl')) {
      this.language = lang;
    }
  }

  public toggleLanguage(): void {
    this.language = this.language === 'en' ? 'pl' : 'en';
    // this.currentLanguage$.next(this.language)
  }
}
