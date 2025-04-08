using FinanceApi.Models.Expenses;
using FinanceApi.Repositories;
using FinanceApi.Services.Expenses;
using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApi.Controllers.Expenses
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentTypeCategoriesController : ControllerBase
    {

        private readonly ILogger<PaymentTypeCategoriesController> _logger;
        private readonly ExpenseService _expenseService;
        public PaymentTypeCategoriesController(ILogger<PaymentTypeCategoriesController> logger, ILogger<ExpenseService> expenseLogger, FinancialAppContext context)
        {
            _logger = logger;
            _expenseService = new ExpenseService(expenseLogger, context);
        }


        /// <summary>
        /// GET: api/PaymentTypeCategories
        /// get the data for all payment type categories in the database and return it to the caller 
        /// </summary>
        /// <returns>{httpStatusCode, paymentTypeCategoryData, errorMessage} : success will have 200 status code, a list of PaymentTypeCategory objects in JSON format, and a blank error message. error will not have "paymentTypeCategoryData"</returns>
        [HttpGet]
        public JsonResult Get()
        {
            try
            {
                var paymentTypeCategoryData = _expenseService.GetPaymentTypeCategories();
                var jsonData = new { httpStatusCode = HttpStatusCode.OK, paymentTypeCategoryData, errorMessage = "" };

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

        //TODO: figure out how to get this data from the body instead of api/<PaymentTypeCategories>/<ID>
        public JsonResult Get(int paymentTypeCategoryID)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// POST: api/PaymentTypeCategories
        /// Add payment type category to the database
        /// </summary>
        /// <param name="paymentTypeCategoryToAdd">JSON object with the format of Models.Expenses.PaymentTypeCategory (PaymentTypeCategoryID is not used as this is an "add")</param>
        /// <returns>{httpStatusCode, errorMessage} : success will have a blank error message and 200 return</returns>
        [HttpPost]
        public JsonResult Post([FromBody] JsonElement paymentTypeCategoryToAdd)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                PaymentTypeCategory paymentTypeCategory = paymentTypeCategoryToAdd.Deserialize<PaymentTypeCategory>() ?? new PaymentTypeCategory();
                _expenseService.AddPaymentTypeCategory(paymentTypeCategory.PaymentTypeCategoryName);
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
        /// PUT: api/PaymentTypeCategories
        /// Update payment type category in the database
        /// </summary>
        /// <param name="paymentTypeCategoryToUpdate">JSON object with the format of Models.Expenses.PaymentTypeCategory</param>
        /// <returns>{httpStatusCode, errorMessage} : success will have a blank error message and 200 return</returns>
        [HttpPut]
        public JsonResult Put([FromBody] JsonElement paymentTypeCategoryToUpdate)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                PaymentTypeCategory paymentTypeCategory = paymentTypeCategoryToUpdate.Deserialize<PaymentTypeCategory>() ?? new PaymentTypeCategory();
                _expenseService.UpdatePaymentTypeCategory(paymentTypeCategory.PaymentTypeCategoryID, paymentTypeCategory.PaymentTypeCategoryName);
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
        /// DELETE: api/PaymentTypeCategories/<ID>
        /// Deletes the payment type category record for the ID sent in
        /// </summary>
        /// <param name="paymentTypeCategoryID">ID of the payment type category to delete</param>
        /// <returns>{httpStatusCode, errorMessage} : success will have a blank error message and 200 return</returns>
        [HttpDelete("{paymentTypeCategoryID}")]
        public JsonResult Delete(int paymentTypeCategoryID)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                _expenseService.DeleteExpenseType(paymentTypeCategoryID);
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
