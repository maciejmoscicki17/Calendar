using Microsoft.AspNetCore.Mvc;

namespace CalendarAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly ILogger<EventController> _logger;
        List<Event> _events;
        List<DateTime> _dates = new();

        public EventController(ILogger<EventController> logger)
        {
            var date = DateTime.Now;
            _logger = logger;
            var n1 = 2;
            var n2 = 6; 
            _events = new List<Event>()
            {
                new Event(date.AddDays(n1++), date.AddDays(n2++), "event 1", "#252525", false,true),
                new Event(date.AddDays(n1++), date.AddDays(n2++), "event 3", "red", false,true),
                new Event(date.AddDays(n1++), date.AddDays(n2++), "event 2", "blue", false,true),
                new Event(date.AddDays(n1++), date.AddDays(n2++), "event 5", "black", false,true),
                new Event(date.AddDays(n1++), date.AddDays(n2++), "event 6", "yellow", false,true),
                new Event(date.AddDays(n1++), date.AddDays(n2++), "event 4", "green", false,true),
            };
            _events.ForEach(x => _dates.Add(x.Start));
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
    }
}
