import { TemplateRef } from '@angular/core'

export interface CalendarEntry {
    start: Date
    end: Date
    description: string
    color: string
    clickable?: boolean
    draggable?: boolean
    tooltip: string | TemplateRef<HTMLElement>
}
