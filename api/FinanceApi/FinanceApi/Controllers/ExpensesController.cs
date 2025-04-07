using FinanceApi.Repositories;
using FinanceApi.Services;
using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using FinanceApi.Models.Testing;
using FinanceApi.Models.Expenses;

namespace FinanceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {

        private readonly ILogger<ExpensesController> _logger;
        private readonly ExpenseService _expenseService;
        public ExpensesController(ILogger<ExpensesController> logger, ILogger<ExpenseService> expenseLogger, FinancialAppContext context)
        {
            _logger = logger;
            _expenseService = new ExpenseService(expenseLogger, context);
        }


        /// <summary>
        /// GET: api/<Expenses>
        /// get the data for all expenses in the database and return it to the caller 
        /// </summary>
        /// <returns>A list of Expense objects in JSON format</returns>
        [HttpGet]
        public JsonResult Get()
        {
            try
            {
                var expenseData = this._expenseService.GetExpenses();
                var jsonData = new { httpStatusCode = HttpStatusCode.OK, expenseData = expenseData, errorMessage = "" };

                return new JsonResult(jsonData);
            }
            catch (Exception ex)
            {
                var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = ex.Message };

                this._logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    this._logger.LogError(ex.InnerException.Message);
                }
                return new JsonResult(jsonData);
            }
        }

        //TODO: figure out how to get this data from the body instead of api/<Expenses>/<ID>
        public JsonResult Get(int expenseID)
        {
            throw new NotImplementedException();
        }

        //TODO: figure out how to get this data from the body
        public JsonResult Get(int expenseTypeID = 0, int paymentTypeID = 0, int paymentTypeCategoryID = 0, int expenseID = 0)
        {
            throw new NotImplementedException();
        }

        //TODO: figure out how to get this data from the body
        public JsonResult Get(DateTime dateStart, DateTime dateEnd, int expenseTypeID = 0, int paymentTypeID = 0, int paymentTypeCategoryID = 0, int expenseID = 0)
        {
            throw new NotImplementedException();
        }


        public JsonResult Post([FromBody] JsonElement expense)
        {
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            try
            {
                Expense expenseToAdd = JsonSerializer.Deserialize<Expense>(expense) ?? new Expense();
                DateOnly expenseDate = new DateOnly(expenseToAdd.ExpenseDate.Year, expenseToAdd.ExpenseDate.Month, expenseToAdd.ExpenseDate.Day);
                this._expenseService.AddExpense(expenseToAdd.ExpenseTypeID, expenseToAdd.PaymentTypeID, expenseToAdd.PaymentTypeCategoryID, expenseToAdd.ExpenseDescription, expenseToAdd.IsIncome, expenseToAdd.IsInvestment, expenseDate, expenseToAdd.ExpenseAmount);
                return new JsonResult(jsonData);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                jsonData = new { httpStatusCode = HttpStatusCode.InternalServerError, errorMessage = e.Message };
                return new JsonResult(jsonData);
            }
        }

        public JsonResult Put([FromBody] JsonElement expense)
        {
            throw new NotImplementedException();
        }

        public JsonResult Delete(int expenseID)
        {
            throw new NotImplementedException();
        }
    }
}
