import { Component } from '@angular/core';
import { CALENDAR_TOKEN } from '../../calendar/models';
import { CalendarProviderService } from '../../services/calendar.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss',
  providers: [{ provide: CALENDAR_TOKEN, useClass: CalendarProviderService }],
})
export class DemoComponent {
  currentLanguage: Observable<'en' | 'pl'>;
  loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    private languageService: LanguageService,
    private loaderService: LoaderService
  ) {
    this.currentLanguage = this.languageService.currentLanguage$.asObservable();
    this.loading.subscribe((x) => this.loaderService.showLoader(x));
  }
}
