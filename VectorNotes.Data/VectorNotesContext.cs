using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using VectorNotes.DomainModel;

namespace VectorNotes.Data
{
    public class VectorNotesContext: DbContext
    {
        public DbSet<User> Users { get; init; }
        public DbSet<Note> Notes { get; init; }

        private string? _connectionString;
        public VectorNotesContext(IConfiguration configuration, DbContextOptions<VectorNotesContext> options): base(options)
        {
            _connectionString = configuration.GetConnectionString("VectorNotesDatabase");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("vectornotes");
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (string.IsNullOrEmpty(_connectionString))
            {
                throw new ArgumentException("Null or empty connection string");
            }
            optionsBuilder.UseSqlServer(_connectionString, options => options.MigrationsHistoryTable("__VectorNotesMigrationHistory"));
            base.OnConfiguring(optionsBuilder);
        }
    }
}
