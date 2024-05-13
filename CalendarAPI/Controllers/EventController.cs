using Microsoft.AspNetCore.Mvc;

namespace CalendarAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly ILogger<EventController> _logger;
        public static List<Event> _events = new();
        public static List<DateTime> _dates = new();

        public EventController(ILogger<EventController> logger)
        {
            if (_events.Count != 0) return;
            var date = DateTime.Now;
            _logger = logger;
            var n1 = 2;
            var n2 = 6;
            var id = 0;
            var newEvents = new List<Event>()
            {
                new Event(++id, date.AddDays(n1++), date.AddDays(n2++), "event 1", "#252525", false,true),
                new Event(++id, date.AddDays(n1++), date.AddDays(n2++), "event 3", "red", false,true),
                new Event(++id, date.AddDays(n1++), date.AddDays(n2++), "event 2", "blue", false,true),
                new Event(++id, date.AddDays(n1++), date.AddDays(n2++), "event 5", "black", false,true),
                new Event(++id, date.AddDays(n1++), date.AddDays(n2++), "event 6", "yellow", false,true),
                new Event(++id, date.AddDays(n1++), date.AddDays(n2++), "event 4", "green", false,true),
            };
            _events = newEvents;
            _dates = newEvents.ConvertAll(x => x.Start);
            //foreach (var ev in newEvents)
            //{
            //    _dates.Add(ev.Start);
            //}
        }

        [HttpGet("Events", Name = "GetEvents")]
        public IEnumerable<Event> Get()
        {
            return _events;
        }

        [HttpGet("Dates", Name = "GetDates")]
        public IEnumerable<DateTime> GetDates()
        {
            return _dates;
        }

        [HttpPost("Event", Name = "PostEvent")]
        public IActionResult PostEvent([FromBody] Event ev)
        {
            _events.Add(ev);
            return Ok();
        }
        [HttpPost("Drop", Name = "PostDrop")]
        public IEnumerable<Event> PostDrop([FromBody] DropEvent ev)
        {
            var diff = ev.From - ev.To;
            var entry = _events.Find(x => x.Id == ev.Entry.Id);
            entry.Start = entry.Start - diff;
            entry.End = entry.End - diff;

            return _events;
        }
        [HttpPut("PutEvent", Name = "PutEvent")]
        public IEnumerable<Event> PutEvent([FromBody] Event ev)
        {
            var e = _events.Find(x => x.Id == ev.Id);
            if(e == null)
            {
                _events.Add(ev);
            } else
            {
                e.Start = ev.Start;
                e.End = ev.End;
                e.Color = ev.Color;
                e.Description = ev.Description;
            }

            return _events;
        }
    }
}
