using FinanceApi.Models.Expenses;
using FinanceApi.Repositories.EF_Models;
using Microsoft.Data.SqlClient;

namespace FinanceApi.Services.RepositoryServices.Expenses.Interfaces
{
    public interface IExpensesRepository
    {
        #region Get_Records
        /// <summary>
        /// attempts to grab an individual expense by ID
        /// </summary>
        /// <param name="expenseID">the expense ID you would like to get a record for</param>
        /// <returns>The Expense record for the expenseID - otherwise, returns an empty "Expense" object if expense ID not found</returns>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the search criteria (i.e. < 0)</exception>
        public Expense GetExpense(int expenseID = 0);

        /// <summary>
        /// Returns all records from vExpense as a list of Expense objects
        /// </summary>
        /// <returns>a list of expense objects</returns>
        public List<Expense> GetExpenses();

        /// <summary>
        /// Get the list of expenses with the search criteria (can search by date)
        /// </summary>
        /// <param name="expenseTypeID">The expense type ID to filter on (pass in "0" to ignore this parameter)</param>
        /// <param name="paymentTypeID">The payment type ID to filter on (pass in "0" to ignore this parameter)</param>
        /// <param name="paymentTypeCategoryID">The payment type category ID to filter on (pass in "0" to ignore this parameter)</param>
        /// <param name="expenseID">The expense ID to filter on (pass in "0" to ignore this parameter)</param>
        /// <returns>A list of expenses based on the search criteria passed in.</returns>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the search criteria (i.e. < 0)</exception>
        public List<Expense> GetExpenses(int expenseTypeID = 0, int paymentTypeID = 0, int paymentTypeCategoryID = 0, int expenseID = 0);

        /// <summary>
        /// Get the list of expenses with the search criteria (can search by date)
        /// </summary>
        /// <param name="dateStart">start of the date range to search within (must be <= dateEnd)</param>
        /// <param name="dateEnd">end of the date range to search within (must be >= dateStart)</param>
        /// <param name="expenseTypeID">The expense type ID to filter on (pass in "0" to ignore this parameter)</param>
        /// <param name="paymentTypeID">The payment type ID to filter on (pass in "0" to ignore this parameter)</param>
        /// <param name="paymentTypeCategoryID">The payment type category ID to filter on (pass in "0" to ignore this parameter)</param>
        /// <param name="expenseID">The expense ID to filter on (pass in "0" to ignore this parameter)</param>
        /// <returns>A list of expenses based on the search criteria passed in.</returns>
        /// <exception cref="InvalidOperationException">if dateStart > dateEnd</exception>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the search criteria (i.e. < 0)</exception>
        public List<Expense> GetExpenses(DateTime dateStart, DateTime dateEnd, int expenseTypeID = 0, int paymentTypeID = 0, int paymentTypeCategoryID = 0, int expenseID = 0);

        /// <summary>
        /// Get the list of expense types with the search criteria
        /// </summary>
        /// <param name="expenseTypeID">the expense type ID of the record to return ("0" to ignore this search criteria).</param>
        /// <param name="expenseTypeName">full or partial name of expense type to search on  ("" to ignore this search criteria).</param>
        /// <param name="expenseTypeDescription">full or partial description of expense type to search on  ("" to ignore this search criteria).</param>
        /// <returns>A list of Expense Type records based on the search criteria</returns>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the search criteria (i.e. < 0)</exception>
        public List<ExpenseType> GetExpenseTypes(int expenseTypeID = 0, string expenseTypeName = "", string expenseTypeDescription = "");

        /// <summary>
        /// Returns a list of payment types based on the search criteria sent in. Use default param values to get ALL Payment Type records.
        /// </summary>
        /// <param name="paymentTypeID">ID of the payment type to return ("0" to ignore this search criteria).</param>
        /// <param name="paymentTypeCategoryID">ID of the payment type category that this payment type falls within ("0" to ignore this search criteria).</param>
        /// <param name="paymentTypeName">full or partial name of payment types to search on ("" to ignore this search criteria).</param>
        /// <param name="paymentTypeDescription">full or partial description of payment types to search on ("" to ignore this search criteria).</param>
        /// <returns>A list of Payment Type records based on the search criteria</returns>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the search criteria (i.e. < 0)</exception>
        public List<PaymentType> GetPaymentTypes(int paymentTypeID = 0, int paymentTypeCategoryID = 0, string paymentTypeName = "", string paymentTypeDescription = "");

        /// <summary>
        /// Get the list of payment type categories with the search criteria
        /// </summary>
        /// <param name="paymentTypeCategoryID">ID of the payment type category to return ("0" to ignore this search criteria).</param>
        /// <param name="paymentTypeCategoryName">full or partial name of payment type categories to search on ("" to ignore this search criteria).</param>
        /// <returns>A list of Payment Type Category records based on the search criteria</returns>
        public List<PaymentTypeCategory> GetPaymentTypeCategories(int paymentTypeCategoryID = 0, string paymentTypeCategoryName = "");

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
        public void AddExpense(int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment, DateOnly expenseDate, double expenseAmount);

        /// <summary>
        /// Add Expense Type record to the database
        /// </summary>
        /// <param name="expenseTypeName">expense type name</param>
        /// <param name="expenseTypeDescription">description of the expense type</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void AddExpenseType(string expenseTypeName, string expenseTypeDescription);

        /// <summary>
        /// Add payment type record to the database
        /// </summary>
        /// <param name="paymentTypeName">payment type name</param>
        /// <param name="paymentTypeDescription">description of the payment type</param>
        /// <param name="paymentTypeCategoryID">payment type category ID</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void AddPaymentType(string paymentTypeName, string paymentTypeDescription, int paymentTypeCategoryID);

        /// <summary>
        /// Add payment type category record to the database
        /// </summary>
        /// <param name="paymentTypeCategoryName">payment type category name</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void AddPaymentTypeCategory(string paymentTypeCategoryName);
        #endregion Add_New_Records

        #region Delete_Records
        /// <summary>
        /// Delete an expense record from the database give the expense ID
        /// </summary>
        /// <param name="expenseID">expense ID to delete</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void DeleteExpense(int expenseID);

        /// <summary>
        /// Delete an expense type record from the database give the expense type ID
        /// </summary>
        /// <param name="expenseTypeID">expense type ID to delete</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void DeleteExpenseType(int expenseTypeID);

        /// <summary>
        /// Delete payment type record from the database give the payment type ID
        /// </summary>
        /// <param name="paymentTypeID">payment type ID to delete</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void DeletePaymentType(int paymentTypeID);

        /// <summary>
        /// Delete payment type category record from the database give the payment type category ID
        /// </summary>
        /// <param name="paymentTypeCategoryID">payment type category ID to delete</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void DeletePaymentTypeCategory(int paymentTypeCategoryID);
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
        public void UpdateExpense(int expenseID, int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment, DateOnly expenseDate, double expenseAmount);

        /// <summary>
        /// Update an expense type record
        /// </summary>
        /// <param name="expenseTypeID">ID of the expense type to update</param>
        /// <param name="expenseTypeName">expense type name</param>
        /// <param name="expenseTypeDescription">description of the expense type</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void UpdateExpenseType(int expenseTypeID, string expenseTypeName, string expenseTypeDescription);

        /// <summary>
        /// Update a payment type record
        /// </summary>
        /// <param name="paymentTypeID">ID of the payment type to update</param>
        /// <param name="paymentTypeName">payment type name</param>
        /// <param name="paymentTypeDescription">description of the payment type</param>
        /// <param name="paymentTypeCategoryID">payment type category ID</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void UpdatePaymentType(int paymentTypeID, string paymentTypeName, string paymentTypeDescription, int paymentTypeCategoryID);

        /// <summary>
        /// Update a payment type category record
        /// </summary>
        /// <param name="paymentTypeCategoryID">ID of the payment type category to update</param>
        /// <param name="paymentTypeCategoryName">payment type category name</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void UpdatePaymentTypeCategory(int paymentTypeCategoryID, string paymentTypeCategoryName);
        #endregion Update_Existing_Records
    }
}
