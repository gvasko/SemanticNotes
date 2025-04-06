using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    public interface INoteSimilarityFinderService
    {
        Task<NoteSimilarityResult> FindSimilarNotes(Note originalNote, int maxCount);
        Task<HiDimBipolarVector> GetTextVector(Note note);
    }
}
