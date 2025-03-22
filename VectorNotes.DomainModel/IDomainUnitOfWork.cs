using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    /// <summary>
    /// Ensures correct owner
    /// Extends IBasicUnitOfWork with advanced operations
    /// </summary>
    public interface IDomainUnitOfWork : IBasicUnitOfWork
    {
        Task<Alphabet> GetDefaultAlphabetAsync();
    }
}
