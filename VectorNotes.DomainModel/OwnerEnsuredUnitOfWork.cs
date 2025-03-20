using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    public class OwnerEnsuredUnitOfWork : IOwnerEnsuredUnitOfWork
    {
        private readonly IBasicUnitOfWork basicUnitOfWork;
        private readonly IUserService userService;

        public OwnerEnsuredUnitOfWork(IBasicUnitOfWork basicUnitOfWork, IUserService userService)
        {
            this.basicUnitOfWork = basicUnitOfWork;
            this.userService = userService;
        }

        public async Task<Note> CreateNoteAsync(Note note)
        {
            var user = await userService.GetCurrentUserAsync();
            note.OwnerId = user.Id;
            note.Owner = null;
            return await basicUnitOfWork.CreateNoteAsync(note);
        }

        public Task DeleteNoteByIdAsync(int noteId)
        {
            throw new NotImplementedException();
        }

        public async Task<IQueryable<Note>> GetAllNotesByOwnerAsync()
        {
            User user = await userService.GetCurrentUserAsync();
            return basicUnitOfWork.GetAllNotes().Where(note => note.OwnerId == user.Id);
        }

        public async Task<Note?> GetNoteByIdAsync(int id)
        {
            var user = await userService.GetCurrentUserAsync();
            return basicUnitOfWork.GetAllNotes().FirstOrDefault(note => note.OwnerId == user.Id && note.Id == id);
        }

        public async Task SaveAsync()
        {
            await basicUnitOfWork.SaveAsync();
        }
    }
}
