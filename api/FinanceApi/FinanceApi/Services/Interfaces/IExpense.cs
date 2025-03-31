using Microsoft.Data.SqlClient;

namespace FinanceApi.Services.Interfaces
{
    public interface IExpense
    {
        public void AddExpenseType(string expenseTypeName, string expenseTypeDescription);
        public void UpdateExpenseType(int expenseTypeID, string expenseTypeName, string expenseTypeDescription);
        public void DeleteExpenseType(int expenseTypeID);

        public void AddPaymentTypeCategory(string paymentTypeCategoryName);
        public void UpdatePaymentTypeCategory(int paymentTypeCategoryID, string paymentTypeCategoryName);
        public void DeletePaymentTypeCategory(int paymentTypeCategoryID);

        public void AddPaymentType(string paymentTypeName, string paymentTypeDescription, int paymentTypeCategoryID);
        public void UpdatePaymentType(int paymentTypeID, string paymentTypeName, string paymentTypeDescription, int paymentTypeCategoryID);
        public void DeletePaymentType(int paymentTypeID);

        public void AddExpense(int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment);
        public void UpdateExpense(int expenseID, int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment);
        public void DeleteExpense(int expenseID);
    }
}
