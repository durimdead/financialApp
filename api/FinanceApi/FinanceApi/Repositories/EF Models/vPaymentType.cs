using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Repositories.EF_Models
{
    public class vPaymentType
    {
        public vPaymentType()
        {
            PaymentTypeID = 0;
            PaymentTypeCategoryID = 0;
            PaymentTypeName = string.Empty;
            PaymentTypeDescription = string.Empty;
            PaymentTypeCategoryDescription = string.Empty;
        }
        [Key]
        public int PaymentTypeID { get; set; }
        public string PaymentTypeName { get; set; }
        public string PaymentTypeDescription { get; set; }
        public int PaymentTypeCategoryID { get; set; }
        public string PaymentTypeCategoryDescription { get; set; }
    }
}
