using FinanceApi.Models;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using FinanceApi.Services;
using System.Text.Json;
using FinanceApi.Repositories;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FinanceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeriodicElementsController : ControllerBase
    {
        private readonly ILogger<PeriodicElementsController> _logger;
        private readonly ElementService _elementService;

        public PeriodicElementsController(ILogger<PeriodicElementsController> logger, ILogger<ElementService> elementsLogger, FinancialAppContext context)
        {
            _logger = logger;
            _elementService = new ElementService(elementsLogger, context);
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
        public JsonResult Post([FromBody] JsonElement periodicElementToAdd)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                PeriodicElement elementToAdd = JsonSerializer.Deserialize<PeriodicElement>(periodicElementToAdd) ?? new PeriodicElement();
                this._elementService.AddElement(elementToAdd.name, elementToAdd.symbol, elementToAdd.weight);
                return new JsonResult(jsonData);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                jsonData = new { httpStatusCode = HttpStatusCode.InternalServerError, errorMessage = e.Message };
                return new JsonResult(jsonData);
            }
        }

        // PUT api/<PeriodicElements>
        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns>{httpStatusCode: HttpStatusCode, errorMessage: string}</returns>
        [HttpPut]
        public JsonResult Put([FromBody] JsonElement periodicElementToUpdate)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                PeriodicElement elementToSave = JsonSerializer.Deserialize<PeriodicElement>(periodicElementToUpdate) ?? new PeriodicElement();
                this._elementService.UpdateElement(elementToSave.name, elementToSave.symbol, elementToSave.weight, elementToSave.elementId);
                return new JsonResult(jsonData);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                jsonData = new { httpStatusCode = HttpStatusCode.InternalServerError, errorMessage = e.Message };
                return new JsonResult(jsonData);
            }
        }

        // DELETE api/<PeriodicElements>/5
        /// <summary>
        /// Delete periodic element
        /// </summary>
        /// <param name="elementId">id of the element to delete</param>
        /// <returns>{httpStatusCode: HttpStatusCode, errorMessage: string}</returns>
        [HttpDelete("{elementId}")]
        //[HttpDelete]
        public JsonResult Delete(int elementId)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                this._elementService.DeleteElement(elementId);
                return new JsonResult(jsonData);
            }
            catch (Exception e){ 
                _logger.LogError(e.Message);
                jsonData = new {httpStatusCode = HttpStatusCode.InternalServerError,errorMessage = e.Message};
                return new JsonResult(jsonData);
            }
        }
    }
}
