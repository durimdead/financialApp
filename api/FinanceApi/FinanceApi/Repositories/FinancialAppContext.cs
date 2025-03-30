using FinanceApi.Repositories;
using FinanceApi.Repositories.EF_Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;


namespace FinanceApi.Repositories
{
    public class FinancialAppContext: DbContext
    {
        public FinancialAppContext(DbContextOptions options) : base(options) { }

        public virtual DbSet<vPeriodicElement> vPeriodicElement { get; set; }
        public virtual DbSet<vExpenseType> vExpenseType { get; set; }
        public virtual DbSet<vPaymentTypeCategory> vPaymentTypeCategory { get; set; }
        public virtual DbSet<vPaymentType> vPaymentType { get; set; }
        public virtual DbSet<vExpense> vExpense { get; set; }
        public virtual DbSet<vExpenseDetails> VExpenseDetails { get; set; }

        public void usp_PeriodicElementUpsert(string periodicElementName, string periodicElementSymbol, double periodicElementWeight, int periodicElementID = 0)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@periodicElementName", periodicElementName));
            parameters.Add(new SqlParameter("@periodicElementSymbol", periodicElementSymbol));
            parameters.Add(new SqlParameter("@periodicElementWeight", periodicElementWeight));
            parameters.Add(new SqlParameter("@periodicElementID", periodicElementID));

            // execute sproc
            this.Database.ExecuteSqlRaw("exec usp_PeriodicElementUpsert @periodicElementID, @periodicElementName, @periodicElementSymbol, @periodicElementWeight", parameters);
        }

        public void usp_PeriodicElementDelete(int periodicElementID)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@periodicElementID", periodicElementID));

            // execute sproc
            this.Database.ExecuteSqlRaw("exec usp_PeriodicElementDelete @periodicElementID", parameters);
        }

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

        public void usp_ExpenseTypeDelete(int expenseTypeID)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@expenseTypeID", expenseTypeID));

            // execute sproc
            this.Database.ExecuteSqlRaw("exec usp_ExpenseTypeDelete @expenseTypeID", parameters);
        }

        public void usp_PaymentTypeCategoryUpsert(string paymentTypeCategoryName, int paymentTypeCategoryID = 0)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@paymentTypeCategoryID", paymentTypeCategoryID));
            parameters.Add(new SqlParameter("@paymentTypeCategoryName", paymentTypeCategoryName));

            // execute sproc
            this.Database.ExecuteSqlRaw("exec usp_PaymentTypeCategoryUpsert @paymentTypeCategoryID, @paymentTypeCategoryName", parameters);
        }

        public void usp_PaymentTypeCategoryDelete(int paymentTypeCategoryID)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@paymentTypeCategoryID", paymentTypeCategoryID));

            // execute sproc
            this.Database.ExecuteSqlRaw("exec usp_PaymentTypeCategoryDelete @paymentTypeCategoryID", parameters);
        }

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

        public void usp_PaymentTypeDelete(int paymentTypeID)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@paymentTypeID", paymentTypeID));

            // execute sproc
            this.Database.ExecuteSqlRaw("exec usp_PaymentTypeDelete @paymentTypeID", parameters);
        }
    }
}
