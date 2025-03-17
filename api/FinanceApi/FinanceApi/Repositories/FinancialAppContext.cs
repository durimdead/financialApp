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
    }
}
