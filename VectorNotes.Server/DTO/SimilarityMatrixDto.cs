namespace VectorNotes.Server.DTO
{
    public class SimilarityMatrixDto
    {
        public int[] NoteIds { get; set; }
        public double[][] Values { get; set; }

        public SimilarityMatrixDto()
        {
            NoteIds = [];
            Values = [];
        }
    }
}
