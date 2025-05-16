using FinanceApi.Repositories;
using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using FinanceApi.Models.Testing;
using FinanceApi.Models.Expenses;
using FinanceApi.Services.RepositoryServices.Expenses;
using FinanceApi.Models.JsonDeserialization.Expenses;

namespace FinanceApi.Controllers.Expenses
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {
        private readonly ILogger<ExpensesController> _logger;
        private readonly ExpenseRepoService _expenseService;
        public ExpensesController(ILogger<ExpensesController> logger, ILogger<ExpenseRepoService> expenseLogger, FinancialAppContext context)
        {
            _logger = logger;
            _expenseService = new ExpenseRepoService(expenseLogger, context);
        }

        /// <summary>
        /// GET: api/Expenses
        /// get the data for all expenses in the database and return it to the caller 
        /// </summary>
        /// <returns>{httpStatusCode, expenseData, errorMessage} : success will have 200 status code, a list of Expense objects in JSON format, and a blank error message. error will not have "expenseData"</returns>
        [HttpGet]
        public JsonResult Get()
        {
            try
            {
                var expenseData = _expenseService.GetExpenses();
                var jsonData = new { httpStatusCode = HttpStatusCode.OK, expenseData, errorMessage = "" };

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

        ////TODO: figure out how to get this data from the body
        //public JsonResult Get(int expenseID = 0, int expenseTypeID = 0, int paymentTypeID = 0, int paymentTypeCategoryID = 0, string expenseDescription = "", double expenseAmount = 0.00, bool? isInvestment = null, bool? isIncome = null)
        //{
        //    throw new NotImplementedException();
        //}

        ////TODO: figure out how to get this data from the body
        //public JsonResult Get(DateTime dateStart, DateTime dateEnd, int expenseID = 0, int expenseTypeID = 0, int paymentTypeID = 0, int paymentTypeCategoryID = 0, string expenseDescription = "", double expenseAmount = 0.00, bool? isInvestment = null, bool? isIncome = null)
        //{
        //    throw new NotImplementedException();
        //}

        //TODO: add in different versions of the searches so users can specifically ask for things like just the expenseID, just the paymentTypeID, etc..
        //      -> could just add more methods into the repo service that end up calling the already existing method and fill in the defaults outside of what is being searched on.
        //      -> need to add specific endpoints for getting the full "ExpenseDetails" (i.e. using the ExpenseDetail class)

        /// <summary>
        /// POST: api/Expenses
        /// Add expense to the database
        /// </summary>
        /// <param name="expenseToAdd">JSON object in the format of Models.Expenses.Expense (ExpenseID is not used as this is an "add")</param>
        /// <returns>{httpStatusCode, errorMessage} : success will have a blank error message and 200 return</returns>
        [HttpPost]
        public JsonResult Post([FromBody] JsonElement expenseToAdd)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                Expense expense = new Expense(expenseToAdd.Deserialize<ExpenseJson>() ?? new ExpenseJson());
                DateOnly expenseDate = new DateOnly(expense.ExpenseDate.Year, expense.ExpenseDate.Month, expense.ExpenseDate.Day);
                _expenseService.AddExpense(expense.ExpenseTypeID, expense.PaymentTypeID, expense.PaymentTypeCategoryID, expense.ExpenseDescription, expense.IsIncome, expense.IsInvestment, expenseDate, expense.ExpenseAmount);
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
        /// PUT: api/Expenses
        /// Update expense in the database
        /// </summary>
        /// <param name="expenseToUpdate">JSON object in the format of Models.Expenses.Expense</param>
        /// <returns>{httpStatusCode, errorMessage} : success will have a blank error message and 200 return</returns>
        [HttpPut]
        public JsonResult Put([FromBody] JsonElement expenseToUpdate)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                Expense expense = new Expense(expenseToUpdate.Deserialize<ExpenseJson>() ?? new ExpenseJson());
                DateOnly expenseDate = new DateOnly(expense.ExpenseDate.Year, expense.ExpenseDate.Month, expense.ExpenseDate.Day);
                _expenseService.UpdateExpense(expense.ExpenseID, expense.ExpenseTypeID, expense.PaymentTypeID, expense.PaymentTypeCategoryID, expense.ExpenseDescription, expense.IsIncome, expense.IsInvestment, expenseDate, expense.ExpenseAmount);
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
        /// DELETE: api/Expenses/<ID>
        /// Deletes the expense record for the ID sent in
        /// </summary>
        /// <param name="expenseID">ID of the expense to delete</param>
        /// <returns>{httpStatusCode, errorMessage} : success will have a blank error message and 200 return</returns>
        [HttpDelete("{expenseID}")]
        public JsonResult Delete(int expenseID)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                _expenseService.DeleteExpense(expenseID);
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
