using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Repositories.EF_Models
{
    public class vPaymentType
    {
        public vPaymentType()
        {
            this.PaymentTypeID = 0;
            this.PaymentTypeCategoryID = 0;
            this.PaymentTypeName = string.Empty;
            this.PaymentTypeDescription = string.Empty;
            this.PaymentTypeCategoryDescription = string.Empty;
        }
        [Key]
        public int PaymentTypeID { get; set; }
        public string PaymentTypeName { get; set; }
        public string PaymentTypeDescription { get; set; }
        public int PaymentTypeCategoryID { get; set; }
        public string PaymentTypeCategoryDescription { get; set; }
    }
}
