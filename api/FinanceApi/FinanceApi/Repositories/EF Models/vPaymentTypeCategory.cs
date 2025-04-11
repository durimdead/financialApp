using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Repositories.EF_Models
{
    public class vPaymentTypeCategory
    {
        public vPaymentTypeCategory()
        {
            PaymentTypeCategoryID = 0;
            PaymentTypeCategoryName = string.Empty;
        }

        [Key]
        public int PaymentTypeCategoryID { get; set; }
        public string PaymentTypeCategoryName { get; set; }

    }
}
