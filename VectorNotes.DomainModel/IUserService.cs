using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    public interface IUserService
    {
        Task<User> GetCurrentUserAsync();
    }
}
