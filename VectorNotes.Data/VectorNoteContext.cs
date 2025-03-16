using Microsoft.EntityFrameworkCore;
using VectorNotes.DomainModel;

namespace VectorNotes.Data
{
    public class VectorNoteContext: DbContext
    {
        public DbSet<User> Users { get; init; }
        public DbSet<Note> Notes { get; init; }

        public VectorNoteContext(DbContextOptions<VectorNoteContext> options): base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("vectornotes");
            //modelBuilder.Entity<Note>().HasQueryFilter(note => note.OwnerId)
            base.OnModelCreating(modelBuilder);
        }
    }
}
