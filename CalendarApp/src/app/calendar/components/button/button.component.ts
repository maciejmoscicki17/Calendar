import {
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
} from '@angular/core'

@Component({
    selector: 'msbutton',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
    @Input() label = 'button'
    @Input() styleClass = ''

    @HostBinding('class')
    get hostClasses() {
        return this.styleClass
    }

    @Output() onClick = new EventEmitter()
    clickEvent() {
        this.onClick.emit()
    }
}
