using Serilog;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VectorNotes.DomainModel
{
    public class NoteSimilarityFinderService : INoteSimilarityFinderService
    {
        private readonly IDomainUnitOfWork domainUow;
        private readonly ITextVectorBuilder textVectorBuilder;
        public NoteSimilarityFinderService(IDomainUnitOfWork domainUow, ITextVectorBuilder textVectorBuilder)
        {
            this.domainUow = domainUow;
            this.textVectorBuilder = textVectorBuilder;
        }

        public async Task<NoteSimilarityResult> FindSimilarNotes(Note originalNote, int maxCount)
        {
            if (originalNote.NoteCollection == null)
            {
                return new NoteSimilarityResult([], 0);
            }

            return await FindSimilarNotes(await domainUow.GetDefaultAlphabetAsync(), originalNote, maxCount, originalNote.NoteCollection);
        }

        public async Task<NoteSimilarityResult> FindSimilarNotesInCollection(Note originalNote, int maxCount, NoteCollection targetCollection)
        {
            return await FindSimilarNotes(await domainUow.GetDefaultAlphabetAsync(), originalNote, maxCount, targetCollection);
        }

        private Task<NoteSimilarityResult> FindSimilarNotes(Alphabet alphabet, Note originalNote, int maxCount, NoteCollection targetCollection)
        {
            return Task.Run(async () =>
            {
                Stopwatch stopWatch = new();
                stopWatch.Start();

                var originalTextVector = await EnsureTextVectorFromCache(alphabet, originalNote);

                IList<NoteSimilarityValue> similarityValues = new List<NoteSimilarityValue>();

                var noteList = (await domainUow.GetNoteCollectionByIdAsync(targetCollection.Id))?.Notes ?? [];

                foreach (var note in noteList)
                {
                    if (note.Id == originalNote.Id)
                    {
                        continue;
                    }

                    HiDimBipolarVector textVector = await EnsureTextVectorFromCache(alphabet, note);
                    var similarity = textVector.Similarity(originalTextVector);
                    similarityValues.Add(new NoteSimilarityValue(note.Id, similarity));
                    Log.Debug("Text vector similarity for '{note}' calculated.", note.Title);
                }

                Log.Debug("Similarity results sorted.");
                stopWatch.Stop();
                Log.Debug("Found in {elapsed} ms.", stopWatch.ElapsedMilliseconds);

                var similarityValuesArray = similarityValues.ToArray();
                var fullSimilarityResult = new NoteSimilarityResult(similarityValuesArray, stopWatch.ElapsedMilliseconds, GetSignificantCount(similarityValuesArray));
                var firstFewSimilarityResult = new NoteSimilarityResult(
                    fullSimilarityResult.SimilarityValues.Take(maxCount).ToArray(),
                    fullSimilarityResult.DurationMillisec,
                    Math.Min(fullSimilarityResult.SignificantCount, maxCount));
                return firstFewSimilarityResult;
            });
        }

        private async Task<HiDimBipolarVector> EnsureTextVectorFromCache(Alphabet alphabet, Note note)
        {
            var textVector = (await domainUow.GetTextVectorFromCacheAsync(note, alphabet))?.Vector;

            if (textVector == null)
            {
                Log.Debug("Text vector for '{note}' not found in cache. Calculating...", note.Title);
                textVector = textVectorBuilder.BuildTextVector(alphabet, note.Content);
                Log.Debug("Text vector for '{note}' generated.", note.Title);
                await domainUow.CreateOrUpdateTextVectorInCacheAsync(note, alphabet, textVector);
                await domainUow.SaveAsync();
                Log.Debug("Text vector for '{note}' stored in cache.", note.Title);
            }
            else
            {
                Log.Debug("Text vector for '{note}' loaded from cache.", note.Title);
            }

            return textVector;
        }

        private static int GetSignificantCount(NoteSimilarityValue[] similarityValues)
        {
            double mean = 0.0;
            foreach (var similarityValue in similarityValues)
            {
                mean += similarityValue.Value;
            }
            mean /= similarityValues.Length;

            double stdDeviation = 0.0;
            foreach (var similarityValue in similarityValues)
            {
                var diff = similarityValue.Value - mean;
                stdDeviation += diff * diff;
            }
            stdDeviation = Math.Sqrt(stdDeviation / similarityValues.Length);

            int count = 0;
            foreach (var similarityValue in similarityValues)
            {
                if (similarityValue.Value - mean - stdDeviation > 0) count++;
            }

            return count;
        }

        public async Task<HiDimBipolarVector> GetTextVector(Note note)
        {
            return await EnsureTextVectorFromCache(await domainUow.GetDefaultAlphabetAsync(), note);
        }
    }

}
