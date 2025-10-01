using FinanceApi.Repositories.EF_Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace FinanceApi.Repositories.Interfaces
{
    public interface IExpenseDbContext
    {
        public DbSet<vExpenseType> vExpenseType { get; set; }
        public DbSet<vPaymentTypeCategory> vPaymentTypeCategory { get; set; }
        public DbSet<vPaymentType> vPaymentType { get; set; }
        public DbSet<vExpense> vExpense { get; set; }
        public DbSet<vExpenseDetail> vExpenseDetail { get; set; }

        /// <summary>
        /// Update / insert record to the PeriodicElement table
        /// </summary>
        /// <param name="periodicElementName">Name of Periodic Element</param>
        /// <param name="periodicElementSymbol">Symbol of element</param>
        /// <param name="periodicElementWeight">Weight of element</param>
        /// <param name="periodicElementID">ID of the record (only required for update - has default of "0" for inserts)</param>
        public void usp_PeriodicElementUpsert(string periodicElementName, string periodicElementSymbol, double periodicElementWeight, int periodicElementID = 0);

        /// <summary>
        /// Delete a Periodic Element record from the database
        /// </summary>
        /// <param name="periodicElementID">ID of record to delete</param>
        public void usp_PeriodicElementDelete(int periodicElementID);

        /// <summary>
        /// Update / insert record to the ExpenseType table
        /// </summary>
        /// <param name="expenseTypeName">name of expense type</param>
        /// <param name="expenseTypeDescription">description of expense type</param>
        /// <param name="expenseTypeID">ID of the record (only required for update - has default of "0" for inserts)</param>
        public void usp_ExpenseTypeUpsert(string expenseTypeName, string expenseTypeDescription, int expenseTypeID = 0);

        /// <summary>
        /// Delete expense type record from database given expenseTypeID
        /// </summary>
        /// <param name="expenseTypeID">ID of record to delete</param>
        public void usp_ExpenseTypeDelete(int expenseTypeID);

        /// <summary>
        /// Update / insert record to the PaymentTypeCategory table
        /// </summary>
        /// <param name="paymentTypeCategoryName">Name of payment type category</param>
        /// <param name="paymentTypeCategoryID">ID of the record (only required for update - has default of "0" for inserts)</param>
        public void usp_PaymentTypeCategoryUpsert(string paymentTypeCategoryName, int paymentTypeCategoryID = 0);

        /// <summary>
        /// Delete payment type category record from database
        /// </summary>
        /// <param name="paymentTypeCategoryID">ID of record to delete</param>
        public void usp_PaymentTypeCategoryDelete(int paymentTypeCategoryID);

        /// <summary>
        /// Update / insert record to the PaymentType table
        /// </summary>
        /// <param name="paymentTypeName">Name of the payment type</param>
        /// <param name="paymentTypeDescription">description of the payment type</param>
        /// <param name="paymentTypeCategoryID">ID of the category of the payment type</param>
        /// <param name="paymentTypeID">ID of the record (only required for update - has default of "0" for inserts)</param>
        public void usp_PaymentTypeUpsert(string paymentTypeName, string paymentTypeDescription, int paymentTypeCategoryID, int paymentTypeID = 0);

        /// <summary>
        /// Delete payment type record from database
        /// </summary>
        /// <param name="paymentTypeID">ID of record to delete</param>
        public void usp_PaymentTypeDelete(int paymentTypeID);

        /// <summary>
        /// Update / insert record to the Expense table
        /// </summary>
        /// <param name="expenseTypeID">ID of the type of expense</param>
        /// <param name="paymentTypeID">ID of the type of payment</param>
        /// <param name="paymentTypeCategoryID">ID of the category of the payment type</param>
        /// <param name="expenseDescription">Description of the expense</param>
        /// <param name="isIncome">"true" if this is income (i.e. paycheck, selling of an item, etc)</param>
        /// <param name="isInvestment">"true" if this money is being put into an investment vehicle (i.e. stocks, bonds, etc)</param>
        /// <param name="expenseDate">Date the expense occurred</param>
        /// <param name="expenseAmount">the amount for the expense</param>
        /// <param name="expenseID">ID of the record (only required for update - has default of "0" for inserts)</param>
        public void usp_ExpenseUpsert(int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment, DateOnly expenseDate, double expenseAmount, int expenseID = 0);

        /// <summary>
        /// Delete Expense record from database
        /// </summary>
        /// <param name="expenseID">ID of record to delete</param>
        public void usp_ExpenseDelete(int expenseID);
    }
}
