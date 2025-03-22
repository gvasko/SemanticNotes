using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    /// <summary>
    /// VO
    /// </summary>
    public class LetterVector
    {
        public char Letter { get; init; }
        public HiDimBipolarVector Vector { get; init; }

        public LetterVector()
        {
            Vector = new HiDimBipolarVector();
        }

        public LetterVector(char letter, HiDimBipolarVector vector)
        {
            Letter = letter;
            Vector = vector;
        }
    }
}
