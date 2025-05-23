﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    public readonly struct NoteSimilarityValue(int noteId, double value)
    {
        public int NoteId { get; init; } = noteId;
        public double Value { get; init; } = value;
    }

    public class NoteSimilarityResult
    {
        public NoteSimilarityResult(NoteSimilarityValue[] similarityValues, long duration, int significantCount = 0)
        {
            var values = similarityValues;
            Array.Sort(similarityValues, (x, y) => y.Value.CompareTo(x.Value));

            SimilarityValues = values;
            DurationMillisec = duration;
            SignificantCount = significantCount;
        }

        public NoteSimilarityValue[] SimilarityValues { get; init; }

        public long DurationMillisec { get; init; }

        public int SignificantCount { get; init; }
    }
}
