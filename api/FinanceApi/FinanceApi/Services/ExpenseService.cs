using FinanceApi.Repositories;
using FinanceApi.Services.Interfaces;

namespace FinanceApi.Services
{
    public class ExpenseService : IExpense
    {
        private readonly ILogger<ExpenseService> _logger;
        private readonly FinancialAppContext _context;
        public ExpenseService(ILogger<ExpenseService> logger, FinancialAppContext context)
        {
            this._logger = logger;
            this._context = context;
        }

        public void AddExpense(int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment)
        {
            // check for invalid IDs for the insert
            string argumentOutOfRangeMessage = string.Empty;
            if (expenseTypeID <= 0)
            {
                argumentOutOfRangeMessage += "expenseTypeID must be a positive integer. Current value : " + expenseTypeID;
            }
            if (paymentTypeID <= 0)
            {
                argumentOutOfRangeMessage += argumentOutOfRangeMessage != string.Empty ? "\r\n" : string.Empty;
                argumentOutOfRangeMessage += "expenseTypeID must be a positive integer. Current value : " + expenseTypeID;
            }
            if (paymentTypeCategoryID <= 0)
            {
                argumentOutOfRangeMessage += argumentOutOfRangeMessage != string.Empty ? "\r\n" : string.Empty;
                argumentOutOfRangeMessage += "expenseTypeID must be a positive integer. Current value : " + expenseTypeID;
            }

            // if any were found, throw an error
            if (argumentOutOfRangeMessage != string.Empty)
            {
                throw new ArgumentOutOfRangeException(argumentOutOfRangeMessage);
            }

            // ensure all strings are trimmed
            expenseDescription = expenseDescription.Trim();

            try
            {
                // attempt to upsert the Expense
                this._context.usp_ExpenseUpsert(expenseTypeID, paymentTypeID, paymentTypeCategoryID, expenseDescription, isIncome, isInvestment);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                this._logger.LogError(ex.InnerException.Message);
                throw;
            }
        }

        public void AddExpenseType(string expenseTypeName, string expenseTypeDescription)
        {
            // ensure all strings are trimmed
            expenseTypeName = expenseTypeName.Trim();
            expenseTypeDescription = expenseTypeDescription.Trim();

            try
            {
                // attempt to upsert the Expense Type
                this._context.usp_ExpenseTypeUpsert(expenseTypeName, expenseTypeDescription);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                this._logger.LogError(ex.InnerException.Message);
                throw;
            }
        }

        public void AddPaymentType(string paymentTypeName, string paymentTypeDescription, int paymentTypeCategoryID)
        {
            // check for invalid IDs for the insert
            string argumentOutOfRangeMessage = string.Empty;
            if (paymentTypeCategoryID <= 0)
            {
                argumentOutOfRangeMessage += "paymentTypeCategoryID must be a positive integer. Current value : " + paymentTypeCategoryID;
            }

            // if any were found, throw an error
            if (argumentOutOfRangeMessage != string.Empty)
            {
                throw new ArgumentOutOfRangeException(argumentOutOfRangeMessage);
            }

            // ensure all strings are trimmed
            paymentTypeName = paymentTypeName.Trim();
            paymentTypeDescription = paymentTypeDescription.Trim();

            try
            {
                // attempt to upsert the Expense
                this._context.usp_PaymentTypeUpsert(paymentTypeName, paymentTypeDescription, paymentTypeCategoryID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                this._logger.LogError(ex.InnerException.Message);
                throw;
            }
        }

        public void AddPaymentTypeCategory(string paymentTypeCategoryName)
        {
            // ensure all strings are trimmed
            paymentTypeCategoryName = paymentTypeCategoryName.Trim();

            try
            {
                // attempt to upsert the Payment Type Category
                this._context.usp_PaymentTypeCategoryUpsert(paymentTypeCategoryName);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                this._logger.LogError(ex.InnerException.Message);
                throw;
            }
        }

        public void DeleteExpense(int expenseID)
        {
            throw new NotImplementedException();
        }

        public void DeleteExpenseType(int expenseTypeID)
        {
            throw new NotImplementedException();
        }

        public void DeletePaymentType(int paymentTypeID)
        {
            throw new NotImplementedException();
        }

        public void DeletePaymentTypeCategory(int paymentTypeCategoryID)
        {
            throw new NotImplementedException();
        }

        public void UpdateExpense(int expenseID, int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment)
        {
            throw new NotImplementedException();
        }

        public void UpdateExpenseType(int expenseTypeID, string expenseTypeName, string expenseTypeDescription)
        {
            throw new NotImplementedException();
        }

        public void UpdatePaymentType(int paymentTypeID, string paymentTypeName, string paymentTypeDescription, int paymentTypeCategoryID)
        {
            throw new NotImplementedException();
        }

        public void UpdatePaymentTypeCategory(int paymentTypeCategoryID, string paymentTypeCategoryName)
        {
            throw new NotImplementedException();
        }
    }
}
