using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    public class NoteTextVectorCache
    {
        public int Id { get; set; }
        public int? NoteId { get; set; }
        public Note? Note { get; set; }
        public int? AlphabetId { get; set; }
        public Alphabet? Alphabet { get; set; }
        public HiDimBipolarVector Vector { get; set; }

        public NoteTextVectorCache()
        {
            Vector = new HiDimBipolarVector();
        }

        public NoteTextVectorCache(int noteId, int alphabetId, HiDimBipolarVector vector)
        {
            NoteId = noteId;
            AlphabetId = alphabetId;
            Vector = vector;
        }
    }
}
