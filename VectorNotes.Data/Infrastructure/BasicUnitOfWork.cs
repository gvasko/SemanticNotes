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

        public async Task<Note> CreateNoteAsync(Note note)
        {
            var entry = await dbContext.Notes.AddAsync(note);
            return entry.Entity;
        }

        public Task DeleteNoteByIdAsync(int noteId)
        {
            throw new NotImplementedException();
        }

        public IQueryable<Note> GetAllNotes()
        {
            return dbContext.Notes.AsNoTracking();
        }

        public async Task<Note?> GetNoteByIdAsync(int id)
        {
            return await dbContext.Notes.AsNoTracking().FirstOrDefaultAsync(note => note.Id == id);
        }

        public async Task SaveAsync()
        {
            await dbContext.SaveChangesAsync();
        }
    }
}
