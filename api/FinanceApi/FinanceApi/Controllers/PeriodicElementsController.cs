using FinanceApi.Models;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using FinanceApi.Services;
using System.Text.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FinanceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeriodicElementsController : ControllerBase
    {
        private readonly ILogger<PeriodicElementsController> _logger;
        private readonly ElementService _elementService;

        public PeriodicElementsController(ILogger<PeriodicElementsController> logger, ILogger<ElementService> elementsLogger)
        {
            _logger = logger;
            _elementService = new ElementService(elementsLogger);
        }
        // GET: api/<PeriodicElements>
        [HttpGet]
        public JsonResult Get()
        {
            var elements = this._elementService.GetElements();
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, elementData = elements, errorMessage = "" };

            // return error if we could not get the elements
            if (elements == null)
            {
                jsonData = new { httpStatusCode = HttpStatusCode.InternalServerError, elementData = new PeriodicElement[] { }, errorMessage = "There was an error retrieving element data" };
            }
            return new JsonResult(jsonData);
        }

        // GET api/<PeriodicElements>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<PeriodicElements>
        [HttpPost]
        public ActionResult Post([FromBody] string value)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                //PeriodicElement elementToSave = JsonSerializer.Deserialize<PeriodicElement>(periodicElementToSave) ?? new PeriodicElement();
                //this._elementService.UpdateElement(elementToSave);
                return new JsonResult(jsonData);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                jsonData = new { httpStatusCode = HttpStatusCode.InternalServerError, errorMessage = e.Message };
                return new JsonResult(jsonData);
            }
        }

        // PUT api/<PeriodicElements>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<PeriodicElements>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
