using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    /// <summary>
    /// No Save method, saved autoamtically after every operation.
    /// </summary>
    public interface IUserRepository
    {
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByEmailAsync(string email);
        void UpdateUser(User updated);
        Task<User> CreateUserAsync(User user);
        Task DeleteUser(int id);
    }
}
