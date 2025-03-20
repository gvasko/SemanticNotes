using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VectorNotes.DomainModel;

namespace VectorNotes.Data.Infrastructure
{
    public class UserRepository : IUserRepository
    {
        private readonly VectorNotesContext dbContext;

        public UserRepository(VectorNotesContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<User> CreateUserAsync(User user)
        {
            var dbUser = await dbContext.Users.AddAsync(user);
            await dbContext.SaveChangesAsync();
            return dbUser.Entity;
        }

        public async Task DeleteUser(int id)
        {
            var dbUser = await dbContext.Users.FirstOrDefaultAsync(user => user.Id == id);
            if (dbUser == null)
            {
                throw new ArgumentException($"User not found with id {id}");
            }
            dbContext.Users.Remove(dbUser);
            await dbContext.SaveChangesAsync();
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Email == email);
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Id == id);
        }

        public void UpdateUser(User updated)
        {
            dbContext.Users.Update(updated);
            dbContext.SaveChanges();
        }
    }
}
