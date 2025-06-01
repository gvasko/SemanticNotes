using Serilog;
using System;
using System.Collections.Concurrent;
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

            return await FindSimilarNotesAsync(await domainUow.GetDefaultAlphabetAsync(), originalNote, maxCount, originalNote.NoteCollection);
        }

        public async Task<NoteSimilarityResult> FindSimilarNotesInCollection(Note originalNote, int maxCount, NoteCollection targetCollection)
        {
            return await FindSimilarNotesAsync(await domainUow.GetDefaultAlphabetAsync(), originalNote, maxCount, targetCollection);
        }

        private async Task<NoteSimilarityResult> FindSimilarNotesAsync(Alphabet alphabet, Note originalNote, int maxCount, NoteCollection targetCollection)
        {
            Stopwatch stopWatch = new();
            stopWatch.Start();

            var originalTextVector = await EnsureTextVectorFromCache(alphabet, originalNote);

            ConcurrentBag<NoteSimilarityValue> similarityValues = new();

            var noteList = (await domainUow.GetNoteCollectionByIdAsync(targetCollection.Id))?.Notes ?? [];

            var textVectors = await EnsureTextVectorsFromCache(alphabet, noteList);

            Log.Debug("Parallel work started...");
            Parallel.ForEach(noteList, note =>
            {
                if (note.Id == originalNote.Id)
                {
                    return;
                }

                Log.Debug("Text vector similarity for '{note}' ...", note.Title);
                HiDimBipolarVector textVector = textVectors[note.Id];
                var similarity = textVector.Similarity(originalTextVector);
                similarityValues.Add(new NoteSimilarityValue(note.Id, similarity));
                Log.Debug("Text vector similarity for '{note}' calculated.", note.Title);
            });
            Log.Debug("Parallel work ended...");

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
        }

        private async Task<IDictionary<int, HiDimBipolarVector>> EnsureTextVectorsFromCache(Alphabet alphabet, IList<Note> noteList)
        {
            Dictionary<int, HiDimBipolarVector> cachedVectors = new();

            foreach (var note in noteList)
            {
                var textVector = (await domainUow.GetTextVectorFromCacheAsync(note, alphabet))?.Vector;
                if (textVector != null)
                {
                    cachedVectors.Add(note.Id, textVector);
                }
            }

            var notYetCached = noteList.Where(note => !cachedVectors.ContainsKey(note.Id));

            Log.Debug("Parallel work started...");
            ConcurrentDictionary<int, HiDimBipolarVector> newVectors = new();
            Parallel.ForEach(notYetCached, note =>
            {
                Log.Debug("Text vector for '{note}' not found in cache. Calculating...", note.Title);
                var newTextVector = textVectorBuilder.BuildTextVector(alphabet, note.Content);
                newVectors.TryAdd(note.Id, newTextVector);
                Log.Debug("Text vector for '{note}' generated.", note.Title);
            });
            Log.Debug("Parallel work ended...");

            foreach (var newVector in newVectors)
            {
                var note = noteList.First(n => n.Id == newVector.Key);
                var textVector = newVector.Value;
                await domainUow.CreateOrUpdateTextVectorInCacheAsync(note, alphabet, textVector);
                cachedVectors.Add(note.Id, textVector);
                Log.Debug("Text vector for '{note}' stored in cache.", note.Title);
            }
            await domainUow.SaveAsync();

            return cachedVectors;
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
