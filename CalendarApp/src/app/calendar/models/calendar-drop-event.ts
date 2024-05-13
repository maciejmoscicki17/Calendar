import { CalendarEntry } from '.';

export class CalendarDropEvent {
  constructor(
    public entry: CalendarEntry,
    public from: Date,
    public to: Date
  ) {}
}
