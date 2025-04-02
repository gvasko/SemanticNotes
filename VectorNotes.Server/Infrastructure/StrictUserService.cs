using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VectorNotes.DomainModel;

namespace VectorNotes.Server.Infrastructure
{
    public class StrictUserService : IUserService
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IUserRepository userRepository;

        public StrictUserService(IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.userRepository = userRepository;
        }

        public async Task<User> GetCurrentUserAsync()
        {
            return await EnsureUserExists();
        }

        private async Task<User> EnsureUserExists()
        {
            var user = (httpContextAccessor.HttpContext?.User) ?? throw new UnauthorizedAccessException("User data cannot be found in HttpContextAccessor");

            string? name = user.Claims.FirstOrDefault(c => c.Type == "name")?.Value;
            string email = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value
                ?? throw new UnauthorizedAccessException("Email cannot be found in HttpContextAccessor");

            name ??= email;

            var existingUser = await userRepository.GetUserByEmailAsync(email)
                ?? await userRepository.CreateUserAsync(new User() { Email = email, Name = name });

            if (existingUser == null)
            {
                throw new UnauthorizedAccessException("User cannot be found or created");
            }

            return existingUser;
        }
    }
}
