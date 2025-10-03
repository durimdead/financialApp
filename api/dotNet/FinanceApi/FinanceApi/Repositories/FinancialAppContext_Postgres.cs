using FinanceApi.Repositories.EF_Models;
using FinanceApi.Repositories.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace FinanceApi.Repositories
{
    public class FinancialAppContext_Postgres : DbContext, IExpenseDbContext
    {
        public FinancialAppContext_Postgres(DbContextOptions options) : base(options) { }
        public virtual DbSet<vExpenseType> vExpenseType { get; set; }
        public virtual DbSet<vPaymentTypeCategory> vPaymentTypeCategory { get; set; }
        public virtual DbSet<vPaymentType> vPaymentType { get; set; }
        public virtual DbSet<vExpense> vExpense { get; set; }
        public virtual DbSet<vExpenseDetail> vExpenseDetail { get; set; }

        /// <summary>
        /// Update / insert record to the ExpenseType table
        /// </summary>
        /// <param name="expenseTypeName">name of expense type</param>
        /// <param name="expenseTypeDescription">description of expense type</param>
        /// <param name="expenseTypeID">ID of the record (only required for update - has default of "0" for inserts)</param>
        public void usp_ExpenseTypeUpsert(string expenseTypeName, string expenseTypeDescription, int expenseTypeID = 0)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@expenseTypeID", expenseTypeID));
            parameters.Add(new SqlParameter("@expenseTypeName", expenseTypeName));
            parameters.Add(new SqlParameter("@expenseTypeDescription", expenseTypeDescription));

            // execute sproc
            this.Database.ExecuteSqlRaw("exec usp_ExpenseTypeUpsert @expenseTypeID, @expenseTypeName, @expenseTypeDescription", parameters);
        }

        /// <summary>
        /// Delete expense type record from database given expenseTypeID
        /// </summary>
        /// <param name="expenseTypeID">ID of record to delete</param>
        public void usp_ExpenseTypeDelete(int expenseTypeID)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@expenseTypeID", expenseTypeID));

            // execute sproc
            this.Database.ExecuteSqlRaw("exec usp_ExpenseTypeDelete @expenseTypeID", parameters);
        }

        /// <summary>
        /// Update / insert record to the PaymentTypeCategory table
        /// </summary>
        /// <param name="paymentTypeCategoryName">Name of payment type category</param>
        /// <param name="paymentTypeCategoryID">ID of the record (only required for update - has default of "0" for inserts)</param>
        public void usp_PaymentTypeCategoryUpsert(string paymentTypeCategoryName, int paymentTypeCategoryID = 0)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@paymentTypeCategoryID", paymentTypeCategoryID));
            parameters.Add(new SqlParameter("@paymentTypeCategoryName", paymentTypeCategoryName));

            // execute sproc
            this.Database.ExecuteSqlRaw("exec usp_PaymentTypeCategoryUpsert @paymentTypeCategoryID, @paymentTypeCategoryName", parameters);
        }

        /// <summary>
        /// Delete payment type category record from database
        /// </summary>
        /// <param name="paymentTypeCategoryID">ID of record to delete</param>
        public void usp_PaymentTypeCategoryDelete(int paymentTypeCategoryID)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@paymentTypeCategoryID", paymentTypeCategoryID));

            // execute sproc
            this.Database.ExecuteSqlRaw("exec usp_PaymentTypeCategoryDelete @paymentTypeCategoryID", parameters);
        }

        /// <summary>
        /// Update / insert record to the PaymentType table
        /// </summary>
        /// <param name="paymentTypeName">Name of the payment type</param>
        /// <param name="paymentTypeDescription">description of the payment type</param>
        /// <param name="paymentTypeCategoryID">ID of the category of the payment type</param>
        /// <param name="paymentTypeID">ID of the record (only required for update - has default of "0" for inserts)</param>
        public void usp_PaymentTypeUpsert(string paymentTypeName, string paymentTypeDescription, int paymentTypeCategoryID, int paymentTypeID = 0)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@paymentTypeID", paymentTypeID));
            parameters.Add(new SqlParameter("@paymentTypeName", paymentTypeName));
            parameters.Add(new SqlParameter("@paymentTypeDescription", paymentTypeDescription));
            parameters.Add(new SqlParameter("@paymentTypeCategoryID", paymentTypeCategoryID));

            // execute sproc
            this.Database.ExecuteSqlRaw("exec usp_PaymentTypeUpsert @paymentTypeID, @paymentTypeName, @paymentTypeDescription, @paymentTypeCategoryID", parameters);
        }

        /// <summary>
        /// Delete payment type record from database
        /// </summary>
        /// <param name="paymentTypeID">ID of record to delete</param>
        public void usp_PaymentTypeDelete(int paymentTypeID)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@paymentTypeID", paymentTypeID));

            // execute sproc
            this.Database.ExecuteSqlRaw("exec usp_PaymentTypeDelete @paymentTypeID", parameters);
        }

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
        public void usp_ExpenseUpsert(int expenseTypeID, int paymentTypeID, int paymentTypeCategoryID, string expenseDescription, bool isIncome, bool isInvestment, DateOnly expenseDate, double expenseAmount, int expenseID = 0)
        {
            // parameterize the data for executing the stored procedure
            bool out_wasSuccessful = false;
            string out_errorMessage = string.Empty;
            string out_errorDetail = string.Empty;
            string out_errorHint = string.Empty;

            try
            {
                // execute sproc
                this.Database.ExecuteSqlRaw(
                    "CALL public.expense_upsert({0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12})"
                    , expenseID
                    , expenseTypeID
                    , paymentTypeID
                    , paymentTypeCategoryID
                    , expenseDescription
                    , (Byte)(isIncome ? 1 : 0)
                    , (Byte)(isInvestment ? 1 : 0)
                    , expenseDate
                    , expenseAmount
                    , out_wasSuccessful
                    , out_errorMessage
                    , out_errorDetail
                    , out_errorHint
                    );
                if (!out_wasSuccessful)
                {
                    throw new Exception("Error occurred when executing expense create / edit. See inner exception for more details.", new Exception(string.Format("MESSAGE : %s ::: DETAIL : %s ::: HINT : %s", out_errorMessage, out_errorDetail, out_errorHint)));
                }
            }
            catch (Exception ex)
            {
                out_errorMessage = ex.Message;
            }
        }

        /// <summary>
        /// Delete Expense record from database
        /// </summary>
        /// <param name="expenseID">ID of record to delete</param>
        public void usp_ExpenseDelete(int expenseID)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@expenseID", expenseID));

            // execute sproc
            this.Database.ExecuteSqlRaw("exec usp_ExpenseDelete @expenseID", parameters);
        }
    }
}
