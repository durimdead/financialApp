using System.Linq;
using FinanceApi.Models;
using FinanceApi.Models.Expenses;
using FinanceApi.Repositories;
using FinanceApi.Repositories.EF_Models;
using FinanceApi.Services.RepositoryServices.Expenses.Interfaces;

namespace FinanceApi.Services.RepositoryServices.Expenses
{
    public class ExpenseRepoService : IExpensesRepository
    {
        private readonly ILogger<ExpenseRepoService> _logger;
        private readonly FinancialAppContext _context;
        public ExpenseRepoService(ILogger<ExpenseRepoService> logger, FinancialAppContext context)
        {
            _logger = logger;
            _context = context;
        }

        #region Get_Records

        /// <summary>
        /// Get the list of expenses with the search criteria
        /// </summary>
        /// <param name="expenseTypeID">The expense type ID to filter on (pass in "0" to ignore this search criteria)</param>
        /// <param name="paymentTypeID">The payment type ID to filter on (pass in "0" to ignore this search criteria)</param>
        /// <param name="paymentTypeCategoryID">The payment type category ID to filter on (pass in "0" to ignore this search criteria)</param>
        /// <param name="expenseID">The expense ID to filter on (pass in "0" to ignore this search criteria)</param>
        /// <param name="expenseDescription">Full or partial description of expense to search on ("" to ignore this search criteria).</param>
        /// <param name="expenseAmount">Expense amount to search on (pass in "0" to ignore this search criteria)</param>
        /// <param name="isInvestment">If you are searching specifically for or not for investments (pass in "null" to ignore this search criteria)</param>
        /// <param name="isIncome">If you are searching specifically for or not for income (pass in "null" to ignore this search criteria)</param>
        /// <returns>A list of expenses based on the search criteria passed in.</returns>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the search criteria (i.e. < 0)</exception>
        public List<Expense> GetExpenses(int expenseTypeID = 0, int paymentTypeID = 0, int paymentTypeCategoryID = 0, int expenseID = 0, string expenseDescription = "", double expenseAmount = 0.00, bool? isInvestment = null, bool? isIncome = null)
        {
            try
            {
                // ensure we will be able to attempt to find a valid record
                CheckExpenseSearchCriteria(expenseTypeID, paymentTypeID, paymentTypeCategoryID, expenseID);

                // grab the records to return, but only use the search criteria where the value is not the default value for the parameter
                var returnValue = _context.vExpense.Where(x =>
                    (expenseTypeID > 0 ? expenseTypeID == x.ExpenseTypeID : true)
                    && (expenseID > 0 ? expenseID == x.ExpenseID : true)
                    && (paymentTypeID > 0 ? paymentTypeID == x.PaymentTypeID : true)
                    && (paymentTypeCategoryID > 0 ? paymentTypeCategoryID == x.PaymentTypeCategoryID : true)
                    && (expenseDescription != "" ? x.ExpenseDescription.ToLower().Contains(expenseDescription.ToLower()) : true)
                    && (expenseAmount != 0 ? expenseAmount == (double)x.ExpenseAmount : true)
                    && (isInvestment ?? true)
                    && (isIncome ?? true))
                .Select(record => new Expense()
                {
                    ExpenseID = record.ExpenseID,
                    ExpenseDescription = record.ExpenseDescription,
                    ExpenseTypeID = record.ExpenseTypeID,
                    PaymentTypeID = record.PaymentTypeID,
                    PaymentTypeCategoryID = record.PaymentTypeCategoryID,
                    IsIncome = record.IsIncome,
                    IsInvestment = record.IsInvestment,
                    ExpenseDate = record.ExpenseDate,
                    LastUpdated = record.LastUpdated,
                    ExpenseAmount = (double)record.ExpenseAmount
                }).ToList();
                return returnValue;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Get the list of expenses with the search criteria (can search by date)
        /// </summary>
        /// <param name="dateStart">start of the date range to search within (must be <= dateEnd)</param>
        /// <param name="dateEnd">end of the date range to search within (must be >= dateStart)</param>
        /// <param name="expenseTypeID">The expense type ID to filter on (pass in "0" to ignore this search criteria)</param>
        /// <param name="paymentTypeID">The payment type ID to filter on (pass in "0" to ignore this search criteria)</param>
        /// <param name="paymentTypeCategoryID">The payment type category ID to filter on (pass in "0" to ignore this search criteria)</param>
        /// <param name="expenseID">The expense ID to filter on (pass in "0" to ignore this search criteria)</param>
        /// <param name="expenseDescription">Full or partial description of expense to search on ("" to ignore this search criteria).</param>
        /// <param name="expenseAmount">Expense amount to search on (pass in "0" to ignore this search criteria)</param>
        /// <param name="isInvestment">If you are searching specifically for or not for investments (pass in "null" to ignore this search criteria)</param>
        /// <param name="isIncome">If you are searching specifically for or not for income (pass in "null" to ignore this search criteria)</param>
        /// <returns>A list of expenses based on the search criteria passed in.</returns>
        /// <exception cref="InvalidOperationException">if dateStart > dateEnd</exception>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the search criteria (i.e. < 0)</exception>
        public List<Expense> GetExpenses(DateTime dateStart, DateTime dateEnd, int expenseTypeID = 0, int paymentTypeID = 0, int paymentTypeCategoryID = 0, int expenseID = 0, string expenseDescription = "", double expenseAmount = 0, bool? isInvestment = null, bool? isIncome = null)
        {
            try
            {
                // ensure we will be able to attempt to find a valid record
                CheckExpenseSearchCriteria(expenseTypeID, paymentTypeID, paymentTypeCategoryID, expenseID);

                // ensure that start date <= end date
                if (dateStart > dateEnd)
                {
                    throw new InvalidOperationException("Start Date cannot be later than End Date: Start (" + dateStart + ") ::: End (" + dateEnd + ")");
                }

                // grab the records to return, but only use the search criteria where the value is not the default value for the parameter
                var returnValue = _context.vExpense.Where(x =>
                    (expenseTypeID > 0 ? expenseTypeID == x.ExpenseTypeID : true)
                    && (expenseID > 0 ? expenseID == x.ExpenseID : true)
                    && (paymentTypeID > 0 ? paymentTypeID == x.PaymentTypeID : true)
                    && (paymentTypeCategoryID > 0 ? paymentTypeCategoryID == x.PaymentTypeCategoryID : true)
                    && (expenseDescription != "" ? x.ExpenseDescription.ToLower().Contains(expenseDescription.ToLower()) : true)
                    && (expenseAmount != 0 ? expenseAmount == (double)x.ExpenseAmount : true)
                    && (isInvestment ?? true)
                    && (isIncome ?? true)
                    && (dateStart.Date >= x.ExpenseDate.Date)
                    && (dateEnd.Date <= x.ExpenseDate.Date))
                .Select(record => new Expense()
                {
                    ExpenseID = record.ExpenseID,
                    ExpenseDescription = record.ExpenseDescription,
                    ExpenseTypeID = record.ExpenseTypeID,
                    PaymentTypeID = record.PaymentTypeID,
                    PaymentTypeCategoryID = record.PaymentTypeCategoryID,
                    IsIncome = record.IsIncome,
                    IsInvestment = record.IsInvestment,
                    ExpenseDate = record.ExpenseDate,
                    LastUpdated = record.LastUpdated,
                    ExpenseAmount = (double)record.ExpenseAmount
                }).ToList();
                return returnValue;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Get the list of expense types with the search criteria
        /// </summary>
        /// <param name="expenseTypeID">the expense type ID of the record to return ("0" to ignore this search criteria).</param>
        /// <param name="expenseTypeName">full or partial name of expense type to search on  ("" to ignore this search criteria).</param>
        /// <param name="expenseTypeDescription">full or partial description of expense type to search on  ("" to ignore this search criteria).</param>
        /// <returns>A list of Expense Type records based on the search criteria</returns>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the search criteria (i.e. < 0)</exception>
        public List<ExpenseType> GetExpenseTypes(int expenseTypeID = 0, string expenseTypeName = "", string expenseTypeDescription = "")
        {
            try
            {
                // ensure this is a valid expenseTypeID
                CheckExpenseTypeSearchCriteria(expenseTypeID);

                // grab the records to return, but only use the search criteria where the value is not the default value for the parameter
                var returnValue = _context.vExpenseType.Where(x =>
                    (expenseTypeID > 0 ? expenseTypeID == x.ExpenseTypeID : true)
                    && (expenseTypeName != "" ? x.ExpenseTypeName.ToLower().Contains(expenseTypeName.ToLower()) : true)
                    && (expenseTypeDescription != "" ? expenseTypeDescription == x.ExpenseTypeDescription : true))
                .Select(record => new ExpenseType()
                {
                    ExpenseTypeID = record.ExpenseTypeID,
                    ExpenseTypeName = record.ExpenseTypeName,
                    ExpenseTypeDescription = record.ExpenseTypeDescription
                }).ToList();
                return returnValue;
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
                }
                throw;
            }
        }

        /// <summary>
        /// Returns a list of payment types based on the search criteria sent in. Use default param values to get ALL Payment Type records.
        /// </summary>
        /// <param name="paymentTypeID">ID of the payment type to get ("0" to ignore this search criteria).</param>
        /// <param name="paymentTypeCategoryID">ID of the payment type category that this payment type falls within ("0" to ignore this search criteria).</param>
        /// <param name="paymentTypeName">full or partial name of payment type to search on  ("" to ignore this search criteria).</param>
        /// <param name="paymentTypeDescription">full or partial description of payment type to search on  ("" to ignore this search criteria).</param>
        /// <returns>A list of Payment Type records based on the search criteria</returns>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the search criteria (i.e. < 0)</exception>
        public List<PaymentType> GetPaymentTypes(int paymentTypeID = 0, int paymentTypeCategoryID = 0, string paymentTypeName = "", string paymentTypeDescription = "")
        {
            try
            {
                // ensure this is a valid paymentTypeID
                CheckPaymentTypeSearchCriteria(paymentTypeID, paymentTypeCategoryID);

                // grab the records to return, but only use the search criteria where the value is not the default value for the parameter
                var returnValue = _context.vPaymentType.Where(x =>
                    (paymentTypeID > 0 ? paymentTypeID == x.PaymentTypeID : true)
                    && (paymentTypeCategoryID > 0 ? paymentTypeCategoryID == x.PaymentTypeCategoryID : true)
                    && (paymentTypeName != "" ? x.PaymentTypeName.ToLower().Contains(paymentTypeName.ToLower()) : true)
                    && (paymentTypeDescription != "" ? x.PaymentTypeDescription.ToLower().Contains(paymentTypeDescription.ToLower()) : true))
                .Select(record => new PaymentType()
                {
                    PaymentTypeID = record.PaymentTypeID,
                    PaymentTypeName = record.PaymentTypeName,
                    PaymentTypeDescription = record.PaymentTypeDescription,
                    PaymentTypeCategoryID = record.PaymentTypeCategoryID
                }).ToList();
                return returnValue;
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
                }
                throw;
            }
        }

        /// <summary>
        /// Get the list of payment type categories with the search criteria
        /// </summary>
        /// <param name="paymentTypeCategoryID">ID of the payment type category to return ("0" to ignore this search criteria).</param>
        /// <param name="paymentTypeCategoryName">full or partial name of payment type categories to search on ("" to ignore this search criteria).</param>
        /// <returns>A list of Payment Type Category records based on the search criteria</returns>
        /// <exception cref="ArgumentOutOfRangeException">if the paymentTypeCategoryID is outside of the valid range (i.e. < 0)</exception>
        public List<PaymentTypeCategory> GetPaymentTypeCategories(int paymentTypeCategoryID = 0, string paymentTypeCategoryName = "")
        {
            try
            {
                // ensure this is a valid paymentTypeCategoryID
                CheckPaymentTypeCategorySearchCriteria(paymentTypeCategoryID);

                // grab the records to return, but only use the search criteria where the value is not the default value for the parameter
                var returnValue = _context.vPaymentTypeCategory.Where(x =>
                       (paymentTypeCategoryID > 0 ? paymentTypeCategoryID == x.PaymentTypeCategoryID : true)
                    && (paymentTypeCategoryName != "" ? x.PaymentTypeCategoryName.ToLower().Contains(paymentTypeCategoryName.ToLower()) : true))
                .Select(record => new PaymentTypeCategory()
                {
                    PaymentTypeCategoryID = record.PaymentTypeCategoryID,
                    PaymentTypeCategoryName = record.PaymentTypeCategoryName,
                }).ToList();
                return returnValue;
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
                }
                throw;
            }
        }

        #endregion Get_Records

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
        /// <param name="expenseDate">the date that the expense was made</param>
        /// <param name="expenseAmount">the amount for the expense</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void AddExpense(int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment, DateOnly expenseDate, double expenseAmount)
        {
            try
            {
                // check for valid IDs for the PK and FKs of the Expense record
                CheckExpenseUpsertIDs(expenseTypeID, paymentTypeID, paymentTypeCategoryID);

                // ensure all strings are trimmed
                expenseDescription = expenseDescription.Trim();

                // attempt to upsert the Expense
                _context.usp_ExpenseUpsert(expenseTypeID, paymentTypeID, paymentTypeCategoryID, expenseDescription, isIncome, isInvestment, expenseDate, expenseAmount);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
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
                _context.usp_ExpenseTypeUpsert(expenseTypeName, expenseTypeDescription);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
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
                CheckPaymentTypeUpsertIDs(paymentTypeCategoryID);

                // ensure all strings are trimmed
                paymentTypeName = paymentTypeName.Trim();
                paymentTypeDescription = paymentTypeDescription.Trim();

                // attempt to upsert the Payment Type
                _context.usp_PaymentTypeUpsert(paymentTypeName, paymentTypeDescription, paymentTypeCategoryID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
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
                _context.usp_PaymentTypeCategoryUpsert(paymentTypeCategoryName);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
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
                _context.usp_ExpenseDelete(expenseID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
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
                _context.usp_ExpenseTypeDelete(expenseTypeID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
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
                _context.usp_PaymentTypeDelete(paymentTypeID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
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
                _context.usp_PaymentTypeCategoryDelete(paymentTypeCategoryID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
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
        /// <param name="expenseDate">the date that the expense was made</param>
        /// <param name="expenseAmount">the amount for the expense</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void UpdateExpense(int expenseID, int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment, DateOnly expenseDate, double expenseAmount)
        {
            try
            {
                // check for valid IDs for the PK and FKs of the Expense record
                CheckExpenseUpsertIDs(expenseTypeID, paymentTypeID, paymentTypeCategoryID, expenseID, false);

                // ensure all strings are trimmed
                expenseDescription = expenseDescription.Trim();

                // attempt to upsert the Expense
                _context.usp_ExpenseUpsert(expenseTypeID, paymentTypeID, paymentTypeCategoryID, expenseDescription, isIncome, isInvestment, expenseDate, expenseAmount, expenseID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
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
                CheckExpenseTypeUpsertIDs(expenseTypeID, false);

                // ensure all strings are trimmed
                expenseTypeName = expenseTypeName.Trim();
                expenseTypeDescription = expenseTypeDescription.Trim();

                // attempt to upsert the Expense Type
                _context.usp_ExpenseTypeUpsert(expenseTypeName, expenseTypeDescription, expenseTypeID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
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
                CheckPaymentTypeUpsertIDs(paymentTypeCategoryID, paymentTypeID, false);

                // ensure all strings are trimmed
                paymentTypeName = paymentTypeName.Trim();
                paymentTypeDescription = paymentTypeDescription.Trim();

                // attempt to upsert the Payment Type
                _context.usp_PaymentTypeUpsert(paymentTypeName, paymentTypeDescription, paymentTypeCategoryID, paymentTypeID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
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
                CheckPaymentTypeCategoryUpsertIDs(paymentTypeCategoryID, false);

                // ensure all strings are trimmed
                paymentTypeCategoryName = paymentTypeCategoryName.Trim();

                // attempt to upsert the Payment Type Category
                _context.usp_PaymentTypeCategoryUpsert(paymentTypeCategoryName, paymentTypeCategoryID);
            }
            catch (Exception ex)
            {
                // log the error and then re-throw it to ensure anywhere else that needs to handle the error can still do so
                _logger.LogError(ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError(ex.InnerException.Message);
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

        #region Search_Criteria_Checks

        /// <summary>
        /// Checks to ensure that all the IDs sent in are within the valid range for the search. Throws an error if there is any issue.
        /// If you are not restricting your search by the param, use the default value of "0"
        /// </summary>
        /// <param name="expenseTypeID">expense type ID</param>
        /// <param name="paymentTypeID">payment type ID</param>
        /// <param name="paymentTypeCategoryID">payment type categoryID</param>
        /// <param name="expenseID">expense ID (0 by default for "new" record)</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid search range for the ID</exception>
        private void CheckExpenseSearchCriteria(int expenseTypeID = 0, int paymentTypeID = 0, int paymentTypeCategoryID = 0, int expenseID = 0)
        {
            // check for invalid criteria for the search - "0" is ok, because we shouldn't be searching on it anyway.
            string argumentOutOfRangeMessage = string.Empty;
            if (expenseID < 0)
            {
                argumentOutOfRangeMessage += "expenseID must be zero or a positive integer. Current value : " + expenseID.ToString();
            }
            if (expenseTypeID < 0)
            {
                argumentOutOfRangeMessage += argumentOutOfRangeMessage != string.Empty ? " :::: " : string.Empty;
                argumentOutOfRangeMessage += "expenseTypeID must be zero or a positive integer. Current value : " + expenseTypeID.ToString();
            }
            if (paymentTypeID < 0)
            {
                argumentOutOfRangeMessage += argumentOutOfRangeMessage != string.Empty ? " :::: " : string.Empty;
                argumentOutOfRangeMessage += "paymentTypeID must be zero or a positive integer. Current value : " + paymentTypeID.ToString();
            }
            if (paymentTypeCategoryID < 0)
            {
                argumentOutOfRangeMessage += argumentOutOfRangeMessage != string.Empty ? " :::: " : string.Empty;
                argumentOutOfRangeMessage += "paymentTypeCategoryID must be zero or a positive integer. Current value : " + paymentTypeCategoryID.ToString();
            }

            // if any were found, throw an error
            if (argumentOutOfRangeMessage != string.Empty)
            {
                throw new ArgumentOutOfRangeException(argumentOutOfRangeMessage);
            }
        }

        /// <summary>
        /// Checks to ensure that all the IDs sent in are within the valid range for the search. Throws an error if there is any issue.
        /// If you are not restricting your search by the param, use the default value of "0"
        /// </summary>
        /// <param name="expenseTypeID">expense type ID</param>
        /// <exception cref="ArgumentOutOfRangeException">If the ID is outside of a valid search range for the ID</exception>
        private void CheckExpenseTypeSearchCriteria(int expenseTypeID = 0)
        {
            // check for invalid criteria for the search - "0" is ok, because we shouldn't be searching on it anyway.
            string argumentOutOfRangeMessage = string.Empty;
            if (expenseTypeID < 0)
            {
                argumentOutOfRangeMessage += argumentOutOfRangeMessage != string.Empty ? " :::: " : string.Empty;
                argumentOutOfRangeMessage += "expenseTypeID must be zero or a positive integer. Current value : " + expenseTypeID.ToString();
            }

            // if any were found, throw an error
            if (argumentOutOfRangeMessage != string.Empty)
            {
                throw new ArgumentOutOfRangeException(argumentOutOfRangeMessage);
            }
        }

        /// <summary>
        /// Checks to ensure that all the IDs sent in are within the valid range for the search. Throws an error if there is any issue.
        /// If you are not restricting your search by the param, use the default value of "0"
        /// </summary>
        /// <param name="paymentTypeID">payment type ID</param>
        /// <param name="paymentTypeCategoryID">payment type Category ID</param>
        /// <exception cref="ArgumentOutOfRangeException">If the ID is outside of a valid search range for the ID</exception>
        private void CheckPaymentTypeSearchCriteria(int paymentTypeID = 0, int paymentTypeCategoryID = 0)
        {
            // check for invalid criteria for the search - "0" is ok, because we shouldn't be searching on it anyway.
            string argumentOutOfRangeMessage = string.Empty;
            if (paymentTypeID < 0)
            {
                argumentOutOfRangeMessage += argumentOutOfRangeMessage != string.Empty ? " :::: " : string.Empty;
                argumentOutOfRangeMessage += "paymentTypeID must be zero or a positive integer. Current value : " + paymentTypeID.ToString();
            }
            if (paymentTypeCategoryID < 0)
            {
                argumentOutOfRangeMessage += argumentOutOfRangeMessage != string.Empty ? " :::: " : string.Empty;
                argumentOutOfRangeMessage += "paymentTypeCategoryID must be zero or a positive integer. Current value : " + paymentTypeCategoryID.ToString();
            }

            // if any were found, throw an error
            if (argumentOutOfRangeMessage != string.Empty)
            {
                throw new ArgumentOutOfRangeException(argumentOutOfRangeMessage);
            }
        }

        /// <summary>
        /// Checks to ensure that all the IDs sent in are within the valid range for the search. Throws an error if there is any issue.
        /// If you are not restricting your search by the param, use the default value of "0"
        /// </summary>
        /// <param name="paymentTypeCategoryID">payment type category ID</param>
        /// <exception cref="ArgumentOutOfRangeException">If the ID is outside of a valid search range for the ID</exception>
        private void CheckPaymentTypeCategorySearchCriteria(int paymentTypeCategoryID = 0)
        {
            // check for invalid criteria for the search - "0" is ok, because we shouldn't be searching on it anyway.
            string argumentOutOfRangeMessage = string.Empty;
            if (paymentTypeCategoryID < 0)
            {
                argumentOutOfRangeMessage += argumentOutOfRangeMessage != string.Empty ? " :::: " : string.Empty;
                argumentOutOfRangeMessage += "paymentTypeCategoryID must be zero or a positive integer. Current value : " + paymentTypeCategoryID.ToString();
            }

            // if any were found, throw an error
            if (argumentOutOfRangeMessage != string.Empty)
            {
                throw new ArgumentOutOfRangeException(argumentOutOfRangeMessage);
            }
        }

        #endregion Search_Criteria_Checks
    }
}