using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Repositories.EF_Models
{
    public class vExpenseType
    {
        [Key]
        public int ExpenseTypeID { get; set; }
        public required string ExpenseTypeName { get; set; }
        public required string ExpenseTypeDescription { get; set; }
    }
}
