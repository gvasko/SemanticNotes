using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    public class NoteCollection
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OwnerId { get; set; }
        public User? Owner { get; set; }

        public IList<Note> Notes { get; set; }

        public NoteCollection()
        {
            Name = string.Empty;
            Notes = [];
        }
    }
}
