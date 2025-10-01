using FinanceApi.Models.Expenses;
using FinanceApi.Repositories;
using FinanceApi.Repositories.EF_Models;
using FinanceApi.Repositories.Interfaces;
using FinanceApi.Services.RepositoryServices.Expenses;
using FinanceApi.Services.RepositoryServices.Expenses.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.Json;

namespace FinanceApi.Controllers.Expenses
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentTypesController : ControllerBase
    {
        private readonly ILogger<PaymentTypesController> _logger;
        private readonly IExpensesRepository _expenseService;
        public PaymentTypesController(ILogger<PaymentTypesController> logger, ILogger<IExpensesRepository> expenseLogger, DbContextOptions options)
        {
            _logger = logger;
            _expenseService = new ExpenseRepoService_MSSQL(expenseLogger, new FinancialAppContext_MSSQL(options));
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

        /// <summary>
        /// POST: api/PaymentTypes/
        /// Gets a single paymentType by ID
        /// </summary>
        /// <param name="paymentTypeID">ID of the payment type to return</param>
        /// <returns>{httpStatusCode, paymentTypeData, errorMessage} : success will have 200 status code, a PaymentType object in JSON format, and a blank error message. error will not have "paymentTypeData"</returns>
        /// <exception cref="ArgumentException">thrown if the paymentTypeID passed in is not an integer</exception>
        [HttpPost]
        public JsonResult Post([FromBody] string paymentTypeID)
        {
            try
            {
                // attempt to parse the ID into an int, and throw an error if it fails.
                int search_paymentTypeID;
                if (!int.TryParse(paymentTypeID, out search_paymentTypeID))
                {
                    throw new ArgumentException("paymentTypeID must be an integer. Current value: '" + paymentTypeID + "'.");
                }
                var paymentTypeData = _expenseService.GetPaymentTypes(search_paymentTypeID).SingleOrDefault();
                var jsonData = new { httpStatusCode = HttpStatusCode.OK, paymentTypeData, errorMessage = "" };
                return new JsonResult(jsonData);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                var jsonData = new { httpStatusCode = HttpStatusCode.InternalServerError, errorMessage = e.Message };
                return new JsonResult(jsonData);
            }
        }

        /// <summary>
        /// POST: api/PaymentTypes/SearchByPaymentTypeName
        /// Gets a list of payment types based on payment type name
        /// </summary>
        /// <param name="paymentTypeSearchString">payment type name (partial included) to search on</param>
        /// <returns>{httpStatusCode, paymentTypeData, errorMessage} : success will have a blank error message and 200 return. Failure will not have the "paymentTypeData"</returns>
        [Route("SearchByPaymentTypeName")]
        [HttpPost]
        public JsonResult SearchByPaymentTypeName(string paymentTypeSearchString = "")
        {
            try
            {
                var paymentTypeData = _expenseService.GetPaymentTypes(0, 0, paymentTypeSearchString);
                var jsonData = new { httpStatusCode = HttpStatusCode.OK, paymentTypeData, errorMessage = "" };

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
        ///// <summary>
        ///// Gets a list of payment types based on search criteria
        ///// </summary>
        ///// <param name="paymentTypeName">Full or partial payment type name to search on</param>
        ///// <param name="paymentTypeDescription">Full or partial payment type description to search on</param>
        ///// <param name="paymentTypeCategoryID">ID of the payment type category</param>
        ///// <returns></returns>
        ///// <exception cref="ArgumentException"></exception>
        //[HttpPost]
        //public JsonResult Post([FromBody] string paymentTypeName, [FromBody] string paymentTypeDescription, [FromBody] string paymentTypeCategoryID)
        //{
        //    try
        //    {
        //        // attempt to parse the ID into an int, and throw an error if it fails.
        //        int search_paymentTypeCategoryID;
        //        if (!int.TryParse(paymentTypeCategoryID, out search_paymentTypeCategoryID))
        //        {
        //            throw new ArgumentException("paymentTypeCategoryID must be an integer. Current value: '" + paymentTypeCategoryID + "'.");
        //        }

        //        // get the paymentTypeData and return the result set of paymentTypes (first param is "0" since we are not searching directly on the payment type ID
        //        var paymentTypeData = _expenseService.GetPaymentTypes(0, search_paymentTypeCategoryID, paymentTypeName.Trim(), paymentTypeDescription.Trim());
        //        var jsonData = new { httpStatusCode = HttpStatusCode.OK, paymentTypeData, errorMessage = "" };
        //        return new JsonResult(jsonData);
        //    }
        //    catch (Exception e)
        //    {
        //        _logger.LogError(e.Message);
        //        var jsonData = new { httpStatusCode = HttpStatusCode.InternalServerError, errorMessage = e.Message };
        //        return new JsonResult(jsonData);
        //    }
        //}

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
