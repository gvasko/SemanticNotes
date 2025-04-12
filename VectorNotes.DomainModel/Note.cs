using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    public class Note
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int NoteCollectionId { get; set; }
        public NoteCollection? NoteCollection { get; set; }

        public IList<Tag> Tags { get; init; }

        public Note()
        {
            Title = string.Empty;
            Content = string.Empty;
            Tags = [];
        }

        public void AddTag(Tag tag)
        {
            var found = Tags.FirstOrDefault(t => t == tag);
            if (found == null)
            {
                Tags.Add(tag);
            }
        }

        public void RemoveTag(Tag tag)
        {
            var found = Tags.FirstOrDefault(t => t == tag);
            if (found != null)
            {
                Tags.Remove(found);
            }
        }
    }
}
