using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Repositories.EF_Models
{
    public class vExpenseType
    {
        public vExpenseType()
        {
            ExpenseTypeID = 0;
            ExpenseTypeName = string.Empty;
            ExpenseTypeDescription = string.Empty;
        }
        [Key]
        public int ExpenseTypeID { get; set; }
        public required string ExpenseTypeName { get; set; }
        public required string ExpenseTypeDescription { get; set; }
    }
}
