import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  _showLoader = false;
  constructor() {}

  loader$ = new Subject<boolean>();

  showLoader(value: boolean): void {
    this._showLoader = value;
    this.loader$.next(value);
  }

  shootLoader(milliseconds: number) {
    if (milliseconds < 0 && milliseconds > 1000) {
      milliseconds = 2000;
    }
    this.showLoader(true);
    setTimeout(() => {
      this.showLoader(false);
    }, milliseconds);
  }
}
