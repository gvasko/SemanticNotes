using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    public class Alphabet
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OwnerId { get; set; }
        public User? Owner { get; set; }
        public List<LetterVector> LetterVectors { get; set; }

        public Alphabet()
        {
            Name = "";
            LetterVectors = [];
        }

        internal Alphabet(string name, int dim, IVectorFactory vectorFactory)
        {
            Name = name;
            LetterVectors = new List<LetterVector>();
            LetterVectors.Add(new LetterVector(' ', vectorFactory.CreateLetterVectorFor(dim, ' ')));
            for (char c = 'a'; c <= 'z'; c++)
            {
                LetterVectors.Add(new LetterVector(c, vectorFactory.CreateLetterVectorFor(dim, c)));
            }
        }

        public int Dim
        {
            get
            {
                return LetterVectors.Count == 0 ? 0 : LetterVectors[0].Vector.Length;
            }
        }

        public HiDimBipolarVector GetVectorForLetter(char letter)
        {
            var ll = Char.ToLower(letter);
            return LetterVectors.First(x => x.Letter == ll).Vector;
        }

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(Name);
            sb.Append(Environment.NewLine);
            sb.Append(Dim);
            sb.Append(Environment.NewLine);
            foreach (var letter in LetterVectors)
            {
                sb.Append($"{letter.Letter}: [{letter.Vector.ToString()}]");
                sb.Append(Environment.NewLine);
            }
            return sb.ToString();
        }
    }
}
