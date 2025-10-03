using FinanceApi.Models.Expenses;
using FinanceApi.Repositories.EF_Models;
using FinanceApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Components;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using NpgsqlTypes;
using System.Data;

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
            var parameters = new List<NpgsqlParameter>();
            parameters.Add(new NpgsqlParameter("expense_type_id_param", NpgsqlDbType.Integer) { Value = expenseTypeID });
            parameters.Add(new NpgsqlParameter("expense_type_name_param", NpgsqlDbType.Text) { Value = expenseTypeName });
            parameters.Add(new NpgsqlParameter("expense_type_description_param", NpgsqlDbType.Text) { Value = expenseTypeDescription });

            // execute sproc
            this.Database.ExecuteSqlRaw("CALL public.proc_expense_type_upsert({0}, {1}, {2});", parameters);
        }

        /// <summary>
        /// Delete expense type record from database given expenseTypeID
        /// </summary>
        /// <param name="expenseTypeID">ID of record to delete</param>
        public void usp_ExpenseTypeDelete(int expenseTypeID)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<NpgsqlParameter>();
            parameters.Add(new NpgsqlParameter("expense_type_id_param", NpgsqlDbType.Integer) { Value = expenseTypeID });

            // execute sproc
            this.Database.ExecuteSqlRaw("CALL public.proc_expense_type_delete({0});", parameters);
        }

        /// <summary>
        /// Update / insert record to the PaymentTypeCategory table
        /// </summary>
        /// <param name="paymentTypeCategoryName">Name of payment type category</param>
        /// <param name="paymentTypeCategoryID">ID of the record (only required for update - has default of "0" for inserts)</param>
        public void usp_PaymentTypeCategoryUpsert(string paymentTypeCategoryName, int paymentTypeCategoryID = 0)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<NpgsqlParameter>();
            parameters.Add(new NpgsqlParameter("payment_type_category_id_param", NpgsqlDbType.Integer) { Value = paymentTypeCategoryID });
            parameters.Add(new NpgsqlParameter("payment_type_category_name_param", NpgsqlDbType.Text) { Value = paymentTypeCategoryName });

            // execute sproc
            this.Database.ExecuteSqlRaw("CALL public.proc_payment_type_category_upsert({0}, {1});", parameters);
        }

        /// <summary>
        /// Delete payment type category record from database
        /// </summary>
        /// <param name="paymentTypeCategoryID">ID of record to delete</param>
        public void usp_PaymentTypeCategoryDelete(int paymentTypeCategoryID)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<NpgsqlParameter>();
            parameters.Add(new NpgsqlParameter("payment_type_category_id_param", NpgsqlDbType.Integer) { Value = paymentTypeCategoryID });

            // execute sproc
            this.Database.ExecuteSqlRaw("CALL public.proc_payment_type_category_delete({0});", parameters);
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
            var parameters = new List<NpgsqlParameter>();
            parameters.Add(new NpgsqlParameter("payment_type_id_param", NpgsqlDbType.Integer) { Value = paymentTypeID });
            parameters.Add(new NpgsqlParameter("payment_type_name_param", NpgsqlDbType.Text) { Value = paymentTypeName });
            parameters.Add(new NpgsqlParameter("payment_type_description_param", NpgsqlDbType.Text) { Value = paymentTypeDescription });
            parameters.Add(new NpgsqlParameter("payment_type_category_id_param", NpgsqlDbType.Integer) { Value = paymentTypeCategoryID });

            // execute sproc
            this.Database.ExecuteSqlRaw("CALL public.proc_payment_type_upsert({0},{1},{2},{3});", parameters);
        }

        /// <summary>
        /// Delete payment type record from database
        /// </summary>
        /// <param name="paymentTypeID">ID of record to delete</param>
        public void usp_PaymentTypeDelete(int paymentTypeID)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<NpgsqlParameter>();
            parameters.Add(new NpgsqlParameter("payment_type_id_param", NpgsqlDbType.Integer) { Value = paymentTypeID });

            // execute sproc
            this.Database.ExecuteSqlRaw("CALL public.proc_payment_type_delete({0});", parameters);
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
            var parameters = new List<NpgsqlParameter>();
            parameters.Add(new NpgsqlParameter("expense_id_param", NpgsqlDbType.Integer) { Value = expenseID });
            parameters.Add(new NpgsqlParameter("expense_type_id_param", NpgsqlDbType.Integer) { Value = expenseTypeID });
            parameters.Add(new NpgsqlParameter("payment_type_id_param", NpgsqlDbType.Integer) { Value = paymentTypeID });
            parameters.Add(new NpgsqlParameter("payment_type_category_id_param", NpgsqlDbType.Integer) { Value = paymentTypeCategoryID });
            parameters.Add(new NpgsqlParameter("expense_description_param", NpgsqlDbType.Text) { Value = expenseDescription });
            parameters.Add(new NpgsqlParameter("is_income_param", NpgsqlDbType.Boolean) { Value = isIncome });
            parameters.Add(new NpgsqlParameter("is_investment_param", NpgsqlDbType.Boolean) { Value = isInvestment });
            parameters.Add(new NpgsqlParameter("expense_date_param", NpgsqlDbType.Date) { Value = expenseDate });
            parameters.Add(new NpgsqlParameter("expense_amount_param", NpgsqlDbType.Double) { Value = expenseAmount });

            // execute sproc
            this.Database.ExecuteSqlRaw("CALL public.proc_expense_upsert({0},{1},{2},{3},{4},{5},{6},{7},{8}::DECIMAL(20, 4));", parameters);
        }

        /// <summary>
        /// Delete Expense record from database
        /// </summary>
        /// <param name="expenseID">ID of record to delete</param>
        public void usp_ExpenseDelete(int expenseID)
        {
            // parameterize the data for executing the stored procedure
            var parameters = new List<NpgsqlParameter>();
            parameters.Add(new NpgsqlParameter("expense_id_param", NpgsqlDbType.Integer) { Value = expenseID });

            // execute sproc
            this.Database.ExecuteSqlRaw("CALL public.proc_expense_delete({0});", parameters);
        }
    }
}
