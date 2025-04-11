using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Repositories.EF_Models
{
    public class vPaymentTypeCategory
    {
        public vPaymentTypeCategory()
        {
            this.PaymentTypeCategoryID = 0;
            this.PaymentTypeCategoryName = string.Empty;
        }

        [Key]
        public int PaymentTypeCategoryID { get; set; }
        public string PaymentTypeCategoryName { get; set; }

    }
}
