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

        #region Add_New_Records

        /// <summary>
        /// Add expense record to database
        /// </summary>
        /// <param name="expenseTypeID">expense type ID</param>
        /// <param name="paymentTypeID">payment type ID</param>
        /// <param name="paymentTypeCategoryID">payment type category ID</param>
        /// <param name="expenseDescription">description of the expense</param>
        /// <param name="isIncome">if this is income</param>
        /// <param name="isInvestment">if this expense is being put into an investment vehicle</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void AddExpense(int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment)
        {
            try
            {
                // check for valid IDs for the PK and FKs of the Expense record
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

        /// <summary>
        /// Add Expense Type record to the database
        /// </summary>
        /// <param name="expenseTypeName">expense type name</param>
        /// <param name="expenseTypeDescription">description of the expense type</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
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

        /// <summary>
        /// Add payment type record to the database
        /// </summary>
        /// <param name="paymentTypeName">payment type name</param>
        /// <param name="paymentTypeDescription">description of the payment type</param>
        /// <param name="paymentTypeCategoryID">payment type category ID</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void AddPaymentType(string paymentTypeName, string paymentTypeDescription, int paymentTypeCategoryID)
        {
            try
            {
                // check for valid IDs for the PK and FKs of the Payment Type record
                this.CheckPaymentTypeUpsertIDs(paymentTypeCategoryID);

                // ensure all strings are trimmed
                paymentTypeName = paymentTypeName.Trim();
                paymentTypeDescription = paymentTypeDescription.Trim();

                // attempt to upsert the Payment Type
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

        /// <summary>
        /// Add payment type category record to the database
        /// </summary>
        /// <param name="paymentTypeCategoryName">payment type category name</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
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
        #endregion Add_New_Records

        #region Delete_Records
        /// <summary>
        /// Delete an expense record from the database give the expense ID
        /// </summary>
        /// <param name="expenseID">expense ID to delete</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
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

        /// <summary>
        /// Delete an expense type record from the database give the expense type ID
        /// </summary>
        /// <param name="expenseTypeID">expense type ID to delete</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
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

        /// <summary>
        /// Delete payment type record from the database give the payment type ID
        /// </summary>
        /// <param name="paymentTypeID">payment type ID to delete</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
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

        /// <summary>
        /// Delete payment type category record from the database give the payment type category ID
        /// </summary>
        /// <param name="paymentTypeCategoryID">payment type category ID to delete</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void DeletePaymentTypeCategory(int paymentTypeCategoryID)
        {
            try
            {
                // check for invalid ID for the Deletion
                if (paymentTypeCategoryID <= 0)
                {
                    throw new ArgumentOutOfRangeException("paymentTypeCategoryID must be a positive integer. Current value : " + paymentTypeCategoryID.ToString());
                }
                // attempt to delete the Payment Type Category
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
        #endregion Delete_Records

        #region Update_Existing_Records
        /// <summary>
        /// Update an expense record
        /// </summary>
        /// <param name="expenseID">ID of the expense record to update</param>
        /// <param name="expenseTypeID">expense type ID</param>
        /// <param name="paymentTypeID">payment type ID</param>
        /// <param name="paymentTypeCategoryID">payment type category ID</param>
        /// <param name="expenseDescription">Description of the Expense</param>
        /// <param name="isIncome">true if this is a source of income</param>
        /// <param name="isInvestment">true of this expense is for putting money into an "investment vehicle"</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void UpdateExpense(int expenseID, int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment)
        {
            try
            {
                // check for valid IDs for the PK and FKs of the Expense record
                this.CheckExpenseUpsertIDs(expenseTypeID, paymentTypeID, paymentTypeCategoryID, expenseID, false);

                // ensure all strings are trimmed
                expenseDescription = expenseDescription.Trim();

                // attempt to upsert the Expense
                this._context.usp_ExpenseUpsert(expenseTypeID, paymentTypeID, paymentTypeCategoryID, expenseDescription, isIncome, isInvestment, expenseID);
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

        /// <summary>
        /// Update an expense type record
        /// </summary>
        /// <param name="expenseTypeID">ID of the expense type to update</param>
        /// <param name="expenseTypeName">expense type name</param>
        /// <param name="expenseTypeDescription">description of the expense type</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void UpdateExpenseType(int expenseTypeID, string expenseTypeName, string expenseTypeDescription)
        {
            try
            {
                // check for valid IDs for the PK and FKs of the Expense Type record
                this.CheckExpenseTypeUpsertIDs(expenseTypeID, false);

                // ensure all strings are trimmed
                expenseTypeName = expenseTypeName.Trim();
                expenseTypeDescription = expenseTypeDescription.Trim();

                // attempt to upsert the Expense Type
                this._context.usp_ExpenseTypeUpsert(expenseTypeName, expenseTypeDescription, expenseTypeID);
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

        /// <summary>
        /// Update a payment type record
        /// </summary>
        /// <param name="paymentTypeID">ID of the payment type to update</param>
        /// <param name="paymentTypeName">payment type name</param>
        /// <param name="paymentTypeDescription">description of the payment type</param>
        /// <param name="paymentTypeCategoryID">payment type category ID</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void UpdatePaymentType(int paymentTypeID, string paymentTypeName, string paymentTypeDescription, int paymentTypeCategoryID)
        {
            try
            {
                // check for valid IDs for the PK and FKs of the Payment Type record
                this.CheckPaymentTypeUpsertIDs(paymentTypeCategoryID, paymentTypeID, false);

                // ensure all strings are trimmed
                paymentTypeName = paymentTypeName.Trim();
                paymentTypeDescription = paymentTypeDescription.Trim();

                // attempt to upsert the Payment Type
                this._context.usp_PaymentTypeUpsert(paymentTypeName, paymentTypeDescription, paymentTypeCategoryID, paymentTypeID);
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

        /// <summary>
        /// Update a payment type category record
        /// </summary>
        /// <param name="paymentTypeCategoryID">ID of the payment type category to update</param>
        /// <param name="paymentTypeCategoryName">payment type category name</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void UpdatePaymentTypeCategory(int paymentTypeCategoryID, string paymentTypeCategoryName)
        {
            try
            {
                // check for valid IDs for the PK of the Payment Type Category record
                this.CheckPaymentTypeCategoryUpsertIDs(paymentTypeCategoryID, false);

                // ensure all strings are trimmed
                paymentTypeCategoryName = paymentTypeCategoryName.Trim();

                // attempt to upsert the Payment Type Category
                this._context.usp_PaymentTypeCategoryUpsert(paymentTypeCategoryName, paymentTypeCategoryID);
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
        #endregion Update_Existing_Records

        #region Upsert_ID_Checks

        /// <summary>
        /// Checks to ensure that all the IDs sent in are within the valid range for the PK (identity) column in the database tables. Throws an error if there is any issue.
        /// </summary>
        /// <param name="expenseTypeID">expense type ID</param>
        /// <param name="paymentTypeID">payment type ID</param>
        /// <param name="paymentTypeCategoryID">payment type categoryID</param>
        /// <param name="expenseID">expense ID (0 by default for "new" record)</param>
        /// <param name="isNewRecord">true if this is a new record being added to the database (true by default)</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        private void CheckExpenseUpsertIDs(int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, int expenseID = 0, bool isNewRecord = true)
        {
            // check for invalid IDs for the insert
            string argumentOutOfRangeMessage = string.Empty;
            if (expenseID <= 0 && !isNewRecord)
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

        /// <summary>
        /// Checks to ensure that all the IDs sent in are within the valid range for the PK (identity) column in the database tables. Throws an error if there is any issue.
        /// </summary>
        /// <param name="expenseTypeID">expense type ID (0 by default for "new" record)</param>
        /// <param name="isNewRecord">true if this is a new record being added to the database (true by default)</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        private void CheckExpenseTypeUpsertIDs(int expenseTypeID = 0, bool isNewRecord = true)
        {
            // check for invalid IDs for the insert
            string argumentOutOfRangeMessage = string.Empty;
            if (expenseTypeID <= 0 && !isNewRecord)
            {
                argumentOutOfRangeMessage += "expenseTypeID must be a positive integer. Current value : " + expenseTypeID.ToString();
            }

            // if any were found, throw an error
            if (argumentOutOfRangeMessage != string.Empty)
            {
                throw new ArgumentOutOfRangeException(argumentOutOfRangeMessage);
            }
        }

        /// <summary>
        /// Checks to ensure that all the IDs sent in are within the valid range for the PK (identity) column in the database tables. Throws an error if there is any issue.
        /// </summary>
        /// <param name="paymentTypeCategoryID">payment type category ID</param>
        /// <param name="paymentTypeID">payment type ID (0 by default for "new" record)</param>
        /// <param name="isNewRecord">true if this is a new record being added to the database (true by default)</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        private void CheckPaymentTypeUpsertIDs(int paymentTypeCategoryID, int paymentTypeID = 0, bool isNewRecord = false)
        {
            // check for invalid IDs for the insert
            string argumentOutOfRangeMessage = string.Empty;
            if (paymentTypeID <= 0 && !isNewRecord)
            {
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

        /// <summary>
        /// Checks to ensure that all the IDs sent in are within the valid range for the PK (identity) column in the database tables. Throws an error if there is any issue.
        /// </summary>
        /// <param name="paymentTypeCategoryID">payment type categoryID (0 by default for "new" record)</param>
        /// <param name="isNewRecord">true if this is a new record being added to the database (true by default)</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        private void CheckPaymentTypeCategoryUpsertIDs(int paymentTypeCategoryID = 0, bool isNewRecord = true)
        {
            // check for invalid IDs for the insert
            string argumentOutOfRangeMessage = string.Empty;
            if (paymentTypeCategoryID <= 0 && !isNewRecord)
            {
                argumentOutOfRangeMessage += "paymentTypeCategoryID must be a positive integer. Current value : " + paymentTypeCategoryID.ToString();
            }

            // if any were found, throw an error
            if (argumentOutOfRangeMessage != string.Empty)
            {
                throw new ArgumentOutOfRangeException(argumentOutOfRangeMessage);
            }
        }

        #endregion Upsert_ID_Checks
    }
}