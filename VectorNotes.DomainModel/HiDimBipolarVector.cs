using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    /// <summary>
    /// VO
    /// </summary>
    public class HiDimBipolarVector
    {
        private BitArray _data;
        public BitArray Data
        {
            get
            {
                // defensive copy
                return new BitArray(_data);
            }
            init
            {
                // defensive copy
                _data = new BitArray(value);
            }
        }

        public static HiDimBipolarVector CreateRandomVector(int size)
        {
            var v = new BitArray(size);

            var random = new Random();

            for (int i = 0; i < size / 2; i++)
            {
                while (true)
                {
                    var index = random.Next(size);
                    if (v[index])
                    {
                        continue;
                    }
                    else
                    {
                        v[index] = true;
                        break;
                    }
                }
            }

            return new HiDimBipolarVector(v);
        }

        public HiDimBipolarVector()
            : this(8, 0)
        {

        }

        public HiDimBipolarVector(int[] data)
        {
            _data = new BitArray(data);
        }

        public HiDimBipolarVector(byte[] data)
        {
            _data = new BitArray(data);
        }

        public HiDimBipolarVector(int size, int data)
        {
            var bitData = new BitArray(size);
            for (int i = 0; i < size; i++)
            {
                var value = (((data >> i) & 1) == 1);
                bitData[i] = value;
            }
            _data = bitData;
        }

        private HiDimBipolarVector(BitArray data)
        {
            _data = new BitArray(data);
        }

        public int Length
        {
            get { return Data.Length; }
        }

        public int this[int index]
        {
            get
            {
                return IsPositive(index) ? 1 : -1;
            }
        }

        private bool IsPositive(int index)
        {
            return !Data[index];
        }

        //public NaiveHiDimBipolarVector Add(NaiveHiDimBipolarVector other)
        //{
        //    // adding 2 bipolar vectors does not make much sense
        //    throw new NotImplementedException();
        //}

        public HiDimBipolarVector Multiply(HiDimBipolarVector other)
        {
            // implicit defensive copies are used
            var newData = Data.Xor(other.Data);
            return new HiDimBipolarVector(newData);
        }

        public HiDimBipolarVector Permute()
        {
            var highestBit = _data[^1];
            var newData = Data.LeftShift(1);    // using defensive copy
            newData[0] = highestBit;
            return new HiDimBipolarVector(newData);
        }

        public double Similarity(HiDimBipolarVector other)
        {
            if (Length != other.Length)
            {
                throw new ArgumentException("Vector dimensions not equal");
            }

            double hammingDistance = Multiply(other).NumberOfNegatives();
            return Math.Abs(hammingDistance - Length / 2) / (Length / 2);
        }

        public int NumberOfPositives()
        {
            int sum = 0;
            for (int i = 0; i < Length; ++i)
            {
                if (IsPositive(i))
                {
                    sum++;
                }
            }
            return sum;
        }

        public int NumberOfNegatives()
        {
            return Length - NumberOfPositives();
        }

        public int VectorLength()
        {
            return NumberOfPositives();
        }

        public int[] ToIntArray()
        {
            var additionalInt = _data.Length % 32 == 0 ? 0 : 1;
            int[] intData = new int[_data.Length / 32 + additionalInt];
            _data.CopyTo(intData, 0);
            return intData;
        }

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            int[] intData = ToIntArray();
            bool first = true;
            foreach (var i in intData)
            {
                if (!first)
                {
                    sb.Append(", ");
                }
                sb.Append(i);
                first = false;
            }
            return sb.ToString();
        }
    }
}
