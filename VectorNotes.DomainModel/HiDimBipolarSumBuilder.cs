using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    internal class HiDimBipolarSumBuilder
    {
        private int[] _sum;

        public HiDimBipolarSumBuilder(int size)
        {
            var adjustedSize = size % 32 == 0 ? size : (size / 32 + 1) * 32;
            _sum = new int[adjustedSize];
        }

        public void Add(HiDimBipolarVector vector)
        {
            if (vector.Length != _sum.Length)
            {
                throw new ArgumentException($"Dimensions not the same, sum: {_sum.Length}, vector: {vector.Length}");
            }

            for (int i = 0; i < _sum.Length; i++)
            {
                _sum[i] += vector[i];
            }
        }

        public HiDimBipolarVector BuildVector()
        {
            var intLen = _sum.Length / 32;
            var newVector = new int[intLen];
            for (int i = 0; i < intLen; i++)
            {
                int newIntVal = 0;

                for (int j = 0; j < 32; j++)
                {
                    var coordVal = _sum[i * 32 + j];
                    var bit = coordVal < 0 ? 1 : 0;
                    newIntVal |= bit << j;
                }

                newVector[i] = newIntVal;
            }

            return new HiDimBipolarVector(newVector);
        }
    }
}
