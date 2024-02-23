using Microsoft.AspNetCore.Mvc;

namespace CalendarAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly ILogger<EventController> _logger;
        List<Event> _events;

        public EventController(ILogger<EventController> logger)
        {
            var date = DateTime.Now;
            _logger = logger;
            _events = new List<Event>()
            {
                new Event(date.AddDays(2), date.AddDays(6), "event 1", "#252525", false,true),
                new Event(date.AddDays(2), date.AddDays(6), "event 3", "red", false,true),
                new Event(date.AddDays(2), date.AddDays(6), "event 2", "#000", false,true),
                new Event(date.AddDays(2), date.AddDays(6), "event 5", "#FFF", false,true),
                new Event(date.AddDays(2), date.AddDays(6), "event 6", "yellow", false,true),
                new Event(date.AddDays(2), date.AddDays(6), "event 4", "green", false,true),
            };

        }

        [HttpGet(Name = "GetEvents")]
        public IEnumerable<Event> Get()
        {
            return _events;
        }
    }
}
