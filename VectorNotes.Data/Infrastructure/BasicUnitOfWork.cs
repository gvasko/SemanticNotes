using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VectorNotes.DomainModel;

namespace VectorNotes.Data.Infrastructure
{
    public class BasicUnitOfWork : IBasicUnitOfWork
    {
        private readonly VectorNotesContext dbContext;

        public BasicUnitOfWork(VectorNotesContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task CreateOrUpdateTextVectorInCacheAsync(Note note, Alphabet alphabet, HiDimBipolarVector vector)
        {
            var existingVector = await GetTextVectorFromCacheAsync(note, alphabet);
            if (existingVector == null)
            {
                await dbContext.NoteTextVectorCache.AddAsync(new NoteTextVector(note.Id, alphabet.Id, vector));
            }
            else
            {
                existingVector.Vector = vector;
                dbContext.NoteTextVectorCache.Update(existingVector);
            }
            await dbContext.SaveChangesAsync();
        }

        public async Task<Alphabet> CreateAlphabetAsync(Alphabet alphabet)
        {
            var entry = await dbContext.Alphabets.AddAsync(alphabet);
            await dbContext.SaveChangesAsync();
            return entry.Entity;
        }

        public async Task<Note> CreateNoteAsync(Note note)
        {
            var entry = await dbContext.Notes.AddAsync(note);
            await dbContext.SaveChangesAsync();
            return entry.Entity;
        }

        public Task DeleteNoteByIdAsync(int noteId)
        {
            throw new NotImplementedException();
        }

        public Task<IQueryable<Alphabet>> GetAllAlphabetsAsync()
        {
            return Task.FromResult(dbContext.Alphabets.Include(abc => abc.LetterVectors).AsNoTracking());
        }

        public Task<IQueryable<Note>> GetAllNotesAsync()
        {
            return Task.FromResult(dbContext.Notes
                .Include(n => n.Tags)
                .Include(n => n.NoteCollection)
                .AsNoTracking());
        }

        public async Task<Alphabet?> GetAlphabetAsync(int id)
        {
            var allAbc = await GetAllAlphabetsAsync();
            return await allAbc.FirstOrDefaultAsync(abc => abc.Id == id);
        }

        public async Task<Note?> GetNoteByIdAsync(int id)
        {
            return await dbContext.Notes.AsNoTracking().FirstOrDefaultAsync(note => note.Id == id);
        }

        public async Task<NoteTextVector?> GetTextVectorFromCacheAsync(Note note, Alphabet alphabet)
        {
            return await dbContext.NoteTextVectorCache.AsNoTracking().FirstOrDefaultAsync(entry => entry.NoteId == note.Id && entry.AlphabetId == alphabet.Id);
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
            await dbContext.SaveChangesAsync();
        }

        public async Task<Note> UpdateNoteAsync(Note note)
        {
            var existingNote = await dbContext.Notes
                .Include(n => n.Tags)
                .FirstOrDefaultAsync(n => n.Id == note.Id);

            if (existingNote == null)
            {
                throw new ArgumentException($"Note not found ({note.Id})");
            }

            // Update the note properties
            existingNote.Title = note.Title;
            existingNote.Content = note.Content;

            // Update the tags
            var existingTags = existingNote.Tags.ToList();
            var newTags = note.Tags.Except(existingTags).ToList();
            var removedTags = existingTags.Except(note.Tags).ToList();

            foreach (var tag in newTags)
            {
                existingNote.Tags.Add(tag);
            }

            foreach (var tag in removedTags)
            {
                existingNote.Tags.Remove(tag);
            }

            dbContext.Notes.Update(existingNote);
            await dbContext.SaveChangesAsync();

            return existingNote;
        }

        public async Task<NoteCollection?> GetNoteCollectionByIdAsync(int id)
        {
            return await dbContext.NoteCollections.AsNoTracking().Include(nc => nc.Notes).FirstOrDefaultAsync(nc => nc.Id == id);
        }

        public Task<IQueryable<NoteCollection>> GetAllNoteCollectionsAsync()
        {
            return Task.FromResult(dbContext.NoteCollections.AsNoTracking());
        }

        public async Task<NoteCollection> CreateNoteCollectionAsync(NoteCollection noteCollection)
        {
            var entry = await dbContext.NoteCollections.AddAsync(noteCollection);
            await dbContext.SaveChangesAsync();
            return entry.Entity;
        }

        public Task<NoteCollection> UpdateNoteCollectionAsync(NoteCollection noteCollection)
        {
            throw new NotImplementedException();
        }

        public Task DeleteNoteCollectionByIdAsync(int noteCollectionId)
        {
            throw new NotImplementedException();
        }
    }
}
