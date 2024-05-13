using System;

namespace CalendarAPI
{
    public class Event
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public bool? Clickable { get; set; }
        public bool? Draggable { get; set; }
        public int Id { get; set; }
        public Event(int Id, DateTime Start, DateTime End, string Description, string Color, bool? Clickable, bool? Draggable) { 
            this.Id = Id;
            this.Start = Start;
            this.End = End;
            this.Description = Description;
            this.Color = Color;
            this.Clickable = Clickable;
            this.Draggable = Draggable;
        }
    }
}
