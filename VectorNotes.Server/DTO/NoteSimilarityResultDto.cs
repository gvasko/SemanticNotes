namespace VectorNotes.Server.DTO
{
    public class NoteSimilarityValueDto
    {
        public int NoteId { get; set; }
        public double Value { get; set; }
    }

    public class NoteSimilarityResultDto
    {
        public NoteSimilarityValueDto[]? SimilarityValues { get; set; }
        public long DurationMillisec { get; set; }
        public int SignificantCount { get; set; }
    }
}
