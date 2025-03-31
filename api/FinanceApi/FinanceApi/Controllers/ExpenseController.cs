using FinanceApi.Models;
using System.Net;
using FinanceApi.Repositories;
using FinanceApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseController : Controller
    {

        private readonly ILogger<ExpenseController> _logger;
        private readonly ExpenseService _expenseService;
        public ExpenseController(ILogger<ExpenseController> logger, ILogger<ExpenseService> expenseLogger, FinancialAppContext context)
        {
            _logger = logger;
            _expenseService = new ExpenseService(expenseLogger, context);
        }

        [HttpGet]
        public JsonResult Get()
        {
            this._expenseService.AddExpense(1, 1, 1, "something", true, true);
            var jsonData = new { httpStatusCode = HttpStatusCode.OK, errorMessage = "" };

            return new JsonResult(jsonData);
        }
    }
}
