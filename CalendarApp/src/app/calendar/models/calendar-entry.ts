import { TemplateRef } from '@angular/core';

export interface CalendarEntry {
  id: number;
  start: string;
  end: string;
  description: string;
  color: string;
  clickable?: boolean;
  draggable?: boolean;
  tooltip?: string | TemplateRef<HTMLElement>;
}
