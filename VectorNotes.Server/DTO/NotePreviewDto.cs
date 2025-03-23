namespace VectorNotes.Server.DTO
{
    public record class NotePreviewDto(int Id, string Title, string ContentPreview)
    {
        public NotePreviewDto() : this(0, "", "")
        {
        }
    }
}
