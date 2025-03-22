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
            return await FindSimilarNotes(await domainUow.GetDefaultAlphabetAsync(), originalNote, maxCount);
        }

        private Task<NoteSimilarityResult> FindSimilarNotes(Alphabet alphabet, Note originalNote, int maxCount)
        {
            return Task.Run(async () =>
            {
                Stopwatch stopWatch = new();
                stopWatch.Start();

                var text = originalNote.Content;
                Log.Debug("Search begins: {samplePrefix}", text.Substring(0, Math.Min(16, text.Length)));

                var sampleVector = textVectorBuilder.BuildTextVector(alphabet, text);
                Log.Debug("Sample vector built.");

                NoteSimilarityValue[] similarityValues = new NoteSimilarityValue[maxCount];
                int i = 0;
                foreach (var note in await domainUow.GetAllNotesAsync())
                {
                    if (note.Id == originalNote.Id)
                    {
                        continue;
                    }

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
                    var similarity = textVector.Similarity(sampleVector);
                    similarityValues[i++] = new NoteSimilarityValue(note.Id, similarity);
                    Log.Debug("Text vector similarity for '{note}' calculated.", note.Title);
                }

                Log.Debug("Similarity results sorted.");
                stopWatch.Stop();
                Log.Debug("Found in {elapsed} ms.", stopWatch.ElapsedMilliseconds);


                return new NoteSimilarityResult(similarityValues, stopWatch.ElapsedMilliseconds, GetSignificantCount(similarityValues));
            });
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

    }

}
