using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    public interface ITextVectorBuilder
    {
        HiDimBipolarVector BuildTextVector(Alphabet alphabet, string sample);
    }
}
