using FinanceApi.Models.Expenses;
using FinanceApi.Repositories;
using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FinanceApi.Repositories.EF_Models;
using FinanceApi.Services.RepositoryServices.Expenses;

namespace FinanceApi.Controllers.Expenses
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseTypesController : ControllerBase
    {
        private readonly ILogger<ExpenseTypesController> _logger;
        private readonly ExpenseRepoService _expenseService;
        public ExpenseTypesController(ILogger<ExpenseTypesController> logger, ILogger<ExpenseRepoService> expenseLogger, FinancialAppContext context)
        {
            _logger = logger;
            _expenseService = new ExpenseRepoService(expenseLogger, context);
        }


        /// <summary>
        /// GET: api/ExpenseTypes
        /// get the data for all expense types in the database and return it to the caller 
        /// </summary>
        /// <returns>{httpStatusCode, expenseTypeData, errorMessage} : success will have 200 status code, a list of ExpenseType objects in JSON format, and a blank error message. error will not have "expenseTypeData"</returns>
        [HttpGet]
        public JsonResult Get()
        {
            try
            {
                var expenseTypeData = _expenseService.GetExpenseTypes();
                var jsonData = new { httpStatusCode = HttpStatusCode.OK, expenseTypeData, errorMessage = "" };

                return new JsonResult(jsonData);
            }
            catch (Exception ex)
            {
                var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = ex.Message };

                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
                }
                return new JsonResult(jsonData);
            }
        }

        /// <summary>
        /// Gets a list of expense types based on expense type name
        /// </summary>
        /// <param name="expenseTypeSearchString">expense type name (partial included) to search on</param>
        /// <returns>{httpStatusCode, expenseTypeData, errorMessage} : success will have a blank error message and 200 return. Failure will not have the "expenseTypeData"</returns>
        [Route("SearchByExpenseTypeName")]
        [HttpPost]
        public JsonResult SearchByExpenseTypeName(string expenseTypeSearchString = "")
        {
            try
            {
                var expenseTypeData = _expenseService.GetExpenseTypes(0, expenseTypeSearchString);
                var jsonData = new { httpStatusCode = HttpStatusCode.OK, expenseTypeData, errorMessage = "" };

                return new JsonResult(jsonData);
            }
            catch (Exception ex)
            {
                var jsonData = new { httpStatusCode = HttpStatusCode.InternalServerError, errorMessage = ex.Message };

                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
                }
                return new JsonResult(jsonData);
            }
        }

        //TODO: add in different versions of the searches so users can specifically ask for things like just the expenseTypeID, just the expenseTypeName, etc..
        //      -> could just add more methods into the repo service that end up calling the already existing method and fill in the defaults outside of what is being searched on.

        /// <summary>
        /// POST: api/ExpenseTypes
        /// Add expense type to the database
        /// </summary>
        /// <param name="expenseTypeToAdd">JSON object with the format of Models.Expenses.ExpenseType (ExpenseTypeID is not used as this is an "add")</param>
        /// <returns>{httpStatusCode, errorMessage} : success will have a blank error message and 200 return</returns>
        [HttpPost]
        public JsonResult Post([FromBody] JsonElement expenseTypeToAdd)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                ExpenseType expenseType = expenseTypeToAdd.Deserialize<ExpenseType>() ?? new ExpenseType();
                _expenseService.AddExpenseType(expenseType.ExpenseTypeName, expenseType.ExpenseTypeDescription);
                return new JsonResult(jsonData);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                jsonData = new { httpStatusCode = HttpStatusCode.InternalServerError, errorMessage = e.Message };
                return new JsonResult(jsonData);
            }
        }

        /// <summary>
        /// PUT: api/ExpenseTypes
        /// Update expense type in the database
        /// </summary>
        /// <param name="expenseTypeToUpdate">JSON object with the format of Models.Expenses.ExpenseType</param>
        /// <returns>{httpStatusCode, errorMessage} : success will have a blank error message and 200 return</returns>
        [HttpPut]
        public JsonResult Put([FromBody] JsonElement expenseTypeToUpdate)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                ExpenseType expenseType = expenseTypeToUpdate.Deserialize<ExpenseType>() ?? new ExpenseType();
                _expenseService.UpdateExpenseType(expenseType.ExpenseTypeID, expenseType.ExpenseTypeName, expenseType.ExpenseTypeDescription);
                return new JsonResult(jsonData);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                jsonData = new { httpStatusCode = HttpStatusCode.InternalServerError, errorMessage = e.Message };
                return new JsonResult(jsonData);
            }
        }

        /// <summary>
        /// DELETE: api/ExpenseTypes/<ID>
        /// Deletes the expense type record for the ID sent in
        /// </summary>
        /// <param name="expenseTypeID">ID of the expense type to delete</param>
        /// <returns>{httpStatusCode, errorMessage} : success will have a blank error message and 200 return</returns>
        [HttpDelete("{expenseTypeID}")]
        public JsonResult Delete(int expenseTypeID)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                _expenseService.DeleteExpenseType(expenseTypeID);
                return new JsonResult(jsonData);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                jsonData = new { httpStatusCode = HttpStatusCode.InternalServerError, errorMessage = e.Message };
                return new JsonResult(jsonData);
            }
        }
    }
}
