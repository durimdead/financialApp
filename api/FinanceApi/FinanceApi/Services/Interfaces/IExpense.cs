using Microsoft.Data.SqlClient;

namespace FinanceApi.Services.Interfaces
{
    public interface IExpense
    {
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
        public void AddExpense(int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment);

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
        public void UpdateExpense(int expenseID, int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment);
        public void UpdateExpenseType(int expenseTypeID, string expenseTypeName, string expenseTypeDescription);
        public void UpdatePaymentType(int paymentTypeID, string paymentTypeName, string paymentTypeDescription, int paymentTypeCategoryID);
        public void UpdatePaymentTypeCategory(int paymentTypeCategoryID, string paymentTypeCategoryName);
        #endregion Update_Existing_Records
    }
}
