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
    public class PaymentTypesController : ControllerBase
    {
        private readonly ILogger<PaymentTypesController> _logger;
        private readonly ExpenseRepoService _expenseService;
        public PaymentTypesController(ILogger<PaymentTypesController> logger, ILogger<ExpenseRepoService> expenseLogger, FinancialAppContext context)
        {
            _logger = logger;
            _expenseService = new ExpenseRepoService(expenseLogger, context);
        }


        /// <summary>
        /// GET: api/PaymentTypes
        /// get the data for all payment types in the database and return it to the caller 
        /// </summary>
        /// <returns>{httpStatusCode, paymentTypeData, errorMessage} : success will have 200 status code, a list of PaymentType objects in JSON format, and a blank error message. error will not have "paymentTypeData"</returns>
        [HttpGet]
        public JsonResult Get()
        {
            try
            {
                var paymentTypeData = _expenseService.GetPaymentTypes();
                var jsonData = new { httpStatusCode = HttpStatusCode.OK, paymentTypeData, errorMessage = "" };

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

        //TODO: figure out how to get this data from the body instead of api/<PaymentTypes>/<ID>
        public JsonResult Get(int paymentTypeID)
        {
            throw new NotImplementedException();
        }

        //TODO: add in different versions of the searches so users can specifically ask for things like just the paymentTypeID, just the paymentTypeCategoryID, etc..
        //      -> could just add more methods into the repo service that end up calling the already existing method and fill in the defaults outside of what is being searched on.

        /// <summary>
        /// POST: api/PaymentTypes
        /// Add payment type to the database
        /// </summary>
        /// <param name="paymentTypeToAdd">JSON object with the format of Models.Expenses.PaymentType (PaymentTypeID is not used as this is an "add")</param>
        /// <returns>{httpStatusCode, errorMessage} : success will have a blank error message and 200 return</returns>
        [HttpPost]
        public JsonResult Post([FromBody] JsonElement paymentTypeToAdd)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                PaymentType paymentType = paymentTypeToAdd.Deserialize<PaymentType>() ?? new PaymentType();
                _expenseService.AddPaymentType(paymentType.PaymentTypeName, paymentType.PaymentTypeDescription, paymentType.PaymentTypeCategoryID);
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
        /// PUT: api/PaymentTypes
        /// Update payment type in the database
        /// </summary>
        /// <param name="paymentTypeToUpdate">JSON object with the format of Models.Expenses.PaymentType</param>
        /// <returns>{httpStatusCode, errorMessage} : success will have a blank error message and 200 return</returns>
        [HttpPut]
        public JsonResult Put([FromBody] JsonElement paymentTypeToUpdate)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                PaymentType paymentType = paymentTypeToUpdate.Deserialize<PaymentType>() ?? new PaymentType();
                _expenseService.UpdatePaymentType(paymentType.PaymentTypeID, paymentType.PaymentTypeName, paymentType.PaymentTypeDescription, paymentType.PaymentTypeCategoryID);
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
        /// DELETE: api/PaymentTypes/<ID>
        /// Deletes the payment type record for the ID sent in
        /// </summary>
        /// <param name="paymentTypeID">ID of the payment type to delete</param>
        /// <returns>{httpStatusCode, errorMessage} : success will have a blank error message and 200 return</returns>
        [HttpDelete("{paymentTypeID}")]
        public JsonResult Delete(int paymentTypeID)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                _expenseService.DeletePaymentType(paymentTypeID);
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
