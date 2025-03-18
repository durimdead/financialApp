using FinanceApi.Models;

namespace FinanceApi.Services.Interfaces
{
    public interface IElement
    {
        /// <summary>
        /// update periodic element in database
        /// </summary>
        /// <param name="elementName">element name (max 50 characters)</param>
        /// <param name="elementSymbol">element symbol (max 3 characters)</param>
        /// <param name="elementWeight">element weight</param>
        /// <param name="elementID">positive integer representing element ID</param>
        /// <exception cref="ArgumentOutOfRangeException">If the elementID is < 1, it is invalid as this would never exist in the database</exception>
        public void UpdateElement(string elementName, string elementSymbol, double elementWeight, int elementID);

        /// <summary>
        /// Adds new element to the database. Does not take in an ID since the elementID field is an Identity column
        /// </summary>
        /// <param name="elementName">element name (max 50 characters)</param>
        /// <param name="elementSymbol">element symbol (max 3 characters)</param>
        /// <param name="elementWeight">element weight</param>
        public void AddElement(string elementName, string elementSymbol, double elementWeight);

        /// <summary>
        /// delete periodic element from database
        /// </summary>
        /// <param name="elementID">id of the element to delete. Will attempt to delete it</param>
        /// <exception cref="ArgumentOutOfRangeException">If the elementID is < 1, it is invalid as this would never exist in the database</exception>
        public void DeleteElement(int elementID);
    }
}
