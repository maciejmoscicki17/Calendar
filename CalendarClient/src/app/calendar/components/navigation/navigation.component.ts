import { animate, state, style, transition, trigger } from '@angular/animations'
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { CalendarService } from '../../services'

@Component({
    selector: 'navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateY(100%)' }),
                animate(
                    '1000ms ease-in',
                    style({ transform: 'translateY(0%)' })
                ),
            ]),
            transition(':leave', [
                style({ transform: 'translateY(0%)' }),
                animate(
                    '1000ms ease-in',
                    style({ transform: 'translateY(-100%)' })
                ),
            ]),
        ]),
    ],
})
export class NavigationComponent implements AfterViewInit {
    @ViewChild('monthContainer', { static: true })
    monthContainer!: ElementRef<HTMLDivElement>
    monthElements: string[] = ['Month 0', 'Month 1', 'Month 2']
    el1: string[] = ['Month 0']
    el2: string[] = ['Month 0', 'Month 1']

    currentIndex = 1 // Start with the middle element as active

    constructor(private calendarService: CalendarService) {}

    fade = false

    ngAfterViewInit(): void {
        // this.updateStyles()
    }

    onClick() {
        // Update the currentIndex and trigger the animation
        // const temp = (this.currentIndex + 1) % this.monthElements.length
        const temparr = [...this.monthElements]
        temparr.push(temparr.shift() as string)
        this.monthElements = temparr
        // this.currentIndex = (this.currentIndex + 1) % this.monthElements.length
        // this.updateStyles()
    }

    updateStyles() {
        setTimeout(() => {
            if (this.monthElements[0]) {
            }
        }, 200)
    }

    onLeftButtonClick() {
        this.calendarService.arrowLeft()
    }
    onRightButtonClick() {
        this.calendarService.arrowRight()
    }
}
