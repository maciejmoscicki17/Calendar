import { Component, Inject } from '@angular/core'
import { ProviderService } from './utils/calendar-provider'
import { CALENDAR_TOKEN } from '../calendar/models'

@Component({
    selector: 'demo',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.scss'],
    providers: [{ provide: CALENDAR_TOKEN, useClass: ProviderService }],
})
export class DemoComponent {
    constructor() {}
}
