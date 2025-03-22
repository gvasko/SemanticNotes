using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    public class DomainUnitOfWork : IDomainUnitOfWork
    {
        private readonly IBasicUnitOfWork basicUoW;
        private readonly IUserService userService;

        public DomainUnitOfWork(IBasicUnitOfWork basicUnitOfWork, IUserService userService)
        {
            this.basicUoW = basicUnitOfWork;
            this.userService = userService;
        }

        public async Task CreateOrUpdateTextVectorInCacheAsync(Note note, Alphabet alphabet, HiDimBipolarVector vector)
        {
            var user = await userService.GetCurrentUserAsync();
            if (user.Id != note.OwnerId)
            {
                throw new ArgumentException("Unknown note object");
            }

            await basicUoW.CreateOrUpdateTextVectorInCacheAsync(note, alphabet, vector);
        }

        public async Task<Alphabet> CreateAlphabetAsync(Alphabet alphabet)
        {
            var user = await userService.GetCurrentUserAsync();
            alphabet.OwnerId = user.Id;
            alphabet.Owner = null;
            return await basicUoW.CreateAlphabetAsync(alphabet);
        }

        public async Task<Note> CreateNoteAsync(Note note)
        {
            var user = await userService.GetCurrentUserAsync();
            note.OwnerId = user.Id;
            note.Owner = null;
            return await basicUoW.CreateNoteAsync(note);
        }

        public Task DeleteNoteByIdAsync(int noteId)
        {
            throw new NotImplementedException();
        }

        public async Task<IList<Alphabet>> GetAllAlphabetsAsync()
        {
            var user = await userService.GetCurrentUserAsync();
            var allAbc = await basicUoW.GetAllAlphabetsAsync();
            return allAbc.Where(abc => abc.OwnerId == user.Id).ToList();
        }

        public async Task<IQueryable<Note>> GetAllNotesAsync()
        {
            User user = await userService.GetCurrentUserAsync();
            var allNotes = await basicUoW.GetAllNotesAsync();
            return allNotes.Where(note => note.OwnerId == user.Id);
        }

        public async Task<Alphabet?> GetAlphabetAsync(int id)
        {
            var user = await userService.GetCurrentUserAsync();
            var abcFound = await basicUoW.GetAlphabetAsync(id);
            if (abcFound?.OwnerId == user.Id)
            {
                return abcFound;
            }
            return null;
        }

        public async Task<Alphabet> GetDefaultAlphabetAsync()
        {
            var abc = (await GetAllAlphabetsAsync()).FirstOrDefault();

            if (abc == null)
            {
                var defaultAlphabet = new Alphabet("Default", 5024, new RandomVectorFactory());
                abc = await CreateAlphabetAsync(defaultAlphabet);
            }

            return abc;
        }

        public async Task<Note?> GetNoteByIdAsync(int id)
        {
            var user = await userService.GetCurrentUserAsync();
            var allNotes = await GetAllNotesAsync();
            return allNotes.FirstOrDefault(note => note.Id == id);
        }

        public async Task<NoteTextVector?> GetTextVectorFromCacheAsync(Note note, Alphabet alphabet)
        {
            var user = await userService.GetCurrentUserAsync();
            if (note.OwnerId != user.Id)
            {
                throw new ArgumentException($"Invalid owner {note.OwnerId} on note {note.Id}");
            }
            if (alphabet.OwnerId != user.Id)
            {
                throw new ArgumentException($"Invalid owner {alphabet.OwnerId} on alphabet {alphabet.Id}");
            }
            return await basicUoW.GetTextVectorFromCacheAsync(note, alphabet);
        }

        public Task RemoveAlphabetAsync(int alphabetId)
        {
            throw new NotImplementedException();
        }

        public void RemoveAlphabetFromCache(int alphabetId)
        {
            throw new NotImplementedException();
        }

        public void RemoveNoteFromCacheAsync(int noteId)
        {
            throw new NotImplementedException();
        }

        public async Task SaveAsync()
        {
            await basicUoW.SaveAsync();
        }

        public async Task<Note> UpdateNoteAsync(Note updatedNote)
        {
            var noteFound = await GetNoteByIdAsync(updatedNote.Id) ?? throw new ArgumentException("Note not found");

            noteFound.Title = updatedNote.Title;
            noteFound.Content = updatedNote.Content;

            return await basicUoW.UpdateNoteAsync(noteFound);
        }

        Task<IQueryable<Alphabet>> IBasicUnitOfWork.GetAllAlphabetsAsync()
        {
            throw new NotImplementedException();
        }
    }
}
