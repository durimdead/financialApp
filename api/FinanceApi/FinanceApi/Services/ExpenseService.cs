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
            try
            {
                // check for valid IDs for the PK and FKs of the expense record
                this.CheckExpenseUpsertIDs(expenseTypeID, paymentTypeID, paymentTypeCategoryID);

                // ensure all strings are trimmed
                expenseDescription = expenseDescription.Trim();


                // attempt to upsert the Expense
                this._context.usp_ExpenseUpsert(expenseTypeID, paymentTypeID, paymentTypeCategoryID, expenseDescription, isIncome, isInvestment);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                this._logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    this._logger.LogError(ex.InnerException.Message);
                }
                throw;
            }
        }

        public void AddExpenseType(string expenseTypeName, string expenseTypeDescription)
        {
            try
            {
                // ensure all strings are trimmed
                expenseTypeName = expenseTypeName.Trim();
                expenseTypeDescription = expenseTypeDescription.Trim();
                // attempt to upsert the Expense Type
                this._context.usp_ExpenseTypeUpsert(expenseTypeName, expenseTypeDescription);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                this._logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    this._logger.LogError(ex.InnerException.Message);
                }
                throw;
            }
        }

        public void AddPaymentType(string paymentTypeName, string paymentTypeDescription, int paymentTypeCategoryID)
        {
            try
            {
                // check for invalid IDs for the insert
                string argumentOutOfRangeMessage = string.Empty;
                if (paymentTypeCategoryID <= 0)
                {
                    argumentOutOfRangeMessage += "paymentTypeCategoryID must be a positive integer. Current value : " + paymentTypeCategoryID.ToString();
                }

                // if any were found, throw an error
                if (argumentOutOfRangeMessage != string.Empty)
                {
                    throw new ArgumentOutOfRangeException(argumentOutOfRangeMessage);
                }

                // ensure all strings are trimmed
                paymentTypeName = paymentTypeName.Trim();
                paymentTypeDescription = paymentTypeDescription.Trim();

                // attempt to upsert the Expense
                this._context.usp_PaymentTypeUpsert(paymentTypeName, paymentTypeDescription, paymentTypeCategoryID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                this._logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    this._logger.LogError(ex.InnerException.Message);
                }
                throw;
            }
        }

        public void AddPaymentTypeCategory(string paymentTypeCategoryName)
        {
            try
            {
                // ensure all strings are trimmed
                paymentTypeCategoryName = paymentTypeCategoryName.Trim();

                // attempt to upsert the Payment Type Category
                this._context.usp_PaymentTypeCategoryUpsert(paymentTypeCategoryName);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                this._logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    this._logger.LogError(ex.InnerException.Message);
                }
                throw;
            }
        }

        public void DeleteExpense(int expenseID)
        {
            try
            {
                // check for invalid ID for the Deletion
                if (expenseID <= 0)
                {
                    throw new ArgumentOutOfRangeException("expenseID must be a positive integer. Current value : " + expenseID.ToString());
                }
                // attempt to delete the Expense
                this._context.usp_ExpenseDelete(expenseID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                this._logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    this._logger.LogError(ex.InnerException.Message);
                }
                throw;
            }
        }

        public void DeleteExpenseType(int expenseTypeID)
        {
            try
            {
                // check for invalid ID for the Deletion
                if (expenseTypeID <= 0)
                {
                    throw new ArgumentOutOfRangeException("expenseTypeID must be a positive integer. Current value : " + expenseTypeID.ToString());
                }
                // attempt to delete the Expense Type
                this._context.usp_ExpenseTypeDelete(expenseTypeID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                this._logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    this._logger.LogError(ex.InnerException.Message);
                }
                throw;
            }
        }

        public void DeletePaymentType(int paymentTypeID)
        {
            try
            {
                // check for invalid ID for the Deletion
                if (paymentTypeID <= 0)
                {
                    throw new ArgumentOutOfRangeException("paymentTypeID must be a positive integer. Current value : " + paymentTypeID.ToString());
                }
                // attempt to delete the Payment Type
                this._context.usp_PaymentTypeDelete(paymentTypeID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                this._logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    this._logger.LogError(ex.InnerException.Message);
                }
                throw;
            }
        }

        public void DeletePaymentTypeCategory(int paymentTypeCategoryID)
        {
            try
            {
                // check for invalid ID for the Deletion
                if (paymentTypeCategoryID <= 0)
                {
                    throw new ArgumentOutOfRangeException("paymentTypeCategoryID must be a positive integer. Current value : " + paymentTypeCategoryID.ToString());
                }
                // attempt to delete the Expense Type
                this._context.usp_PaymentTypeCategoryDelete(paymentTypeCategoryID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                this._logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    this._logger.LogError(ex.InnerException.Message);
                }
                throw;
            }
        }

        public void UpdateExpense(int expenseID, int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment)
        {
            try
            {
                // check for valid IDs for the PK and FKs of the expense record
                this.CheckExpenseUpsertIDs(expenseTypeID, paymentTypeID, paymentTypeCategoryID, expenseID, false);

                // ensure all strings are trimmed
                expenseDescription = expenseDescription.Trim();


                // attempt to upsert the Expense
                this._context.usp_ExpenseUpsert(expenseTypeID, paymentTypeID, paymentTypeCategoryID, expenseDescription, isIncome, isInvestment);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                this._logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    this._logger.LogError(ex.InnerException.Message);
                }
                throw;
            }
        }

        private void CheckExpenseUpsertIDs(int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, int expenseID = 0, bool isNewRecord = true)
        {
            // check for invalid IDs for the insert
            string argumentOutOfRangeMessage = string.Empty;
            if (expenseID <= 0 && isNewRecord == false)
            {
                argumentOutOfRangeMessage += "expenseID must be a positive integer. Current value : " + expenseID.ToString();
            }
            if (expenseTypeID <= 0)
            {
                argumentOutOfRangeMessage += argumentOutOfRangeMessage != string.Empty ? " :::: " : string.Empty;
                argumentOutOfRangeMessage += "expenseTypeID must be a positive integer. Current value : " + expenseTypeID.ToString();
            }
            if (paymentTypeID <= 0)
            {
                argumentOutOfRangeMessage += argumentOutOfRangeMessage != string.Empty ? " :::: " : string.Empty;
                argumentOutOfRangeMessage += "paymentTypeID must be a positive integer. Current value : " + paymentTypeID.ToString();
            }
            if (paymentTypeCategoryID <= 0)
            {
                argumentOutOfRangeMessage += argumentOutOfRangeMessage != string.Empty ? " :::: " : string.Empty;
                argumentOutOfRangeMessage += "paymentTypeCategoryID must be a positive integer. Current value : " + paymentTypeCategoryID.ToString();
            }

            // if any were found, throw an error
            if (argumentOutOfRangeMessage != string.Empty)
            {
                throw new ArgumentOutOfRangeException(argumentOutOfRangeMessage);
            }
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
