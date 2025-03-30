using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Repositories.EF_Models
{
    public class vPaymentTypeCategory
    {
        [Key]
        public int PaymentTypeCategoryID { get; set; }
        public required string PaymentTypeCategoryName { get; set; }

    }
}
