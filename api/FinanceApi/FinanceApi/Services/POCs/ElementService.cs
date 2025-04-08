using FinanceApi.Controllers;
using FinanceApi.Models.Testing;
using FinanceApi.Repositories;
using FinanceApi.Services.POCs.Interfaces;

namespace FinanceApi.Services.POCs
{
    public class ElementService : IElement
    {
        private readonly ILogger<ElementService> _logger;
        private readonly FinancialAppContext _context;
        public ElementService(ILogger<ElementService> logger, FinancialAppContext context)
        {
            _logger = logger;
            _context = context;
        }

        /// <summary>
        /// returns all elements in the array
        /// </summary>
        /// <returns>array of all elements in the database</returns>
        public PeriodicElement[] GetElements()
        {
            try
            {
                var periodicElements = _context.vPeriodicElement.Select(x => new PeriodicElement()
                {
                    actions = "",
                    elementId = x.PeriodicElementID,
                    elementName = x.PeriodicElementName,
                    elementWeight = x.PeriodicElementWeight,
                    elementSymbol = x.PeriodicElementSymbol
                }).ToArray();
                return periodicElements;
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                throw;
            }
        }

        /// <summary>
        /// update periodic element in database
        /// </summary>
        /// <param name="elementName">element name (max 50 characters)</param>
        /// <param name="elementSymbol">element symbol (max 3 characters)</param>
        /// <param name="elementWeight">element weight</param>
        /// <param name="elementID">positive integer representing element ID</param>
        /// <exception cref="ArgumentOutOfRangeException">If the elementID is < 1, it is invalid as this would never exist in the database</exception>
        public void UpdateElement(string elementName, string elementSymbol, double elementWeight, int elementID)
        {
            try
            {
                // make sure the elementID sent in is going to be valid
                if (elementID < 1)
                {
                    throw new ArgumentOutOfRangeException("Element ID must be larger than 0. ElementId : " + elementID);
                }

                // update the element with the parameter
                _context.usp_PeriodicElementUpsert(elementName, elementSymbol, elementWeight, elementID);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                throw;
            }
        }

        /// <summary>
        /// Adds new element to the database. Does not take in an ID since the elementID field is an Identity column
        /// </summary>
        /// <param name="elementName">element name (max 50 characters)</param>
        /// <param name="elementSymbol">element symbol (max 3 characters)</param>
        /// <param name="elementWeight">element weight</param>
        public void AddElement(string elementName, string elementSymbol, double elementWeight)
        {
            try
            {
                // call the db upsert
                _context.usp_PeriodicElementUpsert(elementName, elementSymbol, elementWeight, 0);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                throw;
            }
        }

        /// <summary>
        /// delete periodic element from database
        /// </summary>
        /// <param name="elementID">id of the element to delete. Will attempt to delete it</param>
        /// <exception cref="ArgumentOutOfRangeException">If the elementID is < 1, it is invalid as this would never exist in the database</exception>
        public void DeleteElement(int elementID)
        {
            try
            {
                // make sure the elementID sent in is going to be valid
                if (elementID < 1)
                {
                    throw new ArgumentOutOfRangeException("Element ID must be larger than 0. ElementId : " + elementID);
                }

                _context.usp_PeriodicElementDelete(elementID);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                throw;
            }
        }

    }
}
