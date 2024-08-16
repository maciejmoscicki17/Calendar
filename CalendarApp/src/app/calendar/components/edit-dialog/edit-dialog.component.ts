import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CALENDAR_TOKEN, CalendarEntry, ICalendarService } from '../../models';
import { ColorsService } from '../../services/colors.service';
import { CalendarService } from '../../services';

@Component({
  selector: 'edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
})
export class EditDialogComponent implements OnInit {
  @Input() entry!: CalendarEntry;
  @Output('onHide') onHide = new EventEmitter<void>();

  constructor(
    @Inject(CALENDAR_TOKEN)
    private providerService: ICalendarService,
    private calendarService: CalendarService
  ) {
    this._startModel = new Date();
    this._endModel = new Date();
  }
  colorsService = inject(ColorsService);
  visible = true;

  _startModel: Date;
  set startModel(date: Date) {
    this._startModel = date;
  }
  get startModel() {
    return this._startModel;
  }
  _endModel: Date;
  set endModel(date: Date) {
    this._endModel = date;
  }
  get endModel() {
    return this._endModel;
  }

  color?: string;
  description?: string;

  ngOnInit(): void {
    this.startModel = new Date(this.entry.start);
    this.endModel = new Date(this.entry.end);
    this.color = this.entry.color;
    this.color = this.colorsService.getColor(this.entry.color);
    this.description = this.entry.description;
  }

  closeDialog() {
    this.onHide.next();
    this.visible = false;
  }

  onSubmit() {
    if (this.startModel === undefined || this.endModel === undefined) {
      alert('Please provide a valid dates');
    } else {
      const entry = {
        id: this.entry.id,
        description: this.description,
        start: this.startModel,
        end: this.endModel,
        color: this.color,
        clickable: this.entry.clickable,
        draggable: this.entry.draggable,
        tooltip: this.entry.tooltip,
      };
      this.providerService.putEvent(entry).subscribe((x) => {
        this.calendarService.data = x;
        this.calendarService.$dataChanged.next(true);
      });
      this.closeDialog();
    }
  }
}
