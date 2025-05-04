using Serilog;
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
        private readonly ITextVectorBuilder textVectorBuilder;

        public DomainUnitOfWork(IBasicUnitOfWork basicUnitOfWork, IUserService userService)
        {
            this.basicUoW = basicUnitOfWork;
            this.userService = userService;
            this.textVectorBuilder = new TextVectorBuilder();
        }

        public async Task CreateOrUpdateTextVectorInCacheAsync(Note note, Alphabet alphabet, HiDimBipolarVector vector)
        {
            var noteCollection = await basicUoW.GetNoteCollectionByIdAsync(note.NoteCollectionId) ?? throw new ArgumentException($"Invalid note collection");
            var user = await GetInitializedCurrentUserAsync();
            if (user.Id != noteCollection.OwnerId)
            {
                throw new ArgumentException("Unknown note object");
            }
            if (user.Id != alphabet.OwnerId)
            {
                throw new ArgumentException("Unknown alphabet object");
            }
            await basicUoW.CreateOrUpdateTextVectorInCacheAsync(note, alphabet, vector);
        }

        public async Task<Alphabet> CreateAlphabetAsync(Alphabet alphabet)
        {
            var user = await GetInitializedCurrentUserAsync();
            alphabet.OwnerId = user.Id;
            alphabet.Owner = null;
            return await basicUoW.CreateAlphabetAsync(alphabet);
        }

        public async Task<Note> CreateNoteAsync(Note note)
        {
            var noteCollection = await basicUoW.GetNoteCollectionByIdAsync(note.NoteCollectionId) ?? throw new ArgumentException($"Invalid note collection");
            var user = await GetInitializedCurrentUserAsync();
            if (noteCollection.OwnerId != user.Id)
            {
                throw new ArgumentException("Invalid owner");
            }

            var dbNote = await basicUoW.CreateNoteAsync(note);

            await CreateOrUpdateTextVectorWithDefaultAlphabet(dbNote);
            return dbNote;
        }

        private async Task CreateOrUpdateTextVectorWithDefaultAlphabet(Note note)
        {
            var abc = await GetDefaultAlphabetAsync();
            var vector = textVectorBuilder.BuildTextVector(abc, note.Content);
            await CreateOrUpdateTextVectorInCacheAsync(note, abc, vector);
        }

        public async Task DeleteNoteByIdAsync(int noteId)
        {
            var note = await GetNoteByIdAsync(noteId);

            if (note == null)
            {
                throw new ArgumentNullException($"Note with id {noteId} does not exist");
            }

            await RemoveNoteFromCacheAsync(noteId);
            await basicUoW.DeleteNoteByIdAsync(noteId);
        }

        public async Task<IList<Alphabet>> GetAllAlphabetsAsync()
        {
            var user = await GetInitializedCurrentUserAsync();
            var allAbc = await basicUoW.GetAllAlphabetsAsync();
            return allAbc.Where(abc => abc.OwnerId == user.Id).ToList();
        }

        public async Task<IQueryable<Note>> GetAllNotesAsync()
        {
            User user = await GetInitializedCurrentUserAsync();
            var allNotes = await basicUoW.GetAllNotesAsync();
            return allNotes.Where(note => note.NoteCollection != null && note.NoteCollection.OwnerId == user.Id);
        }

        public async Task<Alphabet?> GetAlphabetAsync(int id)
        {
            var user = await GetInitializedCurrentUserAsync();
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
                throw new InvalidOperationException("No default alphabet created.");
            }

            return abc;
        }

        public async Task<Note?> GetNoteByIdAsync(int id)
        {
            var allNotes = await GetAllNotesAsync();
            return allNotes.FirstOrDefault(note => note.Id == id);
        }

        public async Task<NoteTextVector?> GetTextVectorFromCacheAsync(Note note, Alphabet alphabet)
        {
            var user = await GetInitializedCurrentUserAsync();

            var noteCollection = await basicUoW.GetNoteCollectionByIdAsync(note.NoteCollectionId) ?? throw new ArgumentException($"Invalid collection {note.NoteCollectionId} on note {note.Id}");

            if (noteCollection.OwnerId != user.Id)
            {
                throw new ArgumentException($"Invalid owner {noteCollection.OwnerId} on noteCollection {noteCollection.Id}");
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

        public Task RemoveAlphabetFromCache(int alphabetId)
        {
            throw new NotImplementedException();
        }

        public async Task RemoveNoteFromCacheAsync(int noteId)
        {
            await GetNoteByIdAsync(noteId);
            await basicUoW.RemoveNoteFromCacheAsync(noteId);
        }

        public async Task SaveAsync()
        {
            await basicUoW.SaveAsync();
        }

        public async Task<Note> UpdateNoteAsync(Note updatedNote)
        {
            var existingNote = await ValidateNoteAsync(updatedNote);

            var dbNote = await basicUoW.UpdateNoteAsync(updatedNote);

            if (existingNote.Content != updatedNote.Content)
            {
                await CreateOrUpdateTextVectorWithDefaultAlphabet(dbNote);
            }
            return dbNote;
        }

        private async Task<Note> ValidateNoteAsync(Note updatedNote)
        {
            var existingNote = await GetNoteByIdAsync(updatedNote.Id) ?? throw new ArgumentException("Note not found");

            if (existingNote.NoteCollectionId != updatedNote.NoteCollectionId)
            {
                var existingNoteCollection = await basicUoW.GetNoteCollectionByIdAsync(existingNote.NoteCollectionId) ?? throw new ArgumentException($"Invalid existing note collection");
                var updatedNoteCollection = await basicUoW.GetNoteCollectionByIdAsync(updatedNote.NoteCollectionId) ?? throw new ArgumentException($"Invalid updated note collection");
                if (existingNoteCollection.OwnerId != updatedNoteCollection.OwnerId)
                {
                    throw new ArgumentException("Invalid owner in note collection to update");
                }

            }

            return existingNote;
        }

        Task<IQueryable<Alphabet>> IBasicUnitOfWork.GetAllAlphabetsAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<NoteCollection?> GetNoteCollectionByIdAsync(int id)
        {
            User user = await GetInitializedCurrentUserAsync();
            var noteCollection = await basicUoW.GetNoteCollectionByIdAsync(id);
            return noteCollection?.OwnerId == user.Id ? noteCollection : null;
        }

        public async Task<IQueryable<NoteCollection>> GetAllNoteCollectionsAsync()
        {
            User user = await GetInitializedCurrentUserAsync();
            var allNoteCollections = await basicUoW.GetAllNoteCollectionsAsync();
            return allNoteCollections.Where(nc => nc.OwnerId == user.Id);
        }

        public async Task<NoteCollection> CreateNoteCollectionAsync(NoteCollection noteCollection)
        {
            User user = await GetInitializedCurrentUserAsync();
            noteCollection.Owner = null;
            noteCollection.OwnerId = user.Id;
            var dbNoteCollection = await basicUoW.CreateNoteCollectionAsync(noteCollection);
            return dbNoteCollection;
        }

        public Task<NoteCollection> UpdateNoteCollectionAsync(NoteCollection noteCollection)
        {
            throw new NotImplementedException();
        }

        public Task DeleteNoteCollectionByIdAsync(int noteCollectionId)
        {
            throw new NotImplementedException();
        }

        private async Task<User> GetInitializedCurrentUserAsync()
        {
            return await GetInitializedCurrentUserAsync(userService, basicUoW);
        }

        /// <summary>
        /// The method is static to ensure it cannot call instance methods, 
        /// because they will call it.
        /// </summary>
        /// <returns></returns>
        private static async Task<User> GetInitializedCurrentUserAsync(IUserService userService, IBasicUnitOfWork basicUoW)
        {
            Log.Debug("Getting user info and ensuring it is initialized.");
            var user = await userService.GetCurrentUserAsync();

            Log.Information("User is connected: {email}", user.Email);

            // ensure default alphabet
            var allAbc = await basicUoW.GetAllAlphabetsAsync();
            var foundAbc = allAbc.Where(abc => abc.OwnerId == user.Id).FirstOrDefault();

            if (foundAbc == null)
            {
                var defaultAlphabet = new Alphabet("Default", 5024, new RandomVectorFactory());
                defaultAlphabet.OwnerId = user.Id;
                defaultAlphabet.Owner = null;

                await basicUoW.CreateAlphabetAsync(defaultAlphabet);
            }

            // default collection
            var allNoteCollections = await basicUoW.GetAllNoteCollectionsAsync();
            var foundCollection = allNoteCollections.Where(nc => nc.OwnerId == user.Id).FirstOrDefault();

            if (foundCollection == null)
            {
                var defaultCollection = new NoteCollection()
                {
                    Name = "Default",
                    OwnerId = user.Id
                };

                await basicUoW.CreateNoteCollectionAsync(defaultCollection);
            }

            return user;
        }
    }
}
