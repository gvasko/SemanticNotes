using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    public interface IBasicUnitOfWork
    {
        Task<Note?> GetNoteByIdAsync(int id);
        IQueryable<Note> GetAllNotes();
        Task<Note> CreateNoteAsync(Note note);
        Task DeleteNoteByIdAsync(int noteId);


        Task Save();

    }
}
