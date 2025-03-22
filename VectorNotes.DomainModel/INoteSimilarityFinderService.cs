using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    interface INoteSimilarityFinderService
    {
        Task<NoteSimilarityResult> FindSimilarNotes(Note originalNote, int maxCount);
    }
}
