using System.Net;
using FinanceApi.Models;
using FinanceApi.Services;
using FinanceApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly ElementService _elementService;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
            _elementService = new ElementService();
        }

        [HttpGet]
        //public IEnumerable<PeriodicElement> Get()
        public JsonResult Get()
        {
            var elements = this._elementService.GetElements();
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, elementData = elements, errorMessage = ""};
            if (elements == null)
            {
                jsonData = new { httpStatusCode = HttpStatusCode.InternalServerError, elementData = new PeriodicElement[] { }, errorMessage = "There was an error retrieving element data" };
            }
            return new JsonResult(jsonData);
            //return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            //{
            //    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            //    TemperatureC = Random.Shared.Next(-20, 55),
            //    Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            //})
            //.ToArray();
        }
    }
}
