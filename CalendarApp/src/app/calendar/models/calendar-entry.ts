import { TemplateRef } from '@angular/core'

export interface CalendarEntry {
    start: string
    end: string
    description: string
    color: string
    clickable?: boolean
    draggable?: boolean
    tooltip: string | TemplateRef<HTMLElement>
}
