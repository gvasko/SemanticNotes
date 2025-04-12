using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Configuration;
using System.Collections;
using VectorNotes.DomainModel;

namespace VectorNotes.Data
{
    public class VectorNotesContext: DbContext
    {
        public DbSet<User> Users { get; init; }
        public DbSet<Note> Notes { get; init; }
        public DbSet<NoteCollection> NoteCollections { get; init; }
        public DbSet<NoteTextVector> NoteTextVectorCache { get; init; }
        public DbSet<Alphabet> Alphabets { get; init; }

        private string? _connectionString;
        public VectorNotesContext(IConfiguration configuration, DbContextOptions<VectorNotesContext> options): base(options)
        {
            _connectionString = configuration.GetConnectionString("VectorNotesDatabase");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("vectornotes");

            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

            modelBuilder.Entity<Note>(note =>
            {
                note.OwnsMany(n => n.Tags, tag =>
                {
                    tag.WithOwner().HasForeignKey("NoteId");
                    tag.HasKey(["NoteId", "Name", "Value"]);
                    tag.ToTable("Tags");
                });
            });

            modelBuilder.Entity<NoteCollection>(nc =>
            {
                nc.HasOne(nc => nc.Owner)
                    .WithMany()
                    .HasForeignKey(nc => nc.OwnerId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<NoteTextVector>(c =>
            {
                c.OwnsOne(e => e.Vector, b =>
                {
                    b.Property(v => v.Data).HasConversion(
                        bitArray => ConvertToBytes(bitArray),
                        bytes => ConvertToBitArray(bytes)
                    );
                });
            });

            modelBuilder.Entity<Alphabet>(a =>
            {
                a.OwnsMany(e => e.LetterVectors, (OwnedNavigationBuilder<Alphabet, LetterVector> b) =>
                {
                    b.OwnsOne(e => e.Vector, (OwnedNavigationBuilder<LetterVector, HiDimBipolarVector> c) =>
                    {
                        c.Property(v => v.Data).HasConversion(
                            bitArray => ConvertToBytes(bitArray),
                            bytes => ConvertToBitArray(bytes)
                        );
                    });
                });
            });
            modelBuilder.Entity<Alphabet>().Navigation(a => a.LetterVectors).AutoInclude(false);

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

        private static byte[] ConvertToBytes(BitArray bitArray)
        {
            var bytes = new byte[bitArray.Length / 8];
            bitArray.CopyTo(bytes, 0);
            return bytes;
        }

        private static BitArray ConvertToBitArray(byte[] bytes)
        {
            return new BitArray(bytes);
        }

    }
}
