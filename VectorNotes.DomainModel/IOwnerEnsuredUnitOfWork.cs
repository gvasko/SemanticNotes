using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    public interface IOwnerEnsuredUnitOfWork
    {
        Task<Note?> GetNoteByIdAsync(int id);
        Task<IQueryable<Note>> GetAllNotesByOwnerAsync();
        Task<Note> CreateNoteAsync(Note note);
        Task DeleteNoteByIdAsync(int noteId);


        Task SaveAsync();

    }
}
