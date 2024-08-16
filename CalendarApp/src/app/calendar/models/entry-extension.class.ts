import { CalendarEntry } from './calendar-entry';

export class EntryExtension {
  entry: CalendarEntry;
  left: string;
  top: string;
  height: string;
  width: string;
  isTextOverflowing: boolean;
  constructor(
    entry: CalendarEntry,
    width: number,
    left: number,
    top: number,
    height: number
  ) {
    this.entry = entry;
    this.top = top + 'px';
    this.width = width + 'px';
    this.height = height + 'px';
    this.left = left + 'px';
    this.isTextOverflowing = height < 14;
  }
}
