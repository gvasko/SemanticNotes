using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    public interface IBasicUnitOfWork
    {
        Task<NoteCollection?> GetNoteCollectionByIdAsync(int id);
        Task<IQueryable<NoteCollection>> GetAllNoteCollectionsAsync();
        Task<NoteCollection> CreateNoteCollectionAsync(NoteCollection noteCollection);
        Task<NoteCollection> UpdateNoteCollectionAsync(NoteCollection noteCollection);
        Task DeleteNoteCollectionByIdAsync(int noteCollectionId);

        Task<Note?> GetNoteByIdAsync(int id);
        Task<IQueryable<Note>> GetAllNotesAsync();
        Task<Note> CreateNoteAsync(Note note);
        Task<Note> UpdateNoteAsync(Note note);
        Task DeleteNoteByIdAsync(int noteId);

        Task<Alphabet?> GetAlphabetAsync(int id);
        Task<IQueryable<Alphabet>> GetAllAlphabetsAsync();
        Task<Alphabet> CreateAlphabetAsync(Alphabet alphabet);
        Task RemoveAlphabetAsync(int alphabetId);

        Task<NoteTextVector?> GetTextVectorFromCacheAsync(Note note, Alphabet alphabet);
        Task CreateOrUpdateTextVectorInCacheAsync(Note note, Alphabet alphabet, HiDimBipolarVector vector);
        void RemoveNoteFromCacheAsync(int noteId);
        void RemoveAlphabetFromCache(int alphabetId);

        Task SaveAsync();

    }
}
