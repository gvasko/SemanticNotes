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
        Note UpdateNote(Note note);
        Task DeleteNoteByIdAsync(int noteId);

        Task<HiDimBipolarVector?> GetTextVectorFromCacheAsync(Note note, Alphabet alphabet);
        Task AddTextVectorToCacheAsync(Note note, Alphabet alphabet, HiDimBipolarVector vector);
        void RemoveNoteFromCacheAsync(int noteId);
        void RemoveAlphabetFromCache(int alphabetId);

        Task SaveAsync();

    }
}
