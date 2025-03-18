using FinanceApi.Models;

namespace FinanceApi.Services.Interfaces
{
    public interface IElement
    {
        public void UpdateElement(string elementName, string elementSymbol, double elementWeight, int elementID);
        public void AddElement(string elementName, string elementSymbol, double elementWeight);
        public void DeleteElement(int elementId);
    }
}
