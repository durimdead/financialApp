using FinanceApi.Models.JsonDeserialization.POCs;

namespace FinanceApi.Models.Testing
{
    public class PeriodicElement
    {
        public PeriodicElement(PeriodicElementJson periodicElementJson)
        {
            ElementID = periodicElementJson.elementID;
            ElementName = periodicElementJson.elementName;
            ElementSymbol = periodicElementJson.elementSymbol;
            ElementWeight = periodicElementJson.elementWeight;
        }

        public PeriodicElement()
        {
            ElementID = 0;
            ElementName = string.Empty;
            ElementSymbol = string.Empty;
            ElementWeight = 0;
        }
        public int ElementID { get; set; }
        public string ElementName { get; set; }
        public string ElementSymbol { get; set; }
        public double ElementWeight { get; set; }
    }
}
