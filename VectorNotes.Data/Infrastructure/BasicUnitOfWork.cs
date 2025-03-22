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
        }

        public async Task<Alphabet> CreateAlphabetAsync(Alphabet alphabet)
        {
            var entry = await dbContext.Alphabets.AddAsync(alphabet);
            return entry.Entity;
        }

        public async Task<Note> CreateNoteAsync(Note note)
        {
            var entry = await dbContext.Notes.AddAsync(note);
            return entry.Entity;
        }

        public Task DeleteNoteByIdAsync(int noteId)
        {
            throw new NotImplementedException();
        }

        public Task<IQueryable<Alphabet>> GetAllAlphabetsAsync()
        {
            return Task.FromResult(dbContext.Alphabets.AsNoTracking());
        }

        public Task<IQueryable<Note>> GetAllNotesAsync()
        {
            return Task.FromResult(dbContext.Notes.AsNoTracking());
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

        public Task<Note> UpdateNoteAsync(Note note)
        {
            return Task.FromResult(dbContext.Notes.Update(note).Entity);
        }

   }
}
