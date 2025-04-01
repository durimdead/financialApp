using Microsoft.Data.SqlClient;

namespace FinanceApi.Services.Interfaces
{
    public interface IExpense
    {
        #region Add_New_Records
        /// <summary>
        /// Add expense to database
        /// </summary>
        /// <param name="expenseTypeID">expense type ID</param>
        /// <param name="paymentTypeID">payment type ID</param>
        /// <param name="paymentTypeCategoryID">payment type category ID</param>
        /// <param name="expenseDescription">description of the expense</param>
        /// <param name="isIncome">if this is income</param>
        /// <param name="isInvestment">if this expense is being put into an investment vehicle</param>
        /// <exception cref="ArgumentOutOfRangeException">if any of the IDs are outside of a valid range for the ID</exception>
        public void AddExpense(int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment);
        public void AddExpenseType(string expenseTypeName, string expenseTypeDescription);
        public void AddPaymentType(string paymentTypeName, string paymentTypeDescription, int paymentTypeCategoryID);
        public void AddPaymentTypeCategory(string paymentTypeCategoryName);
        #endregion Add_New_Records

        #region Delete_Records
        public void DeleteExpense(int expenseID);
        public void DeleteExpenseType(int expenseTypeID);
        public void DeletePaymentType(int paymentTypeID);
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
